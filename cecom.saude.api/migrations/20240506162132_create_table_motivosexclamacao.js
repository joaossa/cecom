exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('motivosexclamacao', table => {
      table.integer('codigo').notNullable().primary();
      table.string('descricao', 50).notNullable();
      table.string('stinativo', 1).defaultTo('N').nullable(); // S-Sim, N-Não
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.motivosexclamacao_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.motivosexclamacao ALTER COLUMN codigo SET DEFAULT nextval('cecom.motivosexclamacao_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_motivosexclamacao()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.motivosexclamacao_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_motivosexclamacao
      BEFORE INSERT ON cecom.motivosexclamacao
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_motivosexclamacao();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.motivosexclamacao ADD CONSTRAINT ck_st_stinativomotivo CHECK (stinativo IN ('S', 'N'))
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('motivosexclamacao')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_motivosexclamacao();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.motivosexclamacao_codigo_seq;"));
};
