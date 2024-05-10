exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('pacientes', table => {
      table.integer('codigomaster').notNullable();
      table.integer('codigopaciente').notNullable().primary();
      table.string('nomepaciente', 100).notNullable();
      table.integer('codigoocupacao').nullable();
      table.timestamp('dt_admissao', { useTz: true }).nullable();
      table.integer('cd_escolaridade').nullable();
      table.string('nm_responsavel', 100).nullable();
      table.string('tp_parentesco', 1).defaultTo('R').notNullable(); // P-Pai M-Mãe T-Tutor legal F-Filho(a) C-Cônjuge O-Outro R-Sou o paciente
      table.integer('cd_escolaridaderesponsavel').nullable();
      table.integer('codigoocupacaoresponsavel').nullable();
      table.string('cpfresponsavel', 14).nullable();
      table.primary(['codigomaster', 'codigopaciente']); // Configura a chave primária composta
    })
    .then(() => knex.raw(`
      CREATE SEQUENCE cecom.pacientes_codigopaciente_seq
      INCREMENT BY 1
      MINVALUE 1
      MAXVALUE 2147483647
      START 1
      CACHE 1
      NO CYCLE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacientes ALTER COLUMN codigopaciente SET DEFAULT nextval('cecom.pacientes_codigopaciente_seq');
    `))
    .then(() => knex.raw(`
      CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_pacientes()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.codigopaciente IS NULL OR NEW.codigopaciente = 0 THEN
          NEW.codigopaciente := nextval('cecom.pacientes_codigopaciente_seq');
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `))
    .then(() => knex.raw(`
      CREATE TRIGGER set_codigo_pacientes
      BEFORE INSERT ON cecom.pacientes
      FOR EACH ROW
      EXECUTE FUNCTION cecom.fc_set_codigo_pacientes();
    `))
    .then(() => knex.raw(`
      ALTER TABLE cecom.pacientes ADD CONSTRAINT ckc_tp_parentesco CHECK (tp_parentesco IN ('P', 'M', 'T', 'F', 'C', 'O', 'R'))
    `))
    .then(() => {
      const foreignKeys = [
        { column: 'codigomaster', referenceTable: 'master', referenceColumn: 'codigo' },
        { column: 'cd_escolaridaderesponsavel', referenceTable: 'escolaridades', referenceColumn: 'codigo' },
        { column: 'cd_escolaridade', referenceTable: 'escolaridades', referenceColumn: 'codigo' },
        { column: 'codigoocupacao', referenceTable: 'ocupacoes', referenceColumn: 'codigo' },
        { column: 'codigoocupacaoresponsavel', referenceTable: 'ocupacoes', referenceColumn: 'codigo' }
      ];
      return Promise.all(foreignKeys.map(fk => 
        knex.raw(`ALTER TABLE cecom.pacientes ADD CONSTRAINT fk_pacientes_${fk.column}_foreign FOREIGN KEY (${fk.column}) REFERENCES cecom.${fk.referenceTable}(${fk.referenceColumn});`)
      ));
    });
};

exports.down = function(knex) {
  return knex.schema.withSchema('cecom').dropTable('pacientes').then(() => knex.raw("DROP FUNCTION IF EXISTS cecom.fc_set_codigo_pacientes();")).then(() => knex.raw("DROP SEQUENCE IF EXISTS cecom.pacientes_codigopaciente_seq;"));
};
