require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(express.json())

const cors = require('cors')
app.use(
  cors({
    origin: [
      'http://localhost:3001/api/persons',
      'https://fullstackopenfrontend-dj4i.onrender.com',
    ],
  })
)

app.use(express.static('dist'))

morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.log(error.name , error.name === 'ValidationError')

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log('====')
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'data not found.' })
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).send({ error: 'data not found' })
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'Name and number are required' })
  }

  const person = new Person({
    name,
    number,
  })
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(request.params.id, updatedPerson, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((result) => {
      if (result) {
        response.json(result)
      } else {
        response.status(404).send({ error: 'data not found.' })
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  const currentTime = new Date().toString()
  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>Phonebook has info for ${count} people <br> ${currentTime}</p>`
      )
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
