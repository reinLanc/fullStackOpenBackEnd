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

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  assert(response.body[0].id)
})

test('A new valid blog can be added', async () => {
  const newBlog = {
    title: 'test Blog',
    url: 'http://testing.com',
    likes:54
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('test Blog'))
})

test.only('Likes default to 0 if missing',async () => {
  const newBlog = {
    title: 'test Blog with 0 likes',
    url: 'http://testing.com',
  }
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})
