
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('cidades').del()
    .then(function () {
      // Inserts seed entries
      return knex('cidades').insert([
        { descricao: 'Salvador', cdUf: 'BA', cdPais: 1, cepGeral: '41741-170', cdIbge: 1234, stInativo: 'N' }
      ]);
    });
};