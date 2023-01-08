import { MigrationInterface, QueryRunner } from "typeorm";

export class initTable1672985422619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO public.host(title)VALUES('dev.kion.ru'),('prod.kion.ru'),('s1.dev.kion.ru'),('s2.dev.kion.ru'),('s3.dev.kion.ru'),('test.kion.ru'),('hisense.kion.ru')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
