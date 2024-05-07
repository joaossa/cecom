exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('planos', table => {
      table.integer('codigo').notNullable().primary(); // O IDENTITY é manualmente manejado com sequences em migrações anteriores
      table.string('descricao', 50).notNullable();
      table.decimal('valor', 14, 2).notNullable(); // money type é convertido para decimal para compatibilidade
      table.integer('qtd_profissionais').notNullable();
      table.integer('qtd_clinicas').notNullable();
      table.timestamp('validade_inicio', { useTz: true }).notNullable();
      table.timestamp('validade_final', { useTz: true }).nullable();
      table.string('st_inativo', 1).nullable(); // S-Sim, N-Não
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.planos_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      START 1
      CACHE 1;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.planos ALTER COLUMN codigo SET DEFAULT nextval('cecom.planos_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_planos()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.planos_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_planos
      BEFORE INSERT ON cecom.planos
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_planos();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.planos ADD CONSTRAINT ckc_st_inativo_horarios CHECK (st_inativo IN ('S', 'N'))
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('planos')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_planos();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.planos_codigo_seq;"));
};
