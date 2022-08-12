# node_postgres_libraryapi_example
based on the mozilla tutorial

Edit line 2 in db.js to connect to your db location.

CRUD HTTP endpoints:
Substitute 'model' with genre, author, book, or bookinstance. 

Create - POST /model/
Read - GET /model/:id
Update - PUT /model/:id
Delete - DELETE /model/:id

Inputs are accepted in JSON format.  Add an { id: Integer } field that matches the id in the parameter for updates.

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
