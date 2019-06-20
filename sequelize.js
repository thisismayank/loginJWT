const Sequelize = require('sequelize')
const UserModel = require('./models/users')
const FileModel = require('./models/file')
const userFileMappingModel = require('./models/user-file-mapping');



const sequelize = new Sequelize('users', 'postgres', 'postgres', {
    dialect: 'postgres',
    // logging: false
});

const User = UserModel(sequelize, Sequelize)
const File = FileModel(sequelize, Sequelize)
const userFileMapping = userFileMappingModel(sequelize, Sequelize)

// // BlogTag will be our way of tracking relationship between Blog and Tag models
// // each Blog can have multiple tags and each Tag can have multiple blogs
// const BlogTag = sequelize.define('blog_tag', {})
// const Blog = BlogModel(sequelize, Sequelize)
// const Tag = TagModel(sequelize, Sequelize)

// Blog.belongsToMany(Tag, { through: BlogTag, unique: false })
// Tag.belongsToMany(Blog, { through: BlogTag, unique: false })
// Blog.belongsTo(User);

// sequelize.sync({ force: true })
//   .then(() => {
//     console.log(`Database & tables created!`)
//   })

module.exports = {
  User,
  File,
  userFileMapping
}