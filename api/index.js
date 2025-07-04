import 'dotenv/config'
import express from 'express'
const app = express()
import Router from './routes/routes.js'
import cors from 'cors'

app.use(cors())

app.use(express.json())

app.use('/', Router)

app.listen(3000, ()=> {
    console.log('App Online')
})