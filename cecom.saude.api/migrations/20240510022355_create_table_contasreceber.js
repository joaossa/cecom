exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('contasreceber', table => {
      table.integer('codigoprof').notNullable(); // Not a primary key alone, part of a composite primary key
      table.integer('codigopacientemaster').notNullable();
      table.integer('codigopaciente').notNullable();
      table.timestamp('dt_realizacaoconsulta', { useTz: true }).notNullable();
      table.integer('codigolocalatend').notNullable();
      table.decimal('valoratendimento', 14, 2).notNullable();
      table.primary(['codigoprof', 'codigopacientemaster', 'codigopaciente']);
      table.foreign(['codigopacientemaster', 'codigopaciente']).references(['codigomaster', 'codigopaciente']).inTable('cecom.pacientes'); // Ajustado para usar chave composta
      table.foreign('codigoprof').references('codigo').inTable('cecom.profissionais');
      table.foreign('codigolocalatend').references('codigo').inTable('cecom.locaisatendimentos');
    });
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('contasreceber');
};