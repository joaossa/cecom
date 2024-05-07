exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('ocupacoes', table => {
      table.integer('codigo').notNullable().primary(); // Define 'codigo' como uma coluna inteira que será preenchida por uma sequência personalizada
      table.string('descricao', 250).notNullable();
      table.string('ocupacao', 10).nullable();
      table.integer('cd_ocupacaopai').nullable();
      table.string('stInativo', 1).defaultTo('N').nullable(); // S-Sim, N-Não
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.ocupacoes_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.ocupacoes ALTER COLUMN codigo SET DEFAULT nextval('cecom.ocupacoes_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_ocupacoes()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.ocupacoes_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_ocupacoes
      BEFORE INSERT ON cecom.ocupacoes
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_ocupacoes();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('ocupacoes')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_ocupacoes();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.ocupacoes_codigo_seq;"));
};