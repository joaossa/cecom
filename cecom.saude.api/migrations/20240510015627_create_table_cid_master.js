exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('cid_master', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.string('cd_cid10', 7).nullable();
      table.string('ds_cid10', 250).notNullable();
      table.integer('codigopai').notNullable().references('codigo').inTable('cecom.cid_master'); // Self-reference foreign key
      table.integer('cd_grupocid').notNullable().references('codigo').inTable('cecom.gruposcid'); // Foreign key to gruposcid
      table.integer('versao').nullable(); // 9-CID9 10-CID10
      table.string('st_inativo', 1).defaultTo('N').notNullable(); // S-Sim, N-Não
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.cid_master_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 32767
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.cid_master ALTER COLUMN codigo SET DEFAULT nextval('cecom.cid_master_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_cid_master() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.cid_master_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_cid_master
      BEFORE INSERT ON cecom.cid_master
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_cid_master();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.cid_master ADD CONSTRAINT ckc_st_inativo_cid_master CHECK (st_inativo IN ('S', 'N'));
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.cid_master ADD CONSTRAINT ckc_versao_cid_master CHECK (versao IS NULL OR versao IN (9, 10));
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('cid_master')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_cid_master();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.cid_master_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.cid_master DROP CONSTRAINT IF EXISTS ckc_st_inativo_cid_master;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.cid_master DROP CONSTRAINT IF EXISTS ckc_versao_cid_master;
    `));
};
