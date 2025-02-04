import express, { Express } from 'express'
import cors from 'cors'
import Moralis from 'moralis'
import user from './routes/api/user'
import utils from './routes/api/utils'
import upload from './routes/api/upload'
import metadata from './routes/api/metadata'
import connectDB from './lib/dbConnect'
import dotenv from 'dotenv'

dotenv.config()
const app: Express = express()
const port: Number = process.env.PORT ? Number(process.env.PORT) : 5050

connectDB()
app.set('trust proxy', true)
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('>>> server is running...')
})

app.use('/api/user', user)
app.use('/api/utils', utils)
app.use('/api/upload', upload)
app.use('/api/metadata', metadata)

async function startServer() {
  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    })
    console.log('moralis start....')

    app.listen(port, () => {
      console.log(`Server is listening on ${port}`)
    })
  } catch (err) {
    console.log(err)
  }
}

startServer()
