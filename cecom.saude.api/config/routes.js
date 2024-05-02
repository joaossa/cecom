const admin = require('./admin')
// .all(app.config.passport.authenticate())
module.exports = app => {
    app.post('/signup', app.api.user.save)
    app.post('/signin', app.api.auth.signin)
    app.post('/validateToken', app.api.auth.validateToken)

    app.route('/users')
        .all(app.config.passport.authenticate())
        .post(app.api.user.save)
        .get(app.api.user.get)

    app.route('/users/:id')
        .all(app.config.passport.authenticate())
        .put(app.api.user.save)
        .get(app.api.user.getById)
        .delete(admin(app.api.user.remove))

    app.route('/indicacoes')
        .all(app.config.passport.authenticate())
        .post(app.api.indicacao.save)
        .get(app.api.indicacao.get)

    app.route('/indicacoes/:codigo')
        .all(app.config.passport.authenticate())
        .get(app.api.indicacao.getById)

    app.route('/indicacoes/:email/:cdEleicao/jaindicou')
        .all(app.config.passport.authenticate())
        .get(app.api.indicacao.getByEmail)

    app.route('/indicacoes/:email/:cdEleicao/meusindicados')
        .all(app.config.passport.authenticate())
        .get(app.api.indicacao.getMeusIndicados)

    app.route('/indicacoes/:cdEleicao/indicadoseleicao')
        .all(app.config.passport.authenticate())
        .get(app.api.indicacao.getIndicadosEleicao)

    app.route('/paises')
        .all(app.config.passport.authenticate())
        .post(app.api.pais.save)
        .get(app.api.pais.get)

    app.route('/paises/:codigo')
        .all(app.config.passport.authenticate())
        .put(app.api.pais.save)
        .get(app.api.pais.getById)
        .delete(app.api.pais.remove)

    app.route('/cidades')
        .all(app.config.passport.authenticate())
        .post(app.api.cidade.save)
        .get(app.api.cidade.get)

    app.route('/cidades/:codigo')
        .all(app.config.passport.authenticate())
        .put(app.api.cidade.save)
        .get(app.api.cidade.getById)
        .delete(app.api.cidade.remove)

    app.route('/cargos')
        .all(app.config.passport.authenticate())
        .post(app.api.cargo.save)
        .get(app.api.cargo.get)

    app.route('/cargos/:codigo')
        .all(app.config.passport.authenticate())
        .put(app.api.cargo.save)
        .get(app.api.cargo.getById)
        .delete(app.api.cargo.remove)

    app.route('/eleicoes')
        .all(app.config.passport.authenticate())
        .post(app.api.eleicao.save)
        .get(app.api.eleicao.get)

    app.route('/eleicoes/:codigo')
        .all(app.config.passport.authenticate())
        .get(app.api.eleicao.getById)
        .put(app.api.eleicao.save)
        .delete(app.api.eleicao.remove)

    app.route('/cedulas')
        .all(app.config.passport.authenticate())
        .get(app.api.cedula.get)
        .post(app.api.cedula.save)

    // Cuidado com ordem! Tem que vir antes de /cedulas/:id
    // .all(app.config.passport.authenticate())
    // app.route('/cedulas/tree')
    //     .all(app.config.passport.authenticate())
    //     .get(app.api.category.getTree)

    app.route('/cedulas/:codigo')
        .all(app.config.passport.authenticate())
        .get(app.api.cedula.getById)
        .put(app.api.cedula.save)
        .delete(app.api.cedula.remove)

    app.route('/unidadesorganizacionais')
        .all(app.config.passport.authenticate())
        .post(app.api.unidadeorganizacional.save)
        .get(app.api.unidadeorganizacional.get)

    app.route('/unidadesorganizacionais/:codigo')
        .all(app.config.passport.authenticate())
        .put(app.api.unidadeorganizacional.save)
        .get(app.api.unidadeorganizacional.getById)
        .delete(app.api.unidadeorganizacional.remove)
}