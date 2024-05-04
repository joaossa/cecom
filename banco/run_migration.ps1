# Caminho para o arquivo de script JavaScript
$jsPath = "C:\cecom\cecom.saude.api\migrar-pg-knex.js"

# Invoca o Knex usando npx para executar o script
npx knex --knexfile 'C:\cecom\cecom.saude.api\knexfile.js' --cwd 'C:\cecom\cecom.saude.api\migrations\' migrate:make create_table_paises
npx node $jsPath
