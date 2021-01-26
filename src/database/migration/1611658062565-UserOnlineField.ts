import {MigrationInterface, QueryRunner} from "typeorm";

export class UserOnlineField1611658062565 implements MigrationInterface {
    name = 'UserOnlineField1611658062565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-26T10:47:42.670Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-26 10:47:01.879'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
    }

}
