exports.up = function(knex) {
  return knex.schema.createTable('cecom.itensfinanceiro', table => {
    table.increments('cd_itenfinanceiro').primary();
    table.integer('cd_financeiro').notNullable();
    table.smallint('numero_parcela').notNullable();
    table.decimal('valor_parcela').notNullable();
    table.timestamp('dt_vencimento').nullable();

    // Primary Key
    table.unique(['cd_itenfinanceiro', 'cd_financeiro']);

    // Foreign Keys
    table.foreign('cd_financeiro').references('cecom.financeiro.cd_financeiro');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.itensfinanceiro');
};
