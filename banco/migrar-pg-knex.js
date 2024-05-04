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
    const columns = await knex(table).columnInfo();
    const migrationContent = `exports.up = function (knex) {
        return knex.schema.createTable('${table}', table => {
            ${Object.keys(columns).map(column => {
                const type = columns[column].type;
                const maxLength = columns[column].maxLength;
                let line = \`table.\${type}('\${column}'\`;
                if (maxLength) {
                    line += \`, \${maxLength}\`;
                }
                line += ');';
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
