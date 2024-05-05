exports.up = function(knex) {
  return knex.schema.createTable('cecom.financeiro', table => {
    table.increments('cd_financeiro').primary();
    table.integer('codigoprof').notNull();
    table.integer('codigomasterpac').notNull();
    table.integer('codigopaciente').notNull();
    table.smallint('qtd_parcelas').notNull();
    table.decimal('valor_total').notNull();
    table.smallint('qtd_evolucoes').notNull();
    table.smallint('cd_tipoprocedimento').notNull();
    table.timestamp('dt_registro');

    // Foreign Keys
    table.foreign('codigoprof').references('cecom.profissionais.codigoprof');
    table.foreign(['codigomasterpac', 'codigopaciente']).references('cecom.pacientes.codigomaster', 'cecom.pacientes.codigopaciente');
    table.foreign('cd_tipoprocedimento').references('cecom.tiposprocedimentos.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.financeiro');
};