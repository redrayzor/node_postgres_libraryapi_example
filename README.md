# node_postgres_libraryapi_example
Schema is based on the Node/Express/MongoDB tutorial on MDN.  This demo app recreates the schema, but connects to a PostgreSQL database instead of the NoSQL database in the tutorial.  This app uses Sequelize as the ORM, and the code is rewritten because of differences between SQL and NoSQL.

You will need a PostgreSQL database in order for this app to be able to perform its CRUD operations.  The PostgreSQL database can be created however and wherever you want.  If you need a suggestion, I suggest creating the database in a Docker container so that you can easily destroy the container after you finish using this demo app.

After you have a database for this app to operate on, edit line 2 in db.js to match the username, password, and database name in order to connect the app to the database.

Use Postman or another API testing tool to perform CRUD operations on the HTTP endpoints below.

CRUD HTTP endpoints:
Substitute 'model' with genre, author, book, or bookinstance.  Substitute :id with the integer id of the object.

Create - POST /model/
Read - GET /model/:id
Update - PUT /model/:id
Delete - DELETE /model/:id

Inputs are accepted in JSON format.  Add an { id: Integer } field that matches the id in the parameter when you perform update operations.

genre
{
  name: String
}

author
{
  first_name: String,
  family_name: String,
  date_of_birth: Date (optional),
  date_of_death: Date (optional)
}

book
{
  title: String,
  summary: String,
  isbn: String,
  AuthorId: Integer,
  GenreIds: Array [Integers] (optional)
}

bookinstance
{
  imprint: String,
  status: Enum (Available, Maintenance, Loaned, or Reserved),
  due_back: Date (optional),
  BookId: Integer
}
