import { MigrationInterface, QueryRunner } from "typeorm";

export class initTable1672985422619 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   'CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "telegramName" character varying NOT NULL, "telegramId" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))'
    // );
    //
    // await queryRunner.query(
    //   'CREATE TABLE "host" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "busyDateTime" TIMESTAMP, "userId" integer, CONSTRAINT "PK_44424c24c2f9b1d7bbf8721f4c4" PRIMARY KEY ("id"))'
    // );
    //
    // await queryRunner.query(
    //   'CREATE TABLE "notice" ("id" SERIAL NOT NULL, "chatId" character varying NOT NULL, "message" character varying, "status" character varying NOT NULL DEFAULT \'expect\', "acceptedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sendDateTime" TIMESTAMP, "hostId" integer, CONSTRAINT "PK_705062b14410ff1a04998f86d72" PRIMARY KEY ("id"))'
    // );
    //
    // await queryRunner.query(
    //   'CREATE UNIQUE INDEX "IDX_705062b14410ff1a04998f86d7" ON "notice" ("id")'
    // );
    //
    // await queryRunner.query(
    //   'ALTER TABLE "notice" ADD CONSTRAINT "FK_2c5bc8aa293eaeb5ea6dd8b1557" FOREIGN KEY ("hostId") REFERENCES "host"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    // );
    // await queryRunner.query(
    //   'ALTER TABLE "host" ADD CONSTRAINT "FK_2f0ee47b94c3cf61a7bf4716a67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION'
    // );
    await queryRunner.query(
      "INSERT INTO public.host(title)VALUES('dev.kion.ru'),('prod.kion.ru'),('s1.dev.kion.ru'),('s2.dev.kion.ru'),('s3.dev.kion.ru'),('test.kion.ru'),('hisense.kion.ru')"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
