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
