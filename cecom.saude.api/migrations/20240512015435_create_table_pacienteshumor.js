exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('pacienteshumor', table => {
      table.integer('codigo').notNullable(); // Adjusted to use sequence
      table.integer('codigopacientemaster').notNullable();
      table.integer('codigopaciente').notNullable();
      table.timestamp('dt_humor', { useTz: true }).notNullable();
      table.integer('codigoevolucao').nullable();
      table.integer('codigoprof').nullable();
      table.integer('cidhumano').nullable().references('codigo').inTable('cecom.cid_master');
      table.integer('dsmhumano').nullable().references('codigo').inTable('cecom.dsm_master');
      table.integer('humorintensidade').notNullable().checkIn([1, 2, 3, 4, 5]);
      table.primary(['codigo', 'codigopacientemaster', 'codigopaciente']); // Set composite primary key
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.pacienteshumor_codigo_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor ALTER COLUMN codigo SET DEFAULT nextval('cecom.pacienteshumor_codigo_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_pacienteshumor()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN
          NEW.codigo := nextval('cecom.pacienteshumor_codigo_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_pacienteshumor
      BEFORE INSERT ON cecom.pacienteshumor
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_pacienteshumor();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor ADD CONSTRAINT fk_pacienteshumor_evol_foreign FOREIGN KEY (codigoprof, codigoevolucao) REFERENCES cecom.evolucoes(codigoprof, cd_evolucao);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor ADD CONSTRAINT fk_pacienteshumor_paciente FOREIGN KEY (codigopacientemaster, codigopaciente) REFERENCES cecom.pacientes(codigomaster, codigopaciente);
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor ADD CONSTRAINT ckc_humorintensidade_master CHECK ((humorintensidade IS NULL OR humorintensidade IN (1, 2, 3, 4, 5)));
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('pacienteshumor')
    .then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_pacienteshumor();"))
    .then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.pacienteshumor_codigo_seq;"))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor DROP CONSTRAINT IF EXISTS fk_pacienteshumor_evol_foreign;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor DROP CONSTRAINT IF EXISTS fk_pacienteshumor_paciente;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacienteshumor DROP CONSTRAINT IF EXISTS ckc_humorintensidade_master;
    `));
};
