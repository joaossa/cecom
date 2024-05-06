exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('motivosdesistencia', table => {
      table.integer('codigo').notNullable().primary();
      table.string('descricao', 50).notNullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.motivosdesistencia_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.motivosdesistencia ALTER COLUMN codigo SET DEFAULT nextval('cecom.motivosdesistencia_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_motivosdesistencia()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.motivosdesistencia_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_motivosdesistencia
      BEFORE INSERT ON cecom.motivosdesistencia
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_motivosdesistencia();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('motivosdesistencia')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_motivosdesistencia();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.motivosdesistencia_codigo_seq;"));
};

