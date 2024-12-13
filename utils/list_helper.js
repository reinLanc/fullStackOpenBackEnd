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
  const authorCount = {}

  blogs.forEach((blog) => {
    authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
  })

  let maxBlogs = 0
  let mostBlogsAuthor = ''
  for (let author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxBlogs = authorCount[author]
      mostBlogsAuthor = author
    }
  }

  return {
    author: mostBlogsAuthor,
    blogs: maxBlogs,
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
