import {MigrationInterface, QueryRunner} from "typeorm";

export class attributesAdded1662917194035 implements MigrationInterface {
    name = 'attributesAdded1662917194035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "attribute" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userid" character varying NOT NULL DEFAULT '',
                "attribute" character varying NOT NULL DEFAULT '',
                CONSTRAINT "PK_b13fb7c5c9e9dff62b60e0de729" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users" DROP COLUMN "attributes"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD "attribute_id" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users" DROP COLUMN "id"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD "id" SERIAL NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users" DROP COLUMN "attribute_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."users"
            ADD "attributes" character varying
        `);
        await queryRunner.query(`
            DROP TABLE "attribute"
        `);
    }

}
