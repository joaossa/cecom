const knex = require('knex')({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'Superacaojc01',
        database: 'cecom_saude',
        timezone: 'America/Sao_Paulo'
    }
});

async function generateMigration(table) {
    console.log(`Gerando migração para a tabela: ${table}`);
    const columns = await knex(table).columnInfo();
    console.log(`Informações das colunas: ${JSON.stringify(columns)}`);

    if (Object.keys(columns).length === 0) {
        console.log("Nenhuma coluna foi encontrada. Verifique o nome da tabela e as permissões.");
        return;
    }

    const migrationContent = `exports.up = function (knex) {
        return knex.schema.createTable('${table}', table => {
            ${Object.keys(columns).map(column => {
                const { type, maxLength, nullable } = columns[column];
                let line = `table.${type}('${column}'`;
                if (maxLength) {
                    line += `, ${maxLength}`;
                }
                line += nullable ? ');' : ').notNull();';
                return line;
            }).join('\n            ')}
        });
    };

    exports.down = function (knex) {
        return knex.schema.dropTable('${table}');
    };`;

    console.log(migrationContent);
}

generateMigration('paises').then(() => process.exit());
