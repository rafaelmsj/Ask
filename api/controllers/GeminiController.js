import GeminiService from '../services/GeminiService.js';

class GeminiController {

    async CorrectText(req, res) {
        try {
            const text = req.body.text

            if (!text) return res.status(200).json({ text })

            const correctText = await GeminiService.CorrectText(text)
            if (!correctText.success) return res.status(200).json({ text })

            res.status(200).json({ text: correctText.text })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({ success: false, message: 'Erro interno no servidor', error: err.message })
        }
    }

}

export default new GeminiController();