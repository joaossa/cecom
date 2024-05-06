exports.up = function(knex) {
  // Usando knex.schema.raw para executar uma criação de tabela com SQL bruto
  return knex.schema.withSchema('cecom').raw(`
    CREATE TABLE cecom.cargos (
      codigo integer PRIMARY KEY,
      descricao varchar(50) NOT NULL,
      cdNivel integer,
      stInativo varchar(1) DEFAULT 'N' NULL,
      CONSTRAINT ckc_stInativo_cargos CHECK (stInativo IN ('S', 'N'))
    );
  `).then(() => knex.raw(`
    CREATE SEQUENCE cecom.cargos_codigo_seq
    INCREMENT BY 1
    MINVALUE 1
    START 1
    CACHE 1;
  `)).then(() => knex.raw(`
    CREATE OR REPLACE FUNCTION cecom.set_codigo_cargo()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
        NEW.codigo := nextval('cecom.cargos_codigo_seq');
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)).then(() => knex.raw(`
    CREATE TRIGGER set_cargos_codigo
    BEFORE INSERT ON cecom.cargos
    FOR EACH ROW
    EXECUTE FUNCTION cecom.set_codigo_cargo();
  `));
};

exports.down = function(knex) {
  return knex.schema.withSchema('cecom')
    .dropTable('cargos')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.set_codigo_cargo();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.cargos_codigo_seq;"));
};
