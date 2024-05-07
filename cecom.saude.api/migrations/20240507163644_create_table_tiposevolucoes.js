exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('tiposevolucoes', table => {
      table.integer('codigo').notNullable().primary(); // Define 'codigo' como uma coluna inteira que será preenchida por uma sequência personalizada
      table.string('descricao', 50).notNullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.tiposevolucoes_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.tiposevolucoes ALTER COLUMN codigo SET DEFAULT nextval('cecom.tiposevolucoes_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_tiposevolucoes()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.tiposevolucoes_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_tiposevolucoes
      BEFORE INSERT ON cecom.tiposevolucoes
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_tiposevolucoes();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('tiposevolucoes')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_tiposevolucoes();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.tiposevolucoes_codigo_seq;"));
};
