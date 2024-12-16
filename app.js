const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogController')
const usersRouter = require('./controllers/userController')
const loginRouter = require('./controllers/loginController')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const config = require('./utils/config')


// Middleware general
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(cors())
app.use(middleware.tokenExtractor)

// Conectar con la base de datos


mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((error) =>
    logger.error('Error connecting to MongoDB:', error.message)
  )



// Rutas
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Middlewares para manejo de errores y rutas desconocidas
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
