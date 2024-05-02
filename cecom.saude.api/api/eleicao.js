module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const eleicao = { ...req.body }
        if (req.params.codigo) eleicao.codigo = req.params.codigo

        try {
            existsOrError(eleicao.descricao, 'Eleição não informada')
            existsOrError(eleicao.inicio, 'Data início da eleição não informada')
            existsOrError(eleicao.fim, 'Data final da eleição não informada')

            const userFromDB = await app.db('eleicoes')
                .where({ descricao: eleicao.descricao }).first()
            if (!eleicao.codigo) {
                notExistsOrError(userFromDB, 'Eleição já cadastrada')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        // console.log(eleicao.codigo)
        if (eleicao.codigo) {
            app.db('eleicoes')
                .update(eleicao)
                .where({ codigo: eleicao.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('eleicoes')
                .insert(eleicao)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Nesse trecho é possível converter os nomes dos campos das tabelas em nome Camel case
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    // Pode ser utilizado o MAP
    // const get = (req, res) => {
    //     app.db('eleicoes')
    //         .select('codigo', 'descricao', 'inicio', 'fim', 'cdUnidadeOrganizacional', 'finalizada')
    //         .then(eleicoes => res.json(eleicoes))
    //         .catch(err => res.status(500).send(err))
    // }
    const get = (req, res) => {
        app.db({ e: 'eleicoes', uo: 'unidadesorganizacionais' })
            .select({ codigo: 'e.codigo', descricao: 'e.descricao', inicio: 'e.inicio', fim: 'e.fim', cdUnidadeOrganizacional: 'e.cdUnidadeOrganizacional', uNidade: 'uo.descricao', finalizada: 'e.finalizada' })
            .whereRaw('?? = ??', ['e.cdUnidadeOrganizacional', 'uo.codigo'])
            .then(eleicoes => res.json(eleicoes))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('eleicoes')
            .select('codigo', 'descricao', 'inicio', 'fim', 'cdUnidadeOrganizacional', 'finalizada')
            .where({ codigo: req.params.codigo })
            .first()
            .then(eleicoes => res.json(eleicoes))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const votos = await app.db('voto')
                .where({ cdEleicao: req.params.codigo })
            notExistsOrError(votos, 'Eleição possui votos.')

            const votantes = await app.db('votantes')
                .where({ cdEleicao: req.params.codigo })
            notExistsOrError(votantes, 'Eleição possui votantes.')

            const candidatos = await app.db('candidatos')
                .where({ cdEleicao: req.params.codigo })
            notExistsOrError(candidatos, 'Eleição possui candidatos.')

            const chapas = await app.db('chapas')
                .where({ cdEleicao: req.params.codigo })
            notExistsOrError(chapas, 'Eleição possui chapa.')

            const secoes = await app.db('secoes')
                .where({ cdEleicao: req.params.codigo })
            notExistsOrError(secoes, 'Eleição possui seções.')

            const cedulas = await app.db('cedulas')
                .where({ cdEleicao: req.params.codigo })
            notExistsOrError(cedulas, 'Eleição possui cédula.')

            const rowsDeleted = await app.db('eleicoes')
                .where({ id: req.params.codigo }).del()
            existsOrError(rowsDeleted, 'Eleição não foi encontrada.')

            // const rowsUpdated = await app.db('eleicoes')
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