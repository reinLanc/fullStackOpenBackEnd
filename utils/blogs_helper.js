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

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}