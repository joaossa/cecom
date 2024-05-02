
exports.up = function (knex) {
    return knex.schema.table('indicacoes_2021', table => {
        table.string('stCriteriosValidos', 1).defaultTo('N');
    });
};

exports.down = function (knex) {
    return knex.schema.table('indicacoes_2021', table => {
        table.dropColumn('stCriteriosValidos');
    });
};
