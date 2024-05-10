exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('master', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.integer('codigomaster').notNullable(); // Foreign key to self
      table.string('nome', 50).notNullable();
      table.string('email', 200).notNullable();
      table.timestamp('dt_atualizacao', { useTz: true }).defaultTo(knex.fn.now());
      table.string('password', 255).notNullable();
      table.boolean('admin').defaultTo(false).notNullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.master_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.master ALTER COLUMN codigo SET DEFAULT nextval('cecom.master_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_master()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.master_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_master
      BEFORE INSERT ON cecom.master
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_master();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.master ADD CONSTRAINT master_email_unique UNIQUE (email);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.master ADD CONSTRAINT master_codigomaster_foreign FOREIGN KEY (codigomaster) REFERENCES cecom.master(codigo);
    `));
};

exports.down = function(knex) {
  return knex.schema.withSchema('cecom')
    .dropTable('master')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_master();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.master_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.master DROP CONSTRAINT IF EXISTS master_email_unique;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.master DROP CONSTRAINT IF EXISTS master_codigomaster_foreign;
    `));
};
