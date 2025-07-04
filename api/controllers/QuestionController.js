import QuestionService from '../services/QuestionService.js'
import ResponseService from '../services/ResponseService.js'

class QuestionController {

    async FindAll(req, res) {
        try {
            const questions = await QuestionService.FindAll()

            res.status(200).json({ success: true, message: 'Listando perguntas', questions: questions.questions})
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async Create(req, res){
        try {
            const { title, description } = req.body
            const user_id = req.user.id

            if(!user_id) return res.redirect('/login')

            if(!title || !description) return res.status(400).json({success: false, message: 'Todos os campos devem ser preenchidos.'})
            
            if(title.length < 10) return res.status(400).json({success: false, message: 'O título da sua pergunta deve ter no mínimo 10 caracteres. Por favor, edite o título.'})

            if(description.length < 10) return res.status(400).json({success: false, message: 'A Descrição da sua pergunta deve ter no mínimo 20 caracteres. Por favor, edite.'})

            const createQuestion = await QuestionService.Create(user_id, title, description)
            if(!createQuestion.success) return res.status(400).json({ success: false, message: 'Erro na criação da pergunta, Tente novamente.'})

            res.status(200).json({ success: true, message: 'Pergunta realizada!' })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

    async FindOne(req, res) {
        try {
            const { id } = req.params

            const question = await QuestionService.FindOne(id)
            if(!question.success) return res.status(404).json({ success: false, message: 'A pergunta não foi encontrada.'})

            const responses = await ResponseService.FindResponsesForQuestion(id)

            res.status(200).json({ success: true, message: 'Listando a pergunta e suas respostas.', question: question.question, responses: responses.responses})
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }
}

export default new QuestionController;