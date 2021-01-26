import {MigrationInterface, QueryRunner} from "typeorm";

export class UserOnlineField11611658278214 implements MigrationInterface {
    name = 'UserOnlineField11611658278214'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-26 10:48:02.145'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
    }

}
