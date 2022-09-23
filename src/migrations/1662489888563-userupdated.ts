import {MigrationInterface, QueryRunner} from "typeorm";

export class userupdated1662489888563 implements MigrationInterface {
    name = 'userupdated1662489888563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ALTER COLUMN "attributes" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ALTER COLUMN "attributes"
            SET NOT NULL
        `);
    }

}
