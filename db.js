const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres');

const Author = sequelize.define('Author', {
    first_name: {type: DataTypes.STRING, allowNull: false},
    family_name: {type: DataTypes.STRING, allowNull: false},
    date_of_birth: {type: DataTypes.DATE},
    date_of_death: {type: DataTypes.DATE},
}, {timestamps: false});

const Book = sequelize.define('Book', {
    title: {type: DataTypes.STRING, allowNull: false},
    summary: {type: DataTypes.STRING, allowNull: false},
    isbn: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false});

const BookInstance = sequelize.define('BookInstance', {
    imprint: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.ENUM, values: ['Available', 'Maintenance', 'Loaned', 'Reserved'], allowNull: false},
    due_back: {type: DataTypes.DATE},
}, {timestamps: false});

const Genre = sequelize.define('Genre', {
    name: {type: DataTypes.STRING, allowNull: false, unique: true}
}, {timestamps: false});

const BookGenres = sequelize.define('BookGenres', {
    BookId: {type: DataTypes.INTEGER, references: {model: Book, key: 'id'}},
    GenreId: {type: DataTypes.INTEGER, references: {model: Genre, key: 'id'}, onDelete: 'RESTRICT'},
}, {timestamps: false});

Author.hasMany(Book, {foreignKey: {allowNull: false}, onDelete: 'RESTRICT'});
Book.belongsTo(Author);

Book.hasMany(BookInstance, {foreignKey: {allowNull: false}, onDelete: 'RESTRICT'});
BookInstance.belongsTo(Book);

Book.belongsToMany(Genre, {through: 'BookGenres'});
Genre.belongsToMany(Book, {through: 'BookGenres'});

module.exports = { Sequelize, sequelize, Author, Book, BookInstance, Genre, BookGenres };