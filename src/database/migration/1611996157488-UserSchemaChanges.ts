import {MigrationInterface, QueryRunner} from "typeorm";

export class UserSchemaChanges1611996157488 implements MigrationInterface {
    name = 'UserSchemaChanges1611996157488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_1b0e793818b0c0efd4523a5c21a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "socketId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "socketId" text`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_1b0e793818b0c0efd4523a5c21a" UNIQUE ("socketId")`);
    }

}
