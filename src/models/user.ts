const usersTableCreateQuery = `CREATE TABLE IF NOT EXISTS users(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',

  CONSTRAINT email_lowercase CHECK (email=LOWER(email)),
  CONSTRAINT role_enum CHECK(role IN ('customer','admin'))
)`;

export default usersTableCreateQuery;
