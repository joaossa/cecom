exports.up = function(knex) {
  return knex.schema.createTable('cecom.parcelasreceber', table => {
    table.increments('cd_parcelasreceber').primary();
    table.integer('cd_itenfinanceiro').notNull();
    table.integer('cd_financeiro').notNull();
    table.smallint('numero_parcela').notNull();
    table.decimal('valor_parcela').notNull();
    table.smallint('cd_tiporecebimento').notNull();
    table.timestamp('dt_pagamento');
    table.string('id_confirmacaopag', 50);

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
