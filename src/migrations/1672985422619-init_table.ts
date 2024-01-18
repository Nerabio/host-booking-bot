import { MigrationInterface, QueryRunner } from "typeorm";

export class initTable1672985422619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO public.host(title)VALUES('skion.dev.kion.ru'),('skion.staging.kion.ru'),('skion.test.kion.ru'),('skion.qe.kion.ru'),('skion.kion.ru'),('hkion.dev.kion.ru'),('hkion.qe.kion.ru'),('hkion.test.kion.ru'),('hkion.kion.ru'),('hkion.staging.kion.ru'),('lkion.dev.kion.ru'),('lkion.qe.kion.ru'),('lkion.staging.kion.ru'),('lkion.test.kion.ru'),('lkion.kion.ru'),('dev.kion.ru'),('s1.dev.kion.ru'),('s2.dev.kion.ru'),('s3.dev.kion.ru'),('s1.staging.kion.ru'),('s2.staging.kion.ru'),('staging.kion.ru'),('test.kion.ru'),('s1.test.kion.ru'),('st.kion.ru'),('prod.kion.ru')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
