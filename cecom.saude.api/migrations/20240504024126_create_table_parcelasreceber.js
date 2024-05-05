exports.up = function(knex) {
  return knex.schema.createTable('cecom.parcelasreceber', table => {
    table.increments('cd_parcelasreceber').primary();
    table.integer('cd_itenfinanceiro').notNullable();
    table.integer('cd_financeiro').notNullable();
    table.smallint('numero_parcela').notNullable();
    table.decimal('valor_parcela').notNullable();
    table.smallint('cd_tiporecebimento').notNullable();
    table.timestamp('dt_pagamento').nullable();
    table.string('id_confirmacaopag', 50).nullable();

    // Primary Key
    table.unique(['cd_parcelasreceber', 'cd_financeiro', 'cd_itenfinanceiro']);

    // Foreign Keys
    table.foreign(['cd_financeiro', 'cd_itenfinanceiro']).references('cecom.financeiro.cd_financeiro', 'cecom.financeiro.cd_itenfinanceiro');
    table.foreign('cd_tiporecebimento').references('cecom.tiposrecebimento.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.parcelasreceber');
};
