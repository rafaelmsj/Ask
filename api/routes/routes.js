import express from 'express'
const Router = express.Router()
import UserController from '../controllers/UserController.js'
import LoginController from '../controllers/LoginController.js'
import AuthenticateMiddleware from '../middlewares/AuthenticateMiddleware.js'
const Authenticate = AuthenticateMiddleware.Authenticate
import QuestionController from '../controllers/QuestionController.js'
import ResponseController from '../controllers/ResponseController.js'
import GeminiController from '../controllers/GeminiController.js'

Router.post('/validate-authenticate', Authenticate, LoginController.ValidateAuthenticate)

Router.post('/register', UserController.Create)
Router.put('/confirm-email', UserController.ConfirmUser)
Router.post('/reconfirm-email', UserController.ResendConfirmEmail)

Router.post('/login', LoginController.Login)
Router.post('/validate-recovery', LoginController.ValidateTokenRecoveryPassword)
Router.post('/recovery-password', LoginController.RecoveryPassword)
Router.put('/recovery-password', LoginController.UpdateRecoveryPassword)

Router.get('/', QuestionController.FindAll)
Router.get('/question/:id', Authenticate, QuestionController.FindOne)
Router.post('/question', Authenticate, QuestionController.Create)

Router.post('/response', Authenticate, ResponseController.CreateResponse)

Router.post('/correct-text', Authenticate, GeminiController.CorrectText)

export default Router