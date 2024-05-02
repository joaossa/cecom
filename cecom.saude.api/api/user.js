const bcrypt = require('bcrypt-nodejs')

module.exports = app => {
    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    const save = async (req, res) => {
        const user = { ...req.body }
        if (req.params.codigo) user.codigo = req.params.codigo

        // Garantir que um usuário não será cadastrado como administrador direto do signinup.
        // Para cadastrar um administrador, tem que ser administrador também.
        // if (!req.originalUrl.startsWith('/users')) user.admin = false
        // if (!req.user || !req.user.admin) user.admin = false

        try {
            existsOrError(user.nome, 'Nome não informado')
            existsOrError(user.email, 'E-mail não informado')
            existsOrError(user.password, 'Senha não informada')
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            equalsOrError(user.password, user.confirmPassword,
                'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({ email: user.email }).first()
            if (!user.codigo) {
                notExistsOrError(userFromDB, 'Usuário já cadastrado')
            }
        } catch (msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password)
        delete user.confirmPassword

        if (user.codigo) {
            app.db('users')
                .update(user)
                .where({ codigo: user.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    // Nesse trecho é possível converter os nomes dos campos das tabelas em nome Camel case
    // https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
    // https://www.w3resource.com/javascript-exercises/javascript-string-exercise-11.php
    // Pode ser utilizado o MAP
    const get = (req, res) => {
        app.db('users')
            .select('codigo', 'nome', 'sexo', 'dtnascimento', 'cpf', 'enderecoresidencia', 'nrResidencia', 'complementoresidencia', 'bairroresidencia', 'cepResidencia', 'cdCidadeResidencia', 'email', 'dtAtualizacao', 'nmMae', 'nmPai', 'rg', 'orgaoemissor', 'stInativo', 'password', 'cdUnidadeOrganizacional', 'nmCivil', 'stNmSocial', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('users')
            .select('codigo', 'nome', 'sexo', 'dtnascimento', 'cpf', 'enderecoresidencia', 'nrResidencia', 'complementoresidencia', 'bairroresidencia', 'cepResidencia', 'cdCidadeResidencia', 'email', 'dtAtualizacao', 'nmMae', 'nmPai', 'rg', 'orgaoemissor', 'stInativo', 'password', 'cdUnidadeOrganizacional', 'nmCivil', 'stNmSocial', 'admin')
            .where({ codigo: req.params.codigo })
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            // const articles = await app.db('articles')
            //     .where({ userId: req.params.codigo })
            // notExistsOrError(articles, 'Usuário possui artigos.')

            const rowsUpdated = await app.db('users')
                .update({ dtAtualizacao: new Date(), stInativo: 'S' })
                .where({ codigo: req.params.codigo })
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}