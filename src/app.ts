import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import initDB from "./config/db";

const app = express();
app.use(express.json());
try{
  initDB();
}
catch(err){
  throw Error("error connection db"+err)
}
app.get("/", (req: Request, res: Response) => {
  res.send("hello world!");
});

app.use("/api/v1/auth/", authRoutes);

app.use((req,res)=>{
  res.status(404).json({
    message:"no route found"
  })
})

export default app;
