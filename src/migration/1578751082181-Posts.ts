import {MigrationInterface, QueryRunner} from "typeorm";

export class Posts1578751082181 implements MigrationInterface {
    name = 'Posts1578751082181'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" ADD "authorId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "authorId"`, undefined);
    }

}
