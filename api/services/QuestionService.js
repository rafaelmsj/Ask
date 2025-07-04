import db from '../database/db.js'

class QuestionService {

    async FindAll() {
        try {
            const questions = await db.execute(
                `SELECT q.*, u.name FROM question q LEFT JOIN user u ON q.id_user = u.id ORDER BY q.id ASC`
            )

            return { success: true, message: 'Listando Perguntas.', questions: questions[0] }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor.', error: err.message }
        }
    }

    async FindOne(id) {
        try {
            const question = await db.execute(
                `SELECT * FROM question WHERE id = ${id}`
            )

            if (question[0][0].length < 0) return { success: false, message: 'Não encontramos nenhuma pergunta com esse valor.' }

            return { success: true, message: 'Listando Perguntas.', question: question[0][0] }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor.', error: err.message }
        }
    }

    async Create(id_user, title, description) {
        try {
            await db.execute(
                `INSERT INTO question (id_user, title, description, created, modified) VALUES (?, ?, ?, ?, ?)`,
                [id_user, title, description, new Date(), new Date()]
            )
            return { success: true, message: 'Pergunta inserida com sucesso.' }
        }
        catch (err) {
            console.log(err.message)
            return { success: false, message: 'Erro interno no servidor.', error: err.message }
        }
    }

}

export default new QuestionService();