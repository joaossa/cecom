exports.up = function(knex) {
  return knex.schema.createTable('cecom.financeiro', table => {
    table.increments('cd_financeiro').primary();
    table.integer('codigoprof').notNullable();
    table.integer('codigomasterpac').notNullable();
    table.integer('codigopaciente').notNullable();
    table.smallint('qtd_parcelas').notNullable();
    table.decimal('valor_total').notNullable();
    table.smallint('qtd_evolucoes').notNullable();
    table.smallint('cd_tipoprocedimento').notNullable();
    table.timestamp('dt_registro').nullable();

    // Foreign Keys
    table.foreign('codigoprof').references('cecom.profissionais.codigoprof');
    table.foreign(['codigomasterpac', 'codigopaciente']).references('cecom.pacientes.codigomaster', 'cecom.pacientes.codigopaciente');
    table.foreign('cd_tipoprocedimento').references('cecom.tiposprocedimentos.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.financeiro');
};