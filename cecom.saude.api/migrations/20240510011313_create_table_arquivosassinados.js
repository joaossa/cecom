exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('arquivosassinados', table => {
      table.integer('codigo').notNullable(); // Não definido como primary key aqui porque é composta
      table.binary('arquivo').nullable(); // 'bytea' equivalente em Knex é binary
      table.integer('codigoprof').notNullable();
      table.timestamp('dt_operacao', { useTz: true }).nullable();
      table.string('ds_assinador', 200).nullable().comment('Nome e cpf do assinador (token)');
      table.primary(['codigoprof', 'codigo']); // Chave primária composta
      table.foreign('codigoprof').references('codigo').inTable('cecom.profissionais'); // Chave estrangeira
    });
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('arquivosassinados');
};
