const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Rincon del roquero',
    author: 'Miguel Quero',
    url: 'http://rincondelrockero.blogspot.com',
    likes: 5,
  },
  {
    title: 'Soda stereo fans',
    author: 'Lucas',
    url: 'http://example.com',
    likes: 10,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as JSON and have the correct number', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test.only('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].id)
})

after(async () => {
  await mongoose.connection.close()
})
