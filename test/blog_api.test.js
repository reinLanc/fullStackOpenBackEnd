const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../utils/blogs_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as JSON and have the correct number', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
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

  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('test Blog'))
})

test('Likes default to 0 if missing',async () => {
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

test('creating blog without title or url return 400', async() => {
  const newBlog = {
    likes:5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeeds with a valid id and updated likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      likes: blogToUpdate.likes + 1,
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedBlog.likes)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlogInDb = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api
      .get(`/api/blogs/${validNonExistingId}`)
      .expect(404)
  })
})

after(async () => {
  await mongoose.connection.close()
})
