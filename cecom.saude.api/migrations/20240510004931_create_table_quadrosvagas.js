exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('quadrosvagas', table => {
      table.integer('codigo').notNullable().primary(); // Primary key, utilizando integer e uma sequência personalizada
      table.integer('codigoprof').notNullable().references('codigo').inTable('cecom.profissionais'); // Foreign key to profissionais
      table.timestamp('dt_vaga', { useTz: true }).notNullable();
      table.integer('cd_horario').notNullable().references('codigo').inTable('cecom.horarios'); // Foreign key to horarios
      table.integer('codigolocalatend').notNullable().references('codigo').inTable('cecom.locaisatendimentos'); // Foreign key to locaisatendimentos
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.quadrosvagas_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.quadrosvagas ALTER COLUMN codigo SET DEFAULT nextval('cecom.quadrosvagas_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_quadrosvagas()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.quadrosvagas_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_quadrosvagas
      BEFORE INSERT ON cecom.quadrosvagas
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_quadrosvagas();
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('quadrosvagas')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_quadrosvagas();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.quadrosvagas_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.quadrosvagas DROP CONSTRAINT IF EXISTS fk_quadrosvagas_horarios_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.quadrosvagas DROP CONSTRAINT IF EXISTS fk_quadrosvagas_locatend_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.quadrosvagas DROP CONSTRAINT IF EXISTS fk_quadrosvagas_prof;
    `));
};
