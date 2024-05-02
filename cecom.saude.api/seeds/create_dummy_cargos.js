exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('cargos').del()
    .then(function () {
      // Inserts seed entries
      return knex('cargos').insert([
        { descricao: 'CONSELHO DIRETOR - IBG', cdNivel: 0, stInativo: 'N' },
        { descricao: 'CONSELHO FISCAL - IBG', cdNivel: 1, stInativo: 'N' },
        { descricao: 'ASSESSORIA JURÍDICA - IBG', cdNivel: 2, stInativo: 'N' },
        { descricao: 'CONSELHO DE ADMINISTRAÇÃO - IBG', cdNivel: 3, stInativo: 'N' },
        { descricao: 'CONSELHO DE ADORAÇÃO - IBG', cdNivel: 4, stInativo: 'N' },
        { descricao: 'CONSELHO DE COMUNHÃO - IBG', cdNivel: 5, stInativo: 'N' },
        { descricao: 'CONSELHO DE ENSINO - IBG', cdNivel: 6, stInativo: 'N' },
        { descricao: 'CONSELHO DE PASTORAL - IBG', cdNivel: 7, stInativo: 'N' },
        { descricao: 'CONSELHO DE PROCLAMAÇÃO - IBG', cdNivel: 8, stInativo: 'N' },
        { descricao: 'CONSELHO ELEITORAL - IBG', cdNivel: 9, stInativo: 'N' }
      ]);
    });
};