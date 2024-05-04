// Migration for table: horarios
exports.up = function(knex) {
  return knex.schema.createTable('horarios', function(table) {
    table.smallint('cd_horario').notNullable().primary(); // Assuming smallint maps directly and is the primary key
    table.char('st_usorestrito', 1).check('st_usorestrito IN (\'S\', \'N\')'); // Restrict to 'S' or 'N'
    table.string('ds_horario', 50).notNullable();
    table.timestamp('hr_inicio').notNullable();
    table.timestamp('hr_fim').nullable();
    table.char('st_inativo', 1).check('st_inativo IN (\'S\', \'N\')'); // Restrict to 'S' or 'N'
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('horarios');
};
