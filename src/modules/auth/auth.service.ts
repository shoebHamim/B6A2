import config from "../../config";
import { pool } from "../../config/db";
import { userInterface } from "./auth.interfaces";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const signUp = async (userInfo: userInterface): Promise<userInterface> => {
  try {
    {
      let { name, email, password, phone, role } = userInfo;
      role = role || "customer";
      const hashedPassword = await bcrypt.hash(
        password,
        Number(config.saltRound),
      );
      const result = await pool.query(
        `INSERT INTO users(name,email,password,phone,role)
      VALUES($1,$2,$3,$4,$5)
      RETURNING id,name,email,phone,role
      `,
        [name, email, hashedPassword, phone, role],
      );
      return result.rows[0];
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to register user",
    );
  }
};

const signIn = async (email: string, password: string): Promise<any> => {
  try {
    {
      const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        email,
      ]);
      if (result.rowCount === 0) return null;
      const { password: fetchedPassword, ...fetchedUser } = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, fetchedPassword);
      if (!passwordMatch) return null;
      const secret = config.json_secret as string;

      const token = jwt.sign(
        {
          id: fetchedUser.id.toString(),
          name: fetchedUser.name,
          email: fetchedUser.email,
          role: fetchedUser.role,
        },
        secret,
        { expiresIn: "1d" },
      );

      return { fetchedUser, token };
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Sign-in failed");
  }
};

export const authService = {
  signUp,
  signIn,
};
