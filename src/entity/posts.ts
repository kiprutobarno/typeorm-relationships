import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import User from "../entity/user";
import Category from "../entity/category";

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(
    () => User,
    (author: User) => author.posts
  )
  public author: User;

  @ManyToMany(
    () => Category,
    (category: Category) => category.posts
  )
  @JoinTable()
  categories: Category[];
}

export default Post;
