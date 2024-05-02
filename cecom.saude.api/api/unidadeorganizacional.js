module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const unidadeorganizacional = { ...req.body }
        if (req.params.codigo) unidadeorganizacional.codigo = req.params.codigo

        try {
            existsOrError(unidadeorganizacional.descricao, 'Unidade Organizacional não informada')

            const userFromDB = await app.db('unidadesorganizacionais')
                .where({ descricao: unidadeorganizacional.descricao }).first()
            // console.log(unidadeorganizacional.codigo)
            // console.log(!unidadeorganizacional.codigo)
            if (!unidadeorganizacional.codigo) {
                notExistsOrError(userFromDB, 'Unidade Organizacional já cadastrada')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (unidadeorganizacional.codigo) {
            app.db('unidadesorganizacionais')
                .update(unidadeorganizacional)
                .where({ codigo: unidadeorganizacional.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('unidadesorganizacionais')
                .insert(unidadeorganizacional)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Nesse trecho é possível converter os nomes dos campos das tabelas em nome Camel case
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    // Pode ser utilizado o MAP
    const get = (req, res) => {
        app.db('unidadesorganizacionais')
            .select('codigo', 'descricao', 'siglaUnidade', 'ipmaqbd', 'stringConexao', 'dbName', 'endereco', 'telefone', 'estaUnidade', 'cdCidade')
            .then(unidadesorganizacionais => res.json(unidadesorganizacionais))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('unidadesorganizacionais')
            .select('codigo', 'descricao', 'siglaUnidade', 'ipmaqbd', 'stringConexao', 'dbName', 'endereco', 'telefone', 'estaUnidade', 'cdCidade')
            .where({ codigo: req.params.codigo })
            .first()
            .then(unidadesorganizacionais => res.json(unidadesorganizacionais))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const users = await app.db('users')
                .where({ cdUnidadeOrganizacional: req.params.codigo })
            notExistsOrError(eleicoes, 'Usuário vinculado com essa Unidade Organizacional.')

            const eleicoes = await app.db('eleicoes')
                .where({ cdUnidadeOrganizacional: req.params.codigo })
            notExistsOrError(eleicoes, 'Eleição vinculada com essa Unidade Organizacional.')

            const rowsDeleted = await app.db('unidadesorganizacionais')
                .where({ codigo: req.params.codigo }).del()
            existsOrError(rowsDeleted, 'Unidade Organizacional não foi encontrada.')

            // const rowsUpdated = await app.db('unidadesorganizacionais')
            //     .update({ finalizada: new Date() })
            //     .where({ codigo: req.params.codigo })
            // existsOrError(rowsUpdated, 'Eleição não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}