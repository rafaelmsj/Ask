import db from '../database/db.js'
import bcrypt from 'bcrypt'

const salt = bcrypt.genSaltSync(parseInt(process.env.B_SALT));

class UserService {

    async FindEmail(email) {
        try {
            const result = await db.execute(`SELECT id, name, password FROM user WHERE email = ?`, [email.toLowerCase().trim()]);

            if (result[0].length > 0) return { success: false, message: 'E-mail já está cadastrado.', user: result }

            return { success: true, message: 'Esse e-mail está livre' }
        }
        catch (err) {
            console.log(err)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async FindEmailWaiting(email) {
        try {
            const result = await db.execute(`SELECT id, name, date_birth, email, token_dt_create, password FROM user_waiting_confirm WHERE email = ?`, [email.toLowerCase().trim()]);

            if (result[0].length > 0) return { success: false, message: 'Este usúario já está cadastrado, falta apenas confirmar o e-mail.', user: result }

            return { success: true, message: 'Esse e-mail está livre' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async VerifyAge(date_birth) {
        try {
            const now = new Date()
            const birth = new Date(date_birth)

            let age = now.getFullYear() - birth.getFullYear();
            let month = now.getMonth() - birth.getMonth();
            let day = now.getDate() - birth.getDate();

            if (month < 0 || (month === 0 && day < 0)) age--;

            if (age < 4) return { success: false, message: 'Você precisa ter no minimo 4 anos para se cadastrar.' }

            if (age > 120) return { success: false, message: 'Por favor, digite uma idade válida.' }

            return { success: true, message: 'Idade Válida.' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async ValidatePassword(password) {
        try {
            const regexSenha = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%¨&!]).{8,}$/;

            return { success: regexSenha.test(password), message: '' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async CreateUserWaiting(name, date_birth, email, password, token, token_dt_create) {
        try {
            const hash = await bcrypt.hash(password, salt)

            await db.execute(
                `INSERT INTO user_waiting_confirm (name, date_birth, email, password, token, token_dt_create) VALUES (?, ?, ?, ?, ?, ?)`,
                [name, date_birth, email, hash, token, token_dt_create]
            )

            return { success: true, message: 'Usúario criado com sucesso!' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor.', error: err.message }
        }
    }

    async ValidateEmail(email) {
        try {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return { success: regex.test(email), message: '' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async CreateUser(name, date_birth, email, password) {
        try {
            await db.execute(
                `INSERT INTO user (name, date_birth, email, password, image, created, modified) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [name, date_birth, email, password, '', new Date(), new Date()]
            )

            return { success: true, message: 'Usúario inserido com sucesso.' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async DeleteUserWaiting(email) {
        try {
            await db.execute(
                `DELETE FROM user_waiting_confirm WHERE email = ? `,
                [email]
            )

            return { success: true, message: 'Usúario deletado com succeso.' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async VerifyTimeResendConfirmEmail(date_old_token) {
        try {
            const dateToken = new Date(date_old_token);

            const now = new Date();

            const dateMore5min = new Date(dateToken.getTime() + 5 * 60000);

            const diffInMs = dateMore5min - now;
            const diffInMinutes = Math.max(Math.floor(diffInMs / 60000), 0);

            const value = diffInMinutes <= 0;

            return { success: value, message: `você poderá solicitar um novo e-mail em ${diffInMinutes} minutos.` }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async UpdateTokenConfirm(id, token, token_dt_create) {
        try {
            await db.execute(
                `UPDATE user_waiting_confirm SET token = ?, token_dt_create = ? WHERE id = ?`,
                [token, token_dt_create, id]
            )

            return { success: true, message: 'Token atualizado com sucesso!' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async UpdateUserPassword(password, email) {
        try {
            const hash = await bcrypt.hash(password, salt)

            await db.execute(
                `UPDATE user SET password = ?, modified = ? WHERE email = ?`,
                [hash, new Date(), email]
            )

            return { success: true, message: 'Senha atualizada com sucesso.' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async ComparPassword(newPassword, currentPassword) {
        try {
            const result = await bcrypt.compare(newPassword, currentPassword)

            return { success: result }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }
}

export default new UserService();