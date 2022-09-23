import {MigrationInterface, QueryRunner} from "typeorm";

export class passwordVerificationAdded1662921436922 implements MigrationInterface {
    name = 'passwordVerificationAdded1662921436922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "passwordVerification" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "code" integer NOT NULL,
                "expires_in" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_13d0795bb57369264aae7ff947e" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "passwordVerification"."expires_in" IS 'Expires in x seconds'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "passwordVerification"
        `);
    }

}
