exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('enderecos', table => {
      table.integer('codigo').notNullable().primary(); // Primary key
      table.string('enderecoresidencia', 125).nullable();
      table.string('nr_residencia', 10).nullable();
      table.string('complementoresidencia', 100).nullable();
      table.string('bairroresidencia', 100).nullable();
      table.string('cep_residencia', 10).nullable();
      table.integer('cdCidadeResidencia').notNullable(); // Foreign key column
      table.timestamp('dtAtualizacao').defaultTo(knex.fn.now()).nullable();
      table.string('telefone', 10).notNullable();
      table.string('tp_pessoalcontato', 1).nullable();
      table.integer('ddd').nullable();
      table.string('nm_contato', 100).nullable();
      table.string('tp_fone', 1).nullable();
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.enderecos_codigo_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START 1 CACHE 1 NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.enderecos ALTER COLUMN codigo SET DEFAULT nextval('cecom.enderecos_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_enderecos()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.enderecos_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_enderecos
      BEFORE INSERT ON cecom.enderecos
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_enderecos();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.enderecos ADD CONSTRAINT enderecos_cdcidaderesidencia_foreign FOREIGN KEY ("cdCidadeResidencia") REFERENCES cecom.cidades(codigo);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.enderecos ADD CONSTRAINT ckc_tp_fone_telefone CHECK (tp_fone IN ('R', 'T', 'C', 'P'));
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.enderecos ADD CONSTRAINT ckc_tp_pessoalcontato_telefone CHECK (tp_pessoalcontato IN ('P', 'C'));
    `));
};

exports.down = function(knex) {
  return knex.schema.withSchema('cecom').dropTable('enderecos')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_enderecos();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.enderecos_codigo_seq;"))
    .then(() => knex.raw("ALTER TABLE cecom.enderecos DROP CONSTRAINT IF EXISTS enderecos_cdcidaderesidencia_foreign;"))
    .then(() => knex.raw("ALTER TABLE cecom.enderecos DROP CONSTRAINT IF EXISTS ckc_tp_fone_telefone;"))
    .then(() => knex.raw("ALTER TABLE cecom.enderecos DROP CONSTRAINT IF EXISTS ckc_tp_pessoalcontato_telefone;"));
};
