exports.up = function(knex) {
  return knex.schema.createTable('cecom.pacienteshumor', table => {
    table.increments('cd_pacientehumor').primary();
    table.integer('codigopacientemaster').notNullable();
    table.integer('codigopaciente').notNullable();
    table.timestamp('dt_humor').notNullable();
    table.integer('codigoevolucao').nullable();
    table.integer('codigoprof').nullable();
    table.integer('cidhumano').nullable();
    table.integer('dsmhumano').nullable();
    table.smallint('humorintensidade').notNullable();

    // Check Constraint
    table.checkConstraint('humorintensidade IN (1, 2, 3, 4, 5)');

    // Primary Key
    table.unique(['cd_pacientehumor', 'codigopacientemaster', 'codigopaciente']);

    // Foreign Keys
    table.foreign('cidhumano').references('cecom.cid_master.cd_cid_master');
    table.foreign('dsmhumano').references('cecom.dsm_master.cd_dsm_master');
    table.foreign(['codigoprof', 'codigoevolucao']).references('cecom.evolucoes.codigoprof', 'cecom.evolucoes.cd_evolucao');
    table.foreign(['codigopacientemaster', 'codigopaciente']).references('cecom.pacientes.codigomaster', 'cecom.pacientes.codigopaciente');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.pacienteshumor');
};