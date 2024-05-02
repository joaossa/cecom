exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('paises').del()
    .then(function () {
      // Inserts seed entries
      return knex('paises').insert([
        { descricao: 'Brasil', nacionalidade: 'brasileira' },
        { descricao: 'Estados Unidos', nacionalidade: 'estadunidense' }
      ]);
    });
};