const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('totalLikes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ]
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('when list has many blogs, returns the correct sum', () => {
    const listWithManyBlogs = [
      { likes: 5 },
      { likes: 10 },
      { likes: 7 }
    ]
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 22)
  })

  test('when list is empty, equals zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favoriteBlog',() => {
  const blogs = [
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'non-Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 13
    }
  ]
  test('returns the blog with most likes',() => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result,{ title: 'non-Canonical string reduction',author: 'Edsger W. Dijkstra', likes: 13 })
  })
})

describe('mostBlogs', () => {
  const listWithMultipleBlogs = [
    { _id: '1', title: 'Blog 1', author: 'Edsger W. Dijkstra', likes: 5 },
    { _id: '2', title: 'Blog 2', author: 'Edsger W. Dijkstra', likes: 10 },
    { _id: '3', title: 'Blog 3', author: 'Robert C. Martin', likes: 3 },
    { _id: '4', title: 'Blog 4', author: 'Robert C. Martin', likes: 7 },
    { _id: '5', title: 'Blog 5', author: 'Robert C. Martin', likes: 1 }
  ]

  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })

  test('multiple authors with the same number of blogs', () => {
    const listWithSameNumberOfBlogs = [
      { _id: '1', title: 'Blog 1', author: 'Author 1', likes: 5 },
      { _id: '2', title: 'Blog 2', author: 'Author 1', likes: 3 },
      { _id: '3', title: 'Blog 3', author: 'Author 2', likes: 8 },
      { _id: '4', title: 'Blog 4', author: 'Author 2', likes: 10 }
    ]
    const result = listHelper.mostBlogs(listWithSameNumberOfBlogs)
    assert.ok(result.author === 'Author 1' || result.author === 'Author 2')
  })
})