import { MigrationInterface, QueryRunner } from "typeorm";

export class addHost1673691189055 implements MigrationInterface {
  name = "addHost1673691189055";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "host"(title)VALUES('dev.kion.ru'),('prod.kion.ru'),('s1.dev.kion.ru'),('s2.dev.kion.ru'),('s3.dev.kion.ru'),('test.kion.ru'),('hisense.kion.ru')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
