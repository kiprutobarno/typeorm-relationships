import bcrypt from "bcrypt";
import { Request, Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import LogInDto from "./login.dto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import CreateUserDto from "../users/user.dto";
import jwt from "jsonwebtoken";
import TokenData from "../interfaces/tokenData.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import { config } from "../Utils/config";
import { V2_BASE_URL } from "../Utils/constants";
import { getRepository } from "typeorm";
import User from "../entity/user";

class AuthenticationController implements Controller {
  public path = `${V2_BASE_URL}/auth`;
  public router = Router();
  private userRepository = getRepository(User);

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

    if (await this.userRepository.findOne({ email: data.email })) {
      next(new UserWithThatEmailAlreadyExistsException(data.email));
    } else {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await this.userRepository.create({
        ...data,
        password: hashedPassword
      });
      await this.userRepository.save(user);
      user.password = undefined;

      res.status(201).send({ status: 201, message: "Success", user: user });
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    const data: LogInDto = req.body;
    const feedback = await this.userRepository
      .createQueryBuilder()
      .addSelect("password")
      .getRawOne();

    const { password } = feedback;

    if (feedback) {
      const isPasswordMatching = await bcrypt.compare(data.password, password);
      if (isPasswordMatching) {
        const token = this.createToken(feedback).token;
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
      id: user.id
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }
}

export default AuthenticationController;
