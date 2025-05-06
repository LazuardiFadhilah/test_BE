import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { successResponse, errorResponse } from "../utils/response";
import { signJwt } from "$utils/jwt";
import prisma from "../prisma/client";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, phone_number, country, email, password } =
      req.body;

    if (
      !first_name ||
      !last_name ||
      !phone_number ||
      !country ||
      !email ||
      !password
    ) {
      return errorResponse(res, "ALL_FIELD_REQUIRED", 400);
    }

    const user = await userService.createUser({
      first_name,
      last_name,
      phone_number,
      country,
      email,
      password,
    });
    successResponse(res, user, "SUCCESS_CREATED_USER");
  } catch (err: any) {
    errorResponse(res, err.message);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    successResponse(res, users, "SUCCESS_GET_DATA", users.length.toString());
  } catch (err: any) {
    errorResponse(res, err.message);
  }
};

export const getUsersById = async (req: Request, res: Response) => {
    try {
      const users = await userService.userById(req.params.id);
      successResponse(res, users, "SUCCESS_GET_DATA");
    } catch (err: any) {
      errorResponse(res, err.message);
    }
  };

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    successResponse(res, user, "USER_DELETED");
  } catch (err: any) {
    errorResponse(res, err.message, 404);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await userService.userById(req.params.id);
    if (!existingUser) {
      return errorResponse(res, "USER_NOT_FOUND", 404);
    }
    var { first_name, last_name, phone_number, country, email, password } =
      req.body;
    if (first_name == "") {
      first_name = existingUser.first_name;
    }
    if (last_name == "") {
      last_name = existingUser.last_name;
    }
    if (phone_number == "") {
      phone_number = existingUser.phone_number;
    }
    if (country == "") {
      country = existingUser.country;
    }
    if (email == "") {
      email = existingUser.email;
    }
    if (password == "") {
      password = existingUser.password;
    }

    const updateData = await userService.updateUser(req.params.id, {
      first_name,
      last_name,
      phone_number,
      country,
      email,
      password,
    });
    successResponse(res, updateData, "SUCCESS_UPDATE_DATA");
  } catch (error: any) {
    errorResponse(res, error.message);
  }
};

export const loginUser = async (req:Request, res:Response)=>{
    try {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
        where:{email}
    });
    if(!user || user.password !== password){
        return errorResponse(res, "INVALID_EMAIL_OR_PASSWORD", 401);
        }
    const token = signJwt({userId: user.id});

    res.json({
        status:true,
        message:"LOGIN_SUCCESS",
        data:user,
        token
    })
    } catch (error: any) {
        errorResponse(res, error.message);
      }
}
