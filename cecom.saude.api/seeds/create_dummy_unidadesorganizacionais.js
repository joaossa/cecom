
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('unidadesorganizacionais').del()
    .then(function () {
      // Inserts seed entries
      return knex('unidadesorganizacionais').insert([
        { descricao: 'Igreja Batista da Graça', siglaUnidade: 'IBG', ipmaqbd: '127.0.0.1', stringConexao: 'IBGSTRING', dbName: 'IBGBANCO', endereco: 'Av. Anita Garibaldi, 449 - Federação, Salvador - BA, 40210-070', telefone: '(71) 3194-7777', estaUnidade: 'N', cdCidade: 1 },
        { descricao: 'Centro Comunitário Clériston Andrade - CECOM', siglaUnidade: 'CECOM', ipmaqbd: '127.0.0.1', stringConexao: 'CECOMSTRING', dbName: 'CECOMBANCO', endereco: 'Av. Anita Garibaldi, 449 - Federação, Salvador - BA, 40210-070', telefone: '(71) 3194-7777', estaUnidade: 'N', cdCidade: 1 }
      ]);
    });
};
