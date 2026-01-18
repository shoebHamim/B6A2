const bookingsTableCreateQuery=`CREATE TABLE IF NOT EXISTS bookings(
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  vehicle_id INTEGER NOT NULL,
  rent_start_date TIMESTAMPTZ NOT NULL,
  rent_end_date TIMESTAMPTZ NOT NULL,
  total_price INTEGER NOT NULL,
  status VARCHAR(50),

  CONSTRAINT customer_id_fk FOREIGN KEY(customer_id) REFERENCES users(id),
  CONSTRAINT vehicle_id_fk FOREIGN KEY(vehicle_id) REFERENCES vehicles(id),
  CONSTRAINT rent_end_date_after CHECK(rent_end_date>rent_start_date),
  CONSTRAINT total_price_positive CHECK(total_price>0),
  CONSTRAINT status_enum CHECK(status IN ('active','cancelled','returned'))
)`
export default bookingsTableCreateQuery;
