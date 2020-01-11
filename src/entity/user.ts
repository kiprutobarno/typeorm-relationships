import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import Address from "../entity/address";

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
}

export default User;
