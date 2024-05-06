exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('horarios', table => {
      table.integer('codigo').notNullable().primary();
      table.string('st_usorestrito', 1).nullable();
      table.string('descricao', 50).notNullable();
      table.timestamp('hr_inicio', { useTz: true }).notNullable();
      table.timestamp('hr_fim', { useTz: true }).nullable();
      table.string('st_inativo', 1).nullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.horarios_codigo_seq
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.horarios ALTER COLUMN codigo SET DEFAULT nextval('cecom.horarios_codigo_seq')
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.func_codigo_horario()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.horarios_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo
      BEFORE INSERT ON cecom.horarios
      FOR EACH ROW
      EXECUTE FUNCTION cecom.func_codigo_horario();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.horarios ADD CONSTRAINT ckc_st_inativo_horarios CHECK (st_inativo IN ('S', 'N'))
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.horarios ADD CONSTRAINT ckc_st_usorestrito_horarios CHECK (st_usorestrito IN ('S', 'N'))
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('horarios')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.func_codigo_horario();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.horarios_codigo_seq;"));
};
