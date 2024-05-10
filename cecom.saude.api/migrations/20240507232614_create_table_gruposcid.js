exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('gruposcid', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.string('descricao', 250).notNullable();
      table.integer('codigopai').nullable();  // Foreign key to the same table (self-referencing)
      table.integer('versao').nullable();  // Versão do CID
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.gruposcid_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposcid ALTER COLUMN codigo SET DEFAULT nextval('cecom.gruposcid_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_gruposcid()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.gruposcid_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_gruposcid
      BEFORE INSERT ON cecom.gruposcid
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_gruposcid();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposcid ADD CONSTRAINT ckc_versao_gruposci CHECK ((versao IS NULL) OR (versao IN (9, 10)));
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposcid ADD CONSTRAINT fk_gruposci_gruposci FOREIGN KEY (codigopai) REFERENCES cecom.gruposcid(codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema.withSchema('cecom')
    .dropTable('gruposcid')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_gruposcid();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.gruposcid_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposcid DROP CONSTRAINT IF EXISTS fk_gruposci_gruposci;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.gruposcid DROP CONSTRAINT IF EXISTS ckc_versao_gruposci;
    `));
};
