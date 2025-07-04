import jwt from 'jsonwebtoken'

const jwt_secret = process.env.JWT_SECRET

class TokenService {

    async Create(email, id, name,timeExpired) {
        try {
            let user = {
                email: email,
                id: id,
                name: name
            }

            const token = jwt.sign({ user }, jwt_secret, { expiresIn: timeExpired })

            return { success: true, message: 'Token gerado!', token: token, dt_create: new Date() }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async VerifyToken(token) {
        try {

            let success
            let decoded = ''
            let tokenMsg = ''
            let user = ''

            try {
                success = true
                decoded = jwt.verify(token, jwt_secret);
            }
            catch (jwt_error) {
                success = false
                tokenMsg = jwt_error.message
                if (jwt_error.message == 'jwt expired') decoded = jwt.decode(token);
                    if (decoded && decoded.email) user = decoded.email;
            }

             user = decoded.user;

            return { success: success, message: tokenMsg, user: user }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor.', error: err.message }
        }
    }
}

export default new TokenService();