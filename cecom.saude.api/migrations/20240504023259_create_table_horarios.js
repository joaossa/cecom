// Migration for table: horarios
exports.up = function(knex) {
  return knex.schema.createTable('horarios', table => {
    table.integer('cd_horario').notNull().primary(); // Assuming smallint maps directly and is the primary key
    table.string('st_usorestrito', 1).notNull(); // Restrict to 'S' or 'N'
    table.string('ds_horario', 50).notNull();
    table.timestamp('hr_inicio').notNull();
    table.timestamp('hr_fim');
    table.string('st_inativo', 1).notNull(); // Restrict to 'S' or 'N'
  })
  .then(() => knex.raw("ALTER TABLE horarios ADD CONSTRAINT st_usorestrito_check CHECK (st_usorestrito IN ('S', 'N'))"))
  .then(() => knex.raw("ALTER TABLE horarios ADD CONSTRAINT st_inativo_check CHECK (st_inativo IN ('S', 'N'))"));
};

exports.down = function(knex) {
  return knex.schema.dropTable('horarios');
};
