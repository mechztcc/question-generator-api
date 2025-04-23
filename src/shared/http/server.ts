import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API com TypeScript e Express 🚀')
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000')
})
