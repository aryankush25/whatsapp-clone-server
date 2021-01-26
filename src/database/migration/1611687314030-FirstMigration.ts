import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1611687314030 implements MigrationInterface {
    name = 'FirstMigration1611687314030'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "isEmailVerified" boolean NOT NULL DEFAULT false, "hashedPassword" character varying NOT NULL, "isOnline" boolean NOT NULL DEFAULT false, "socketId" text, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_1b0e793818b0c0efd4523a5c21a" UNIQUE ("socketId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, "deletedAt" TIMESTAMP, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
