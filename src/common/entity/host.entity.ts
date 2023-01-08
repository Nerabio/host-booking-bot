import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@common/entity/user.entity";

@Entity()
export class Host {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ default: true })
  isActive: boolean;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  lastChangedDateTime: Date;

  @ManyToOne(() => User, (user) => user.hosts)
  user: User;

  @Column({ nullable: true })
  userId: number;
}
