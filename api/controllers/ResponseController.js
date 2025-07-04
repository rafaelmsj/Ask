import ResponseService from '../services/ResponseService.js';
import QuestionService from '../services/QuestionService.js'

class ResponseController {

    async CreateResponse(req, res) {
        const { id_question, response } = req.body
        const id_user = req.user.id

        if (!id_user) return res.redirect('/login')

        if (!id_question || !response) return res.status(400).json({ success: false, message: 'Todos os campos devem ser preenchidos.' })

        const questionFind = await QuestionService.FindOne(id_question)
        if(!questionFind.success) return res.status(404).json({ success: false, message: 'Pergunta não encontrada'})

        if(response.length < 10) return res.status(400).json({ success: false, message: 'Por favor, digite uma resposta com no mínimo 10 caracteres.'})
    
        const createResponse = await ResponseService.CreateResponse(id_question, id_user, response)
        if(!createResponse.success) return res.status(400).json({ success: false, message: 'Não conseguimos registrar sua resposta, tente novamente.'})

        res.status(201).json({ success: true, message: 'Resposta registrada!'})
    }

}

export default new ResponseController();