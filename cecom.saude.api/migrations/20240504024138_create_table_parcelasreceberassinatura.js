exports.up = function(knex) {
  return knex.schema.createTable('cecom.parcelasreceberassinatura', table => {
    table.increments('cd_parcelasreceberassinatura').primary();
    table.integer('cd_itemfinanassinatura').notNullable();
    table.smallint('numero_parcela').notNullable();
    table.decimal('valor_parcela').notNullable();
    table.smallint('cd_tiporecebimento').notNullable();
    table.timestamp('dt_pagamento').nullable();
    table.string('id_confirmacaopag', 50).nullable();

    // Primary Key
    table.unique(['cd_parcelasreceberassinatura', 'cd_itemfinanassinatura']);

    // Foreign Keys
    table.foreign('cd_itemfinanassinatura').references('cecom.itensfinanceirosassinaturas.cd_itemfinanassinatura');
    table.foreign('cd_tiporecebimento').references('cecom.tiposrecebimento.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.parcelasreceberassinatura');
};