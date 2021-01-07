import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigrationUpdateNew1610061765061 implements MigrationInterface {
    name = 'UserMigrationUpdateNew1610061765061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-07T23:22:45.187Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT '2021-01-07 23:22:06.395'`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."createdAt" IS NULL`);
    }

}
