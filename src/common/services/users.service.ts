import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByTelegramId(telegramId: string): Promise<User> {
    return this.usersRepository.findOneBy({ telegramId });
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async save(user: User): Promise<void> {
    await this.usersRepository.save(user);
  }
}
