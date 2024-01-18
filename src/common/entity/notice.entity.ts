import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Host } from "@common/entity/host.entity";

@Entity()
export class Notice {
  @Index({ unique: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Host, (host) => host.notices)
  host: Host;

  @Column({ nullable: false })
  chatId: string;
  @Column({ nullable: true })
  message: string;

  @Column({ default: "expect" })
  status: "expect" | "complete" | "error";

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  acceptedDateTime: Date;

  @Column({ nullable: true })
  sendDateTime: Date;
}
