module.exports = app => {
    // const { existsOrError, notExistsOrError } = app.api.validation

    const save = async (req, res) => {
        const indicacao = { ...req.body }
        if (req.params.codigo) indicacao.codigo = req.params.codigo

        // try {
        //     existsOrError(indicacao.email, 'e-mail não informado')

        //     // const userFromDB = await app.db('indicacoes_2021')
        //     //     .whereIn({ email: indicacao.email })
        //     //     .where({ cdEleicao: indicacao.cdEleicao })
        //     //     .where({ cdCargo: indicacao.cdCargo }).first()
        //     // if (!indicacao.codigo) {
        //     //     notExistsOrError(userFromDB, 'Indicação já realizada')
        //     // }
        // } catch (msg) {
        //     return res.status(400).send(msg)
        // }
        if (indicacao.codigo) {
            app.db('indicacoes_2021')
                .update(indicacao)
                .where({ codigo: indicacao.codigo })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('indicacoes_2021')
                .insert(indicacao)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('indicacoes_2021')
            .select('codigo', 'cdEleicao', 'cdCargo', 'nomeIndicado', 'stContactouIndicado', 'stAutoIndicacao', 'email', 'ipIndicacao', 'dtHoraIndicacao')
            .then(indicacoes_2021 => res.json(indicacoes_2021))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('indicacoes_2021')
            .select('codigo', 'cdEleicao', 'cdCargo', 'nomeIndicado', 'stContactouIndicado', 'stAutoIndicacao', 'email', 'ipIndicacao', 'dtHoraIndicacao')
            .where({ codigo: req.params.codigo })
            .first()
            .then(indicacoes_2021 => res.json(indicacoes_2021))
            .catch(err => res.status(500).send(err))
    }

    const getByEmail = (req, res) => {
        app.db('indicacoes_2021')
            .select('codigo', 'cdEleicao', 'cdCargo', 'nomeIndicado', 'stContactouIndicado', 'stAutoIndicacao', 'email', 'ipIndicacao', 'dtHoraIndicacao')
            .where({ email: req.params.email })
            .where({ cdEleicao: req.params.cdEleicao })
            .first()
            .then(indicacoes_2021 => res.json(indicacoes_2021))
            .catch(err => res.status(500).send(err))
    }

    const getMeusIndicados = async (req, res) => {
        const indicacoesMembro = await app.db({ i: 'indicacoes_2021', e: 'eleicoes', c: 'cargos' })
            .select({
                codigo: 'i.codigo',
                cdEleicao: 'i.cdEleicao',
                email: 'i.email',
                eleicao: 'e.descricao',
                cargo: 'c.descricao',
                nomeIndicado: 'i.nomeIndicado',
                dtHoraIndicacao: 'i.dtHoraIndicacao'
            })
            .where({ email: req.params.email })
            .where({ cdEleicao: req.params.cdEleicao })
            .whereRaw('?? = ??', ['i.cdEleicao', 'e.codigo'])
            .whereRaw('?? = ??', ['i.cdCargo', 'c.codigo'])

        if (typeof (indicacoesMembro[0].email) !== 'undefined' && indicacoesMembro[0].email != null && indicacoesMembro[0].email.length > 0) {
            let textoindicados = 'IGREJA BATISTA DA GRAÇA / CECOM – ELEIÇÕES BIÊNIO 2022-2023' + '\n'
            textoindicados = textoindicados + 'Referência: ' + indicacoesMembro[0].eleicao + '\n\n'
            textoindicados = textoindicados + 'Origem da indicação: ' + indicacoesMembro[0].email + '\n\n'
            for (var i = 0; i < indicacoesMembro.length; i++) {
                textoindicados = textoindicados + 'Cargo: ' + indicacoesMembro[i].cargo + '\n Nome: ' + indicacoesMembro[i].nomeIndicado + '\n\n';
            }
            textoindicados = textoindicados + 'Não é necessário responder esse e-mail \n'
            textoindicados = textoindicados + 'COMISSÃO DE ELEIÇÕES DA IBG \n'
            let mailDetails = {
                from: 'joao.ssa@gmail.com',
                to: req.params.email,
                subject: 'Indicações - ELEIÇÕES BIÊNIO 2022-2023',
                text: textoindicados
            }

            app.ibgmail.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log('Ocorreu erro' + err);
                } else {
                    console.log('Email enviado com sucesso');
                }
            })
        }
        return res.json(indicacoesMembro)
    }

    const getIndicadosEleicao = async (req, res) => {
        app.db({ i: 'indicacoes_2021', e: 'eleicoes', c: 'cargos' })
            .select({
                codigo: 'i.codigo',
                cdEleicao: 'i.cdEleicao',
                email: 'i.email',
                eleicao: 'e.descricao',
                cdCargo: 'c.codigo',
                cargo: 'c.descricao',
                nomeIndicado: 'i.nomeIndicado',
                dtHoraIndicacao: 'i.dtHoraIndicacao',
                stAutoIndicacao: 'i.stAutoIndicacao',
                stContactouIndicado: 'i.stContactouIndicado',
                stAceitaIndicacao: 'i.stAceitaIndicacao',
                stCriteriosValidos: 'i.stCriteriosValidos'
            })
            .where({ cdEleicao: req.params.cdEleicao })
            .whereRaw('?? = ??', ['i.cdEleicao', 'e.codigo'])
            .whereRaw('?? = ??', ['i.cdCargo', 'c.codigo'])
            .then(indicacoes_2021 => res.json(indicacoes_2021))
            .catch(err => res.status(500).send(err))
    }
    return { save, get, getById, getByEmail, getMeusIndicados, getIndicadosEleicao }
}