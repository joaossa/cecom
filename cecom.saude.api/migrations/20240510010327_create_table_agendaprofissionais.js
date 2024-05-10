exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('agendaprofissionais', table => {
      table.integer('codigo').notNullable(); // Vamos assumir que este é um identificador único, mas a chave primária será composta
      table.integer('codigoprof').notNullable().references('codigo').inTable('cecom.profissionais'); // FK para profissionais
      table.string('nomepaciente', 100).notNullable();
      table.string('telefonepaciente', 50).notNullable();
      table.string('emailpaciente', 200).nullable();
      table.integer('codigopacientemaster').nullable(); // Assumindo que precisa ser uma FK composta que será ajustada abaixo
      table.integer('codigopaciente').nullable(); // Parte da FK composta
      table.timestamp('dt_agendamento', { useTz: true }).notNullable();
      table.integer('cd_horario').notNullable().references('codigo').inTable('cecom.horarios'); // FK para horarios
      table.integer('codigolocalatend').notNullable().references('codigo').inTable('cecom.locaisatendimentos'); // FK para locais de atendimento
      table.integer('motivodesistencia').nullable().references('codigo').inTable('cecom.motivosdesistencia'); // FK para motivos de desistência
      table.integer('codigovaga').nullable().references('codigo').inTable('cecom.quadrosvagas'); // FK para quadros de vagas
      table.primary(['codigo', 'codigoprof']); // Chave primária composta
    })
    .then(() => knex.raw(`
      ALTER TABLE cecom.agendaprofissionais ADD CONSTRAINT fk_agendaprofissionais_paciente FOREIGN KEY (codigopacientemaster, codigopaciente) REFERENCES cecom.pacientes(codigomaster, codigopaciente);
    `));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('agendaprofissionais');
};
