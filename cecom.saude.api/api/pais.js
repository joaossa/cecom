module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const pais = { ...req.body }
        if (req.params.codigo) pais.codigo = req.params.codigo

        try {
            existsOrError(pais.descricao, 'País não informado')

            const userFromDB = await app.db('paises')
                .where({ descricao: pais.descricao }).first()
            // console.log(pais.codigo)
            // console.log(!pais.codigo)
            if (!pais.codigo) {
                notExistsOrError(userFromDB, 'País já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (pais.codigo) {
            app.db('paises')
                .update(pais)
                .where({ codigo: pais.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('paises')
                .insert(pais)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Nesse trecho é possível converter os nomes dos campos das tabelas em nome Camel case
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    // Pode ser utilizado o MAP
    const get = (req, res) => {
        app.db('paises')
            .select('codigo', 'descricao', 'nacionalidade', 'cdIbge')
            .then(paises => res.json(paises))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('paises')
            .select('codigo', 'descricao', 'nacionalidade', 'cdIbge')
            .where({ codigo: req.params.codigo })
            .first()
            .then(paises => res.json(paises))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const cidade = await app.db('cidades')
                .where({ cdPais: req.params.codigo })
            notExistsOrError(cidade, 'País vinculado a cidade.')

            // const rowsUpdated = await app.db('paises')
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