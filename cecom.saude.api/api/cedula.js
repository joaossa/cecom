module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const cedula = { ...req.body }
        if (req.params.codigo) cedula.codigo = req.params.codigo

        try {
            existsOrError(cedula.cdEleicao, 'Eleição não informada')
            existsOrError(cedula.descricao, 'Cédula não informada')
            existsOrError(cedula.numerovotos, 'Cédula não informada')

            const userFromDB = await app.db('cedulas')
                .where({ descricao: cedula.descricao }).first()
            if (!cedula.codigo) {
                notExistsOrError(userFromDB, 'Cédula já cadastrada')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }
        // console.log(cedula.codigo)
        if (cedula.codigo) {
            app.db('cedulas')
                .update(cedula)
                .where({ codigo: cedula.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('cedulas')
                .insert(cedula)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.codigo, 'Código da Cédula não informado.')

            const chapas = await app.db('chapas')
                .where({ cdCedula: req.params.codigo })
            notExistsOrError(chapas, 'Cédula utilizada por Chapa.')

            const urnas = await app.db('urnas')
                .where({ cdCedula: req.params.codigo })
            notExistsOrError(urnas, 'Cédula utilizada por Urna.')

            const candidatos = await app.db('candidatos')
                .where({ cdCedula: req.params.codigo })
            notExistsOrError(candidatos, 'Cédula utilizada por Candidatos.')

            const votantes = await app.db('votantes')
                .where({ cdCedula: req.params.codigo })
            notExistsOrError(votantes, 'Existem votantes para a cédula.')

            const rowsDeleted = await app.db('cedulas')
                .where({ id: req.params.codigo }).del()
            existsOrError(rowsDeleted, 'Categoria não foi encontrada.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    // const withPath = cedulas => {
    //     const getParent = (cedulas, parentId) => {
    //         const parent = cedulas.filter(parent => parent.codigo === parentId)
    //         return parent.length ? parent[0] : null
    //     }

    //     const categoriesWithPath = cedulas.map(cedula => {
    //         let path = cedula.name
    //         let parent = getParent(cedulas, cedula.parentId)

    //         while (parent) {
    //             path = `${parent.name} > ${path}`
    //             parent = getParent(cedulas, parent.parentId)
    //         }

    //         return { ...cedula, path }
    //     })

    //     categoriesWithPath.sort((a, b) => {
    //         if (a.path < b.path) return -1
    //         if (a.path > b.path) return 1
    //         return 0
    //     })

    //     return categoriesWithPath
    // }

    const get = (req, res) => {
        app.db({ c: 'cedulas', e: 'eleicoes' })
            .select({ codigo: 'c.codigo', descricao: 'c.descricao', cdEleicao: 'c.cdEleicao', eLeicao: 'e.descricao', numerovotos: 'c.numerovotos' })
            .whereRaw('?? = ??', ['c.cdEleicao', 'e.codigo'])
            .then(cedulas => res.json(cedulas))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('cedulas')
            .where({ codigo: req.params.codigo })
            .first()
            .then(cedula => res.json(cedula))
            .catch(err => res.status(500).send(err))
    }

    // const toTree = (cedulas, tree) => {
    //     if (!tree) tree = cedulas.filter(c => !c.parentId)
    //     tree = tree.map(parentNode => {
    //         const isChild = node => node.parentId == parentNode.codigo
    //         parentNode.children = toTree(cedulas, cedulas.filter(isChild))
    //         return parentNode
    //     })
    //     return tree
    // }

    // const getTree = (req, res) => {
    //     app.db('cedulas')
    //         .then(cedulas => res.json(toTree(cedulas)))
    //         .catch(err => res.status(500).send(err))
    // }

    // return { save, remove, get, getById, getTree }
    return { save, remove, get, getById }
}