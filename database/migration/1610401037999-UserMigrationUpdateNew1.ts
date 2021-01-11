import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigrationUpdateNew11610401037999 implements MigrationInterface {
    name = 'UserMigrationUpdateNew11610401037999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-11T21:37:18.142Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-11 21:34:30.655'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
    }

}
