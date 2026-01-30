const vehiclesTableCreateQuery = `CREATE TABLE IF NOT EXISTS vehicles(
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  registration_number VARCHAR(200) NOT NULL UNIQUE,
  daily_rent_price INTEGER NOT NULL,
  availability_status VARCHAR(20) NOT NULL DEFAULT 'available',

  CONSTRAINT type_enum CHECK(type in ('car','bike','van','SUV')),
  CONSTRAINT daily_rent_price_positive CHECK(daily_rent_price>0),
  CONSTRAINT availability_status_enum CHECK (availability_status in ('available','booked'))
)`;

export default vehiclesTableCreateQuery;
