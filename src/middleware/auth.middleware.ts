import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuhenticationTokenException";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import userModel from "../users/user.models";
import { config } from "../Utils/config";
import ExpiredAuthenticationTokenException from "../exceptions/ExpiredAuthenticationTokenException";

async function authMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers["authorization"];
  if (typeof auth === "undefined") {
    next(new AuthenticationTokenMissingException());
  } else {
    const token = auth.replace("Bearer ", "");
    const secret = config.SECRET;
    try {
      const decode = jwt.verify(token, secret) as DataStoredInToken;
      const id = decode._id;
      const user = await userModel.findById(id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new ExpiredAuthenticationTokenException());
    }
  }
}
export default authMiddleware;
