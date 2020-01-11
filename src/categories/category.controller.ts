import Controller from "interfaces/controller.interface";
import { Router, Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import Category from "../entity/category";
import { V2_BASE_URL } from "../Utils/constants";
import CreateCategoryDto from "./category.dto";
import validationMiddleware from "../middleware/validation.middleware";
import CategoryNotFoundException from "../exceptions/CategoryNotFoundException";
import authMiddleware from "../middleware/auth.middleware";

class CategoryController implements Controller {
  public path = `${V2_BASE_URL}/categories`;
  public router = Router();
  private categoryRepository = getRepository(Category);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreateCategoryDto),
      this.createCategory
    );
    this.router.get(this.path, this.getCategories);
    this.router.get(`${this.path}/:id`, this.getCategory);
  }
  private createCategory = async (req: Request, res: Response) => {
    const data: CreateCategoryDto = req.body;
    const feedback = this.categoryRepository.create(data);
    await this.categoryRepository.save(feedback);
    res
      .status(201)
      .send({ status: 201, message: "Created", category: feedback });
  };

  private getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryRepository.find({
        relations: ["posts"]
      });
      // const categories = await this.categoryRepository.find();

      res
        .status(200)
        .send({ status: 200, message: "Success", categories: categories });
    } catch (error) {
      console.log(error);
    }
  };
  private getCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    const category = await this.categoryRepository.findOne(id, {
      relations: ["posts"]
    });
    if (category) {
      res.send(category);
    } else {
      next(new CategoryNotFoundException(id));
    }
  };
}

export default CategoryController;
