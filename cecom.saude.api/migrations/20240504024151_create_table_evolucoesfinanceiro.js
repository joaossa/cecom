exports.up = function(knex) {
  return knex.schema.createTable('cecom.evolucoesfinanceiro', function(table) {
    table.increments('cd_evolucaofinanceiro').primary();
    table.integer('cd_financeiro').notNullable();
    table.integer('cd_evolucao').notNullable();
    table.integer('codigoprof').notNullable();
    table.integer('codigomasterpac').notNullable();
    table.integer('codigopaciente').notNullable();

    // Primary Key
    table.unique('cd_evolucaofinanceiro');

    // Unique Constraint
    table.unique(['cd_evolucao', 'codigoprof', 'cd_financeiro', 'codigomasterpac', 'codigopaciente']);

    // Foreign Keys
    table.foreign(['cd_evolucao', 'codigoprof']).references('<?>().');
    table.foreign('cd_financeiro').references('cecom.financeiro.cd_financeiro');
    table.foreign(['codigomasterpac', 'codigopaciente']).references('cecom.pacientes.codigomaster', 'cecom.pacientes.codigopaciente');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.evolucoesfinanceiro');
};