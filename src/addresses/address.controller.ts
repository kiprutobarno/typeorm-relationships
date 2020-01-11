import { Request, Response, NextFunction, Router } from "express";
import { getRepository } from "typeorm";
import Controller from "../interfaces/controller.interface";
import Address from "../entity/address";
import { V2_BASE_URL } from "../Utils/constants";

class AddressController implements Controller {
  public path = `${V2_BASE_URL}/addresses`;
  public router = Router();
  private addressRepository = getRepository(Address);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllAddresses);
  }

  private getAllAddresses = async (_req: Request, res: Response) => {
    const addresses = await this.addressRepository.find();
    res.send(addresses);
  };
}

export default AddressController;
