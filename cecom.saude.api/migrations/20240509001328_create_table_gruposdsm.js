exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('gruposdsm', table => {
      table.integer('codigo').notNullable().primary();
      table.string('descricao', 250).notNullable();
      table.integer('codigopai').nullable();
      table.foreign('codigopai').references('codigo').inTable('cecom.gruposdsm'); // Auto-referencing foreign key
      table.integer('versao').nullable(); // Descrição adicional no comentário
      table.check('versao IS NULL OR versao IN (4, 5)'); // Check constraint
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.gruposdsm_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposdsm ALTER COLUMN codigo SET DEFAULT nextval('cecom.gruposdsm_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_gruposdsm()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.gruposdsm_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_gruposdsm
      BEFORE INSERT ON cecom.gruposdsm
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_gruposdsm();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('gruposdsm')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_gruposdsm();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.gruposdsm_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposdsm DROP CONSTRAINT IF EXISTS ckc_versao_gruposdsm;
    `));
};
