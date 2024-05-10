exports.up = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .createTable('assinaturas', table => {
      table.integer('codigoassinante').notNullable(); // Foreign key column
      table.integer('codigoplano').notNullable(); // Foreign key column
      table.integer('codigo').notNullable().primary(); // Assuming 'codigo' should be the primary key, unique
      table.decimal('valorcontratado', 14, 2).notNullable(); // 'money' type adjusted to 'decimal'
      table.integer('percentualdesconto').nullable();
      table.timestamp('dt_contratacao', { useTz: true }).defaultTo(knex.fn.now()).notNullable(); // Default to current timestamp
      table.timestamp('dt_distrato', { useTz: true }).nullable();

      // Set composite primary key
      table.primary(['codigoassinante', 'codigoplano', 'codigo']);

      // Define foreign keys
      table.foreign('codigoassinante').references('codigo').inTable('cecom.master');
      table.foreign('codigoplano').references('codigo').inTable('cecom.planos');
    })
	.then(() => knex.raw(`CREATE SEQUENCE cecom.assinaturas_codigo_seq INCREMENT BY 1 MINVALUE 1 MAXVALUE 32767 START 1 CACHE 1 NO CYCLE;`))
	.then(() => knex.raw(`ALTER TABLE cecom.assinaturas ALTER COLUMN codigo SET DEFAULT nextval('cecom.assinaturas_codigo_seq');`))
	.then(() => knex.raw(`CREATE OR REPLACE FUNCTION cecom.fc_set_codigo_assinaturas() RETURNS TRIGGER AS $$ BEGIN IF NEW.codigo IS NULL OR NEW.codigo = 0 THEN NEW.codigo := nextval('cecom.assinaturas_codigo_seq'); END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;`))
	.then(() => knex.raw(`CREATE TRIGGER set_codigo_assinaturas BEFORE INSERT ON cecom.assinaturas FOR EACH ROW EXECUTE FUNCTION cecom.fc_set_codigo_assinaturas();`));
};

exports.down = function(knex) {
  return knex.schema
    .withSchema('cecom')
    .dropTable('assinaturas');
};