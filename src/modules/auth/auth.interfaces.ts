export interface userInterface {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: "customer" | "admin";
}

export const roles = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};
