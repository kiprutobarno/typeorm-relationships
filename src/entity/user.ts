import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import Address from "../entity/address";
import Post from "../entity/posts";

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public email: string;

  @Column({ select: false })
  public password: string;

  @OneToOne(
    () => Address,
    (address: Address) => address.user,
    {
      cascade: true,
      eager: true
    }
  )
  @JoinColumn()
  public address: Address;

  @OneToMany(
    () => Post,
    (post: Post) => post.author
  )
  public posts: Post[];
}

export default User;
