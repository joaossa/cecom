exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('cidades', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.string('descricao', 100).notNullable();
      table.integer('cdUf').notNullable(); // Asegure-se que o tipo e tamanho correspondam na tabela de referência
      table.integer('cdPais').notNullable(); // Foreign key column
      table.string('cepGeral', 9).notNullable();
      table.integer('cdIbge').nullable();
      table.string('stInativo', 1).defaultTo('N').nullable();
    })
    .then(() => knex.raw(`CREATE SEQUENCE cecom.cidades_codigo_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 32767 START 1 CACHE 1 NO CYCLE;`))
    .then(() => knex.raw(`ALTER TABLE cecom.cidades ALTER COLUMN codigo SET DEFAULT nextval('cecom.cidades_codigo_seq');`))
    .then(() => knex.raw(`CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_cidades() RETURNS TRIGGER AS $$ BEGIN IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN NEW.codigo := nextval('cecom.cidades_codigo_seq'); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;`))
    .then(() => knex.raw(`CREATE TRIGGER set_codigo_cidades BEFORE INSERT ON cecom.cidades FOR EACH ROW EXECUTE FUNCTION cecom.fc_set_codigo_cidades();`))
    .then(() => knex.raw(`ALTER TABLE cecom.cidades ADD CONSTRAINT cidades_cdpais_foreign FOREIGN KEY ("cdPais") REFERENCES cecom.paises(codigo);`))
    .then(() => knex.raw(`ALTER TABLE cecom.cidades ADD CONSTRAINT cidades_cduf_foreign FOREIGN KEY ("cdUf") REFERENCES cecom.unidadesfederacao(codigo);`));
};

exports.down = function(knex) {
  return knex.schema.withSchema('cecom').dropTable('cidades').then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_cidades();")).then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.cidades_codigo_seq;")).then(() => knex.raw(`ALTER TABLE cecom.cidades DROP CONSTRAINT IF EXISTS cidades_cdpais_foreign;`)).then(() => knex.raw(`ALTER TABLE cecom.cidades DROP CONSTRAINT IF EXISTS cidades_cduf_foreign;`));
};
