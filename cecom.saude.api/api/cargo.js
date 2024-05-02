module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const cargo = { ...req.body }
        if (req.params.codigo) cargo.codigo = req.params.codigo

        try {
            existsOrError(cargo.descricao, 'Cargo não informado')

            const userFromDB = await app.db('cargos')
                .where({ descricao: cargo.descricao }).first()
            // console.log(cargo.codigo)
            // console.log(!cargo.codigo)
            if (!cargo.codigo) {
                notExistsOrError(userFromDB, 'Cargo já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        if (cargo.codigo) {
            app.db('cargos')
                .update(cargo)
                .where({ codigo: cargo.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('cargos')
                .insert(cargo)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Nesse trecho é possível converter os nomes dos campos das tabelas em nome Camel case
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    // Pode ser utilizado o MAP
    const get = (req, res) => {
        app.db('cargos')
            .select('codigo', 'descricao', 'cdNivel', 'stInativo')
            .then(cargos => res.json(cargos))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('cargos')
            .select('codigo', 'descricao', 'cdNivel', 'stInativo')
            .where({ codigo: req.params.codigo })
            .first()
            .then(cargos => res.json(cargos))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const candidatochapa = await app.db('candidatoschapas')
                .where({ cdCargo: req.params.codigo })
            notExistsOrError(candidatochapa, 'Cargo vinculado a Candidatos Chapa.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}