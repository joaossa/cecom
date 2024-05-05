exports.up = function(knex) {
  return knex.schema.createTable('cecom.itensfinanceirosassinaturas', table => {
    table.increments('cd_itemfinanassinatura').primary();
    table.integer('codigoassinante').notNull();
    table.integer('codigoplano').notNull();
    table.integer('codigoassinatura').notNull();
    table.decimal('valor_parcela').notNull();
    table.timestamp('dt_vencimento');

    // Foreign Key
    table.foreign(['codigoassinante', 'codigoplano', 'codigoassinatura']).references('cecom.assinaturas.codigoassinante', 'cecom.assinaturas.codigoplano', 'cecom.assinaturas.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.itensfinanceirosassinaturas');
};