import TokenService from '../services/TokenService.js';

class AuthenticateMiddleware {

    async Authenticate(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) return res.redirect('/login')

            const tokenVerify = await TokenService.VerifyToken(token)
            if (!tokenVerify.success) return res.status(400).json({ success: false, message: tokenVerify.message })
            
            if(tokenVerify.user.id == 0) return res.redirect('/login')

            req.user = tokenVerify.user

            next();

        } catch (err) {
            return res.status(403).json({
                success: false,
                message: 'Token Invalido'
            });            
        }
    }
}

export default new AuthenticateMiddleware();