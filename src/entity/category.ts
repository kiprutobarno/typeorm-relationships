import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";
import Post from "../entity/posts";
@Entity()
class Category {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @ManyToMany(
    () => Post,
    (post: Post) => post.categories
  )
  public posts: Post[];
}
export default Category;
