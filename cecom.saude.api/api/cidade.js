module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const cidade = { ...req.body }
        if (req.params.codigo) cidade.codigo = req.params.codigo

        try {
            existsOrError(cidade.descricao, 'Cidade não informada')
            existsOrError(cidade.cdPais, 'País não informado')
            existsOrError(cidade.cdUf, 'Unidade da Federação não informada')
            existsOrError(cidade.cepGeral, 'Cep não informado')

            const userFromDB = await app.db('cidades')
                .where({ descricao: cidade.descricao }).first()
            if (!cidade.codigo) {
                notExistsOrError(userFromDB, 'Cidade já cadastrada')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        // console.log(cidade.codigo)
        if (cidade.codigo) {
            app.db('cidades')
                .update(cidade)
                .where({ codigo: cidade.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('cidades')
                .insert(cidade)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Nesse trecho é possível converter os nomes dos campos das tabelas em nome Camel case
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    // Pode ser utilizado o MAP
    // const get = (req, res) => {
    //     app.db('cidades')
    //         .select('codigo', 'descricao', 'inicio', 'fim', 'cdUnidadeOrganizacional', 'finalizada')
    //         .then(cidades => res.json(cidades))
    //         .catch(err => res.status(500).send(err))
    // }
    const get = (req, res) => {
        app.db({ c: 'cidades', p: 'paises' })
            .select({ codigo: 'c.codigo', descricao: 'c.descricao', cdUf: 'c.cdUf', cepGeral: 'c.cepGeral', cdPais: 'c.cdPais', cdIbge: 'c.cdIbge', descPais: 'p.descricao', stInativo: 'c.stInativo' })
            .whereRaw('?? = ??', ['c.cdPais', 'p.codigo'])
            .then(cidades => res.json(cidades))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('cidades')
            .select('codigo', 'descricao', 'cdUf', 'cepGeral', 'cdPais', 'cdIbge', 'stInativo')
            .where({ codigo: req.params.codigo })
            .first()
            .then(cidades => res.json(cidades))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const pessoas = await app.db('users')
                .where({ cdCidadeResidencia: req.params.codigo })
            notExistsOrError(pessoas, 'Pessoa tem vínculo com Cidade.')

            const rowsDeleted = await app.db('cidades')
                .where({ codigo: req.params.codigo }).del()
            existsOrError(rowsDeleted, 'Cidade não foi encontrada.')

            // const rowsUpdated = await app.db('cidades')
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