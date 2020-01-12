import { Request } from "express";
import User from "./userInterface";

interface RequestWithUser extends Request {
  user: User;
}
export default RequestWithUser;
