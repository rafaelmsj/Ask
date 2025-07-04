import UserService from '../services/UserService.js';
import TokenService from '../services/TokenService.js';
import EmailService from '../services/EmailService.js'

class UserController {

    async Create(req, res) {
        try {
            const { name, date_birth, email, password, passwordConfirm } = req.body;

            if (!name || !date_birth || !email || !password || !passwordConfirm) {
                return res.status(400).json({ success: false, message: 'Todos os campos devem ser preenchidos.' })
            }

            if (name.length < 5) return res.status(400).json({ success: false, message: 'Digite um nome válido.' })

            const validateEmail = await UserService.ValidateEmail(email)
            if (!validateEmail.success) return res.status(400).json({ success: false, message: 'E-mail inválido.' })

            const findEmail = await UserService.FindEmail(email)
            if (!findEmail.success) return res.status(400).json({ success: false, message: findEmail.message })

            const findEmailWaiting = await UserService.FindEmailWaiting(email)
            if (!findEmailWaiting.success) return res.status(400).json({ success: false, message: findEmailWaiting.message })

            const verifyAge = await UserService.VerifyAge(date_birth)
            if (!verifyAge.success) return res.status(400).json({ success: false, message: verifyAge.message })

            const validatePassword = await UserService.ValidatePassword(password);
            if (!validatePassword.success) return res.status(400).json({ success: false, message: 'Senha fraca. Use pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo.' })
            if (password !== passwordConfirm) return res.status(400).json({ success: false, message: 'As senhas não coincidem. Por favor, verifique se digitou corretamente a sua senha e tente novamente.' })

            const token = await TokenService.Create(email, 0, '15m')
            if (!token.success) return { success: false, message: 'Erro ao gerar token.' }

            const createUserWaiting = await UserService.CreateUserWaiting(name, date_birth, email, password, token.token, token.dt_create)
            if (!createUserWaiting.success) return res.status(400).json({ success: false, message: createUserWaiting.message })

            const sendEmail = EmailService.sendEmail(email, name, token.token, 'cadastro')

            res.status(201).json({ success: true, message: 'Um e-mail de confirmação foi enviado para o seu endereço de e-mail. Por favor, verifique sua caixa de entrada (e também a pasta de spam ou lixo eletrônico).' })
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async ConfirmUser(req, res) {
        try {
            const { token } = req.body

            if (!token) return res.status(401).json({ success: false, message: 'Token não fornecido!' })

            const tokenVerify = await TokenService.VerifyToken(token)
            if (!tokenVerify.success) return res.status(400).json({ success: false, message: tokenVerify.message, user: tokenVerify.user })

            const findEmail = await UserService.FindEmail(tokenVerify.user.email)
            if (!findEmail.success) return res.status(404).json({ success: false, message: 'Sua conta já foi confirmada! Você pode acessar o serviço a qualquer momento.' })

            const findEmailWaiting = await UserService.FindEmailWaiting(tokenVerify.user.email)
            if (findEmailWaiting.success) return res.status(404).json({ success: false, message: 'Não encontramos nenhuma conta vinculada a esse e-mail.' })

            const User = findEmailWaiting.user[0][0]
            const createUser = await UserService.CreateUser(User.name, User.date_birth, User.email, User.password)
            if (!createUser.success) return res.status(400).json({ success: false, message: 'Erro ao fazer a confirmação do usúario.' })

            const deleteUserWaiting = await UserService.DeleteUserWaiting(User.email);
            if (!deleteUserWaiting.success) return res.status(400).json({ success: false, message: 'Erro ao fazer a confirmação do usúario.' })

            res.status(200).json({ success: true, message: 'E-mail confirmado com sucesso!' })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async ResendConfirmEmail(req, res) {
        try {
            const { email } = req.body

            if (!email) return res.status(400).json({ success: false, message: 'E-mail é obrigatório.' })
            const validateEmail = await UserService.ValidateEmail(email)
            if (!validateEmail.success) return res.status(400).json({ success: false, message: 'E-mail inválido.' })

            const findEmail = await UserService.FindEmail(email)
            if (!findEmail.success) return res.status(400).json({ success: false, message: 'Essa conta já foi confirmada.' })

            const findEmailWaiting = await UserService.FindEmailWaiting(email)
            if (findEmailWaiting.success) return res.status(404).json({ success: false, message: 'Não encontramos nenhuma conta vinculada a esse e-mail.' })
            const User = findEmailWaiting.user[0][0]
            
            const verifyTimeResendConfirmEmail = await UserService.VerifyTimeResendConfirmEmail(User.token_dt_create)
            if(!verifyTimeResendConfirmEmail.success) return res.status(400).json({ success: false, message: verifyTimeResendConfirmEmail.message })
            
            const token = await TokenService.Create(email, 0, '15m')
            if (!token.success) return { success: false, message: 'Erro ao gerar token.' }

            const updateTokenConfirm = await UserService.UpdateTokenConfirm(User.id, token.token, token.dt_create)
            if(!updateTokenConfirm.success) return res.status(400).json({ success: false, message: 'Erro na atualização do token.'})

            const sendEmail = EmailService.sendEmail(email, User.name, token.token, 'cadastro')

            res.status(200).json({ success: true, message: 'Reenviamos o e-mail de confirmação.'})
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

}

export default new UserController();