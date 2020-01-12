import bcrypt from "bcrypt";
import { Request, Response, NextFunction, Router } from "express";
import Controller from "../interfaces/controllerInterface";
import validationMiddleware from "../middleware/valdationMiddleware";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import LogInDto from "../dtos/loginDto";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import CreateUserDto from "../dtos/userDto";
import jwt from "jsonwebtoken";
import TokenData from "../interfaces/tokenDataInterface";
import DataStoredInToken from "../interfaces/dataStoredInTokenInterface";
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
    const feedback = await this.userRepository.findOne({ email: data.email });

    const { password } = feedback;

    if (feedback) {
      const isPasswordMatching = await bcrypt.compare(data.password, password);
      if (isPasswordMatching) {
        const tokenData = this.createToken(feedback);
        this.createCookie(res, tokenData);
        res
          .status(200)
          .send({ status: 200, message: "Success", token: tokenData.token });
      } else {
        next(new WrongCredentialsException());
      }
    }
  };

  private createCookie(res, data: TokenData) {
    return res.cookie("token", data.token, {
      expiresOn: new Date(Date.now() + data.expiresIn),
      secure: false,
      httpOnly: true
    });
  }

  private createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = config.SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      email: user.email
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
  }
}

export default AuthenticationController;
