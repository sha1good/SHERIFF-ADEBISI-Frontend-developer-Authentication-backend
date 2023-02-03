import mongoose from "mongoose";
import Users from "../models/Users.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (request, response, next) => {
  const user = await Users.findOne({username : request.body.username});
  if(user){
    return next(createError(400,"User already exist!"));
  }
    try {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(
      request.body.password,
      salt
    );
    const newUser = new Users({
      ...request.body,
      password: hashPassword,
    });
    await newUser.save();
    response.status(200).json("User has been created!");
  } catch (error) {
    next(createError(error.status, error.message));
  }
};

export const signin = async (request, response, next) => {
  try {
    const user = await Users.findOne({ username: request.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrectPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!isCorrectPassword) return next(createError(400, "Wrong Credentials"));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...others } = user._doc;

    response
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(createError(error.status, error.message));
  }
};
