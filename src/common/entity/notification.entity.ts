import {
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Host } from "@common/entity/host.entity";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  chatId: number;

  @ManyToOne(() => Host, (host) => host.notifications)
  @JoinTable()
  host: Host;

  @Column({ nullable: true })
  message: string;
  @Column({ nullable: true })
  action: string;
  @Column({ default: "expect" })
  status: "expect" | "complete" | "error";

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  acceptedDateTime: Date;

  @Column({ nullable: true })
  sendDateTime: Date;
}
