import { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";


const getAllUsers=async(req:Request,res:Response)=>{
  try {
    const allUsers=await userServices.getAllUsers()
    if(allUsers){
    return sendResponse(res,{
      success:true,
      statusCode:200,
      message:'Users retrieved successfully',
      data:allUsers
    })
  }
  return sendResponse(res,{
      success:true,
      statusCode:404,
      message:'No user data found!',
      data:allUsers
    })
  } catch (error) {
      return sendResponse(res,{
      success:true,
      statusCode:500,
      message: error instanceof Error? error.message:'Internal Server Error',
      data:[]
    })
    
  }

}

const updateUser=async(req:Request,res:Response)=>{
  const {id}=req.params;
  const {name,email,phone,role}=req.body;
  try {
    const result=await userServices.updateUser({name,email,phone,role},id as string)
    if(result){
    return sendResponse(res,{
      success:true,
      statusCode:200,
      message:'User updated successfully',
      data:result
    })
  }
  return sendResponse(res,{
      success:true,
      statusCode:404,
      message:'No user found with the id!',
      data:[]
    })
  } catch (error) {
      return sendResponse(res,{
      success:true,
      statusCode:500,
      message: error instanceof Error? error.message:'Internal Server Error',
      data:[]
    })
    
  }

}
const deleteUser=async(req:Request,res:Response)=>{
  const {id}=req.params;
  try {
    const result=await userServices.deleteUser(id as string)
    if(result){
    return sendResponse(res,{
      success:true,
      statusCode:200,
      message:'Users deleted successfully',
    })
  }
  return sendResponse(res,{
      success:true,
      statusCode:404,
      message:'No user found!',
      data:[]
    })
  } catch (error) {
      return sendResponse(res,{
      success:true,
      statusCode:500,
      message: error instanceof Error? error.message:'Internal Server Error',
      data:[]
    })
    
  }

}

export const userControllers={
  getAllUsers,
  updateUser,
  deleteUser
}