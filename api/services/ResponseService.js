import db from '../database/db.js';

class ResponseService {

    async CreateResponse(id_question, id_user, response) {
        try {
            await db.execute(
                `INSERT INTO response_question (id_question, id_user, response, created, modified) VALUES (?, ?, ?, ?, ?)`,
                [id_question, id_user, response, new Date(), new Date()]
            )

            return { success: true, message: 'Resposta registrada!' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor', error: err.message }
        }
    }

    async FindResponsesForQuestion(id) {
        try {
            const responses = await db.execute(
                `SELECT * FROM response_question WHERE id_question = ${id}`
            )

            if (responses[0][0].length < 0) return { success: false, message: 'Essa pergunta ainda não obteve respostas.' }

            return { success: true, message: 'Listando Respostas.', responses: responses[0] }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor.', error: err.message }
        }
    }
}

export default new ResponseService();