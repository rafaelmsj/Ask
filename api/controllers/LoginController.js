import LoginService from '../services/LoginService.js';
import UserService from '../services/UserService.js';
import TokenService from '../services/TokenService.js';
import EmailService from '../services/EmailService.js'
import bcrypt from 'bcrypt'

class LoginController {
    async Login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) return res.status(400).json({ success: false, message: 'Todos os campos devem ser preenchidos.' })

            const validateEmail = await UserService.ValidateEmail(email)
            if (!validateEmail.success) return res.status(400).json({ success: false, message: 'E-mail inválido.' })

            const findEmailWaiting = await UserService.FindEmailWaiting(email);
            if (!findEmailWaiting.success && findEmailWaiting.message == 'Este usúario já está cadastrado, falta apenas confirmar o e-mail.') {
                const User = findEmailWaiting.user[0][0]
                const result = await bcrypt.compare(password, User.password)

                if (!result) return res.status(401).json({ success: false, message: 'E-mail ou senha incorreto.' })
                if (result) return res.status(401).json({ success: false, message: 'Usúrio aguardando confirmação de e-mail' })
            }

            const findEmail = await UserService.FindEmail(email)
            if (findEmail.success) return res.status(404).json({ success: false, message: 'Não encontramos nenhum usúario com esse e-mail.' })

            const User = findEmail.user[0][0]
            const resultPassword = await bcrypt.compare(password, User.password)
            if (!resultPassword) return res.status(404).json({ success: false, message: 'E-mail ou senha incorreto.' })

            const token = await TokenService.Create(email, User.id, User.name,'3h')
            if (!token.success) return { success: false, message: 'Erro ao gerar token.' }

            res.status(200).json({ success: true, message: 'Login realizado!', token: token.token })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async RecoveryPassword(req, res) {
        try {
            const { email } = req.body

            if (!email) return res.status(400).json({ success: false, message: 'E-mail é obrigatório.' })
            const validateEmail = await UserService.ValidateEmail(email)
            if (!validateEmail.success) return res.status(400).json({ success: false, message: 'E-mail inválido.' })

            const findEmailWaiting = await UserService.FindEmailWaiting(email)
            if (!findEmailWaiting.success && findEmailWaiting.user) {
                const User = findEmailWaiting.user[0][0]

                const verifyTimeResendConfirmEmail = await UserService.VerifyTimeResendConfirmEmail(User.token_dt_create)
                if (!verifyTimeResendConfirmEmail.success) return res.status(400).json({ success: false, message: verifyTimeResendConfirmEmail.message })

                const token = await TokenService.Create(email, 0, '15m')
                if (!token.success) return { success: false, message: 'Erro ao gerar token.' }

                const updateTokenConfirm = await UserService.UpdateTokenConfirm(User.id, token.token, token.dt_create)
                if (!updateTokenConfirm.success) return res.status(400).json({ success: false, message: 'Erro na atualização do token.' })

                const sendEmail = EmailService.sendEmail(email, User.name, token.token, 'cadastro')

                return res.status(200).json({ success: true, message: 'Reenviamos um e-mail para confirmação do seu e-mail.' })
            }

            const findEmail = await UserService.FindEmail(email)
            if (findEmail.success) return res.status(404).json({ success: false, message: 'Não encontramos nenhum usúario com esse e-mail.' })

            const User = findEmail.user[0][0]

            const token = await TokenService.Create(email, 0, '15m')
            if (!token.success) return { success: false, message: 'Erro ao gerar token.' }

            const sendEmail = EmailService.sendEmail(email, User.name, token.token, 'recovery')

            res.status(200).json({ success: true, message: 'E-mail de recuperação enviado!' })

        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async UpdateRecoveryPassword(req, res) {
        try {
            const { newPassword, newPasswordConfirm, token } = req.body

            if (!token || !newPassword || !newPasswordConfirm) return res.status(401).json({ success: false, message: 'Todos os campos devem ser preenchidos.' })

            const tokenVerify = await TokenService.VerifyToken(token)
            if (!tokenVerify.success) return res.status(400).json({ success: false, message: tokenVerify.message })

            const findEmail = await UserService.FindEmail(tokenVerify.user.email)
            if (findEmail.success) return res.status(404).json({ success: false, message: 'Não encontramos nenhuma conta vinculada.' })

            const validatePassword = await UserService.ValidatePassword(newPassword);
            if (!validatePassword.success) return res.status(400).json({ success: false, message: 'Senha fraca. Use pelo menos 8 caracteres, uma letra maiúscula, um número e um símbolo.' })
            if (newPassword !== newPasswordConfirm) return res.status(400).json({ success: false, message: 'As senhas não coincidem. Por favor, verifique se digitou corretamente a sua senha e tente novamente.' })

            const comparPassword = await UserService.ComparPassword(newPassword, findEmail.user[0][0].password)
            if (comparPassword.success) return res.status(400).json({ success: false, message: 'Você já está utilizando essa senha.' })

            const updateUserPassword = await UserService.UpdateUserPassword(newPassword, tokenVerify.user.email)
            if (!updateUserPassword.success) return res.status(400).json({ success: false, message: 'Tente novamente mais tarde.' })

            res.status(200).json({ success: true, message: 'Senha alterada com sucesso!' })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async ValidateTokenRecoveryPassword(req, res) {
        try {
            const { token } = req.body
            if (!token) return res.status(400).json({ success: false, message: 'Token não fornecido' });

            const tokenVerify = await TokenService.VerifyToken(token)
            if (!tokenVerify.success) return res.status(400).json({ success: false, message: tokenVerify.message })

            res.status(200).json({ success: true, message: 'Token válidado!'})
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async ValidateAuthenticate(req, res){
        try {
            const user = req.user
            res.status(200).json({ success: true, message: 'Usúario autenticado.', user: user})
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }
}

export default new LoginController();