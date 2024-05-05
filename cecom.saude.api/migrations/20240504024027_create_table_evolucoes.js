exports.up = function(knex) {
  return knex.schema.createTable('cecom.evolucoes', table => {
    table.increments('cd_evolucao').primary();
    table.integer('codigoprof').notNull();
    table.string('prontuario', 7).notNull();
    table.integer('codigomasterpac').notNull();
    table.integer('codigopaciente').notNull();
    table.timestamp('dt_evolucao');
    table.smallint('cd_tipoevolucao').notNull();
    table.binary('evolucao');
    table.integer('cd_pessoaautorizacao');
    table.timestamp('dt_autorizacao');
    table.timestamp('dt_impressao');
    table.smallint('cd_motivoexclamacao');
    table.integer('codigomasterinvalida').notNull();
    table.timestamp('dt_invalidacao');
    table.string('motivoinvalidacao', 2000);
    table.integer('cd_arquivoassinado');
    table.integer('codigomasterarq').notNull();
    table.smallint('codigolocalatend').notNull();

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