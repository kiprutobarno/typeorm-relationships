import bcrypt from "bcrypt";
import cookie from "cookie";
import { Request, Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "../posts/post.dto";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import LogInDto from "./login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import userModel from "../users/user.models";
import CreateUserDto from "../users/user.dto";
import jwt from "jsonwebtoken";
import TokenData from "../interfaces/tokenData.interface";
import User from "../users/user.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import { config } from "../Utils/config";
// import cookieParser from "cookie-parser";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = Router();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.login
    );
  }

  registration = async (req: Request, res: Response, next: NextFunction) => {
    const data: CreateUserDto = req.body;
    if (await this.user.findOne({ email: data.email })) {
      next(new UserWithThatEmailAlreadyExistsException(data.email));
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.user.create({
        ...data,
        password: hashedPassword
      });
      user.password = undefined;
      const tokenData = this.createToken(user);
      res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
      res.status(201).send({ status: 201, message: "Success", user: user });
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const data: LogInDto = req.body;
    const user = await this.user.findOne({ email: data.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        data.password,
        user.password
      );
      if (isPasswordMatching) {
        user.password = undefined;
        const token = this.createToken(user).token;
        res.status(200).send({ status: 200, message: "Success", token: token });
      } else {
        next(new WrongCredentialsException());
      }
    }
  };

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = config.SECRET;
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export default AuthenticationController;
