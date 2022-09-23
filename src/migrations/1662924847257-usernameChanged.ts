import {MigrationInterface, QueryRunner} from "typeorm";

export class usernameChanged1662924847257 implements MigrationInterface {
    name = 'usernameChanged1662924847257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."users"
                RENAME COLUMN "name" TO "username"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."users"
                RENAME COLUMN "username" TO "name"
        `);
    }

}
