import HttpException from "./HttpException";

class ExpiredAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, "Expired JWT token");
  }
}

export default ExpiredAuthenticationTokenException;
