exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('dsm_master', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.string('cd_dsm', 7).nullable();
      table.string('ds_dsm', 250).notNullable();
      table.integer('codigopai').notNullable(); // Foreign key to self
      table.integer('cd_grupodsm').notNullable(); // Foreign key to gruposdsm
      table.string('cd_cidrelaciondo', 7).nullable();
      table.integer('versao').nullable(); // Version, possibly 4 or 5
      table.string('st_inativo', 1).defaultTo('N').notNullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.dsm_master_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.dsm_master ALTER COLUMN codigo SET DEFAULT nextval('cecom.dsm_master_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_dsm_master() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.dsm_master_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_dsm_master
      BEFORE INSERT ON cecom.dsm_master
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_dsm_master();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.dsm_master ADD CONSTRAINT fk_cidsarahpai FOREIGN KEY (codigopai) REFERENCES cecom.dsm_master(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.dsm_master ADD CONSTRAINT fk_dsm_master_gruposdsm FOREIGN KEY (cd_grupodsm) REFERENCES cecom.gruposdsm(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.dsm_master ADD CONSTRAINT ckc_st_inativo_dsm_master CHECK (st_inativo IN ('S', 'N'));
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.dsm_master ADD CONSTRAINT ckc_versao_dsm_master CHECK (versao IS NULL OR versao IN (4, 5));
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('dsm_master')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_dsm_master();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.dsm_master_codigo_seq;"));
};
