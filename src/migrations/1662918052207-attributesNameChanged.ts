import {MigrationInterface, QueryRunner} from "typeorm";

export class attributesNameChanged1662918052207 implements MigrationInterface {
    name = 'attributesNameChanged1662918052207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "attributes" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "userid" character varying NOT NULL DEFAULT '',
                "attribute" character varying NOT NULL DEFAULT '',
                CONSTRAINT "PK_32216e2e61830211d3a5d7fa72c" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "attributes"
        `);
    }

}
