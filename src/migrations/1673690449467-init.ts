import { MigrationInterface, QueryRunner } from "typeorm";

export class init1673690449467 implements MigrationInterface {
    name = 'init1673690449467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "telegramName" character varying NOT NULL, "telegramId" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "host" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "lastChangedDateTime" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "busyDateTime" TIMESTAMP, "userId" integer, CONSTRAINT "PK_44424c24c2f9b1d7bbf8721f4c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "host" ADD CONSTRAINT "FK_2f0ee47b94c3cf61a7bf4716a67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "host" DROP CONSTRAINT "FK_2f0ee47b94c3cf61a7bf4716a67"`);
        await queryRunner.query(`DROP TABLE "host"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
