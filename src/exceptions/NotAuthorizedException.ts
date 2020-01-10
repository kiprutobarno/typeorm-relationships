import HttpException from "./HttpException";

class NotAuthorizedException extends HttpException {
  constructor() {
    super(401, "Unauthorized");
  }
}

export default NotAuthorizedException;
