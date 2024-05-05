exports.up = function(knex) {
  return knex.schema.createTable('cecom.evolucoes', table => {
    table.increments('cd_evolucao').primary();
    table.integer('codigoprof').notNullable();
    table.string('prontuario', 7).notNullable();
    table.integer('codigomasterpac').notNullable();
    table.integer('codigopaciente').notNullable();
    table.timestamp('dt_evolucao').nullable();
    table.smallint('cd_tipoevolucao').notNullable();
    table.binary('evolucao').nullable();
    table.integer('cd_pessoaautorizacao').nullable();
    table.timestamp('dt_autorizacao').nullable();
    table.timestamp('dt_impressao').nullable();
    table.smallint('cd_motivoexclamacao').nullable();
    table.integer('codigomasterinvalida').notNullable();
    table.timestamp('dt_invalidacao').nullable();
    table.string('motivoinvalidacao', 2000).nullable();
    table.integer('cd_arquivoassinado').nullable();
    table.integer('codigomasterarq').notNullable();
    table.smallint('codigolocalatend').notNullable();

    // Foreign Keys
    table.foreign('cd_arquivoassinado').references('<?>().');
    table.foreign('codigolocalatend').references('cecom.locaisatendimentos.codigo');
    table.foreign('cd_motivoexclamacao').references('cecom.motivosexclamacao.codigo');
    table.foreign('codigomasterinvalida').references('cecom.profissionais.codigoprof');
    table.foreign('codigoprof').references('cecom.profissionais.codigoprof');
    table.foreign(['codigomasterpac', 'codigopaciente', 'prontuario']).references('cecom.prontuariospacientes.codigopac', 'cecom.prontuariospacientes.codigopaciente', 'cecom.prontuariospacientes.prontuario');
    table.foreign('cd_tipoevolucao').references('cecom.tiposevolucoes.codigo');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cecom.evolucoes');
};