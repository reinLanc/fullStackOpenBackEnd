const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (favorite, blog) => {
      return favorite.likes > blog.likes ? favorite : blog
    },
    { likes: 0 }
  )
}

const mostBlogs = (blogs) => {
  const authorBlogs = _.countBy(blogs, 'author')
  const mostBlogsAuthor = _.maxBy(Object.entries(authorBlogs), ([author, count]) => count)

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1],
  }
}

const mostLikes = (blogs) => {
  const authorLikes = _.groupBy(blogs, 'author')
  const mostLikesAuthor = _.maxBy(Object.entries(authorLikes), ([author, blogs]) => _.sumBy(blogs, 'likes'))

  return {
    author: mostLikesAuthor[0],
    likes:_.sumBy(mostLikesAuthor[1],'likes'),
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
