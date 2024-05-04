exports.up = function(knex) {
  return knex.schema.createTable('cecom.itensfinanceirosassinaturas', function(table) {
    table.increments('cd_itemfinanassinatura').primary();
    table.integer('codigoassinante').notNullable();
    table.integer('codigoplano').notNullable();
    table.integer('codigoassinatura').notNullable();
    table.decimal('valor_parcela').notNullable();
    table.timestamp('dt_vencimento').nullable();

    // Foreign Key
    table.foreign(['codigoassinante', 'codigoplano', 'codigoassinatura']).references('cecom.assinaturas.codigoassinante', 'cecom.assinaturas.codigoplano', 'cecom.assinaturas.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.itensfinanceirosassinaturas');
};