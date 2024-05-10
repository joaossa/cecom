exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('unidadesorganizacionais', table => {
      table.integer('codigo').notNullable().primary(); // Primary key, assuming int4 maps to integer in Knex
      table.string('descricao', 100).notNullable();
      table.string('siglaUnidade', 10).nullable(); // 'siglaUnidade' field
      table.string('endereco', 150).nullable();
      table.string('telefone', 50).nullable();
      table.integer('codigocidade').notNullable(); // Foreign key column
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.unidadesorganizacionais_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.unidadesorganizacionais ALTER COLUMN codigo SET DEFAULT nextval('cecom.unidadesorganizacionais_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_unidadesorganizacionais()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.unidadesorganizacionais_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_unidadesorganizacionais
      BEFORE INSERT ON cecom.unidadesorganizacionais
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_unidadesorganizacionais();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.unidadesorganizacionais ADD CONSTRAINT unidadesorganizacionais_cdcidade_foreign FOREIGN KEY (codigocidade) REFERENCES cecom.cidades(codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('unidadesorganizacionais')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_unidadesorganizacionais();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.unidadesorganizacionais_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.unidadesorganizacionais DROP CONSTRAINT IF EXISTS unidadesorganizacionais_cdcidade_foreign;
    `));
};
