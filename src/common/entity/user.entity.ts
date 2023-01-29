import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Host } from "@common/entity/host.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  telegramName: string;

  @Column()
  telegramId: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany((type) => Host, (host) => host.user)
  hosts: Host;
}
