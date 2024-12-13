const express = require('express')

const app = express()

const cors = require('cors')

const mongoose = require('mongoose')

const blogRoutes = require('./routes/blogRoutes')

const url = 'mongodb+srv://user:Password@cluster0.p4awt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(url)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRoutes)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})