import HttpException from "./HttpException";

class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, "Wrong login credentials provided");
  }
}

export default WrongCredentialsException;
