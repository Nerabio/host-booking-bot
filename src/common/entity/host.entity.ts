import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@common/entity/user.entity";
import { Notice } from "@common/entity/notice.entity";

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

  @Column({ nullable: true })
  busyDateTime: Date;

  @ManyToOne(() => User, (user) => user.hosts)
  @JoinTable()
  user: User;

  @OneToMany(() => Notice, (notice) => notice.host)
  @JoinTable()
  notices: Notice[];

  public dismiss(): void {
    this.user = null;
    this.busyDateTime = null;
  }
  public take(user: User): void {
    this.user = user;
    this.busyDateTime = new Date();
  }
}
