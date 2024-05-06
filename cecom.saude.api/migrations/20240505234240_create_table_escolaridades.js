exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('escolaridades', table => {
      table.integer('codigo').notNullable().primary();
      table.string('descricao', 50).notNullable();
      table.string('stinativo', 1).defaultTo('N').nullable(); // S-Sim, N-Não
    }).then(() => knex.raw(`
    ALTER TABLE cecom.escolaridades ADD CONSTRAINT ckc_st_inativo_escol CHECK (stinativo IN ('S', 'N'))
  `))
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.escolaridades_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      START 1
      CACHE 1;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.escolaridades ALTER COLUMN codigo SET DEFAULT nextval('cecom.escolaridades_codigo_seq'::regclass);
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.func_codigo_escol()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.escolaridades_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_escol
      BEFORE INSERT ON cecom.escolaridades
      FOR EACH ROW
      EXECUTE FUNCTION cecom.func_codigo_escol();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.escolaridades ADD CONSTRAINT ck_stinativo CHECK (stinativo IN ('S', 'N'))
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('escolaridades')
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.escolaridades_codigo_seq;"))
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.func_codigo_escol();"));
};
