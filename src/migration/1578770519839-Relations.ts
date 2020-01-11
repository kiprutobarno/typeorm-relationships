import {MigrationInterface, QueryRunner} from "typeorm";

export class Relations1578770519839 implements MigrationInterface {
    name = 'Relations1578770519839'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "authorId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "addressId" integer, CONSTRAINT "REL_217ba147c5de6c107f2fa7fa27" UNIQUE ("addressId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "street" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "post_categories_category" ("postId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_91306c0021c4901c1825ef097ce" PRIMARY KEY ("postId", "categoryId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_93b566d522b73cb8bc46f7405b" ON "post_categories_category" ("postId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_a5e63f80ca58e7296d5864bd2d" ON "post_categories_category" ("categoryId") `, undefined);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "post_categories_category" ADD CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "post_categories_category" ADD CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_a5e63f80ca58e7296d5864bd2d3"`, undefined);
        await queryRunner.query(`ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_93b566d522b73cb8bc46f7405bd"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271"`, undefined);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_c6fb082a3114f35d0cc27c518e0"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_a5e63f80ca58e7296d5864bd2d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_93b566d522b73cb8bc46f7405b"`, undefined);
        await queryRunner.query(`DROP TABLE "post_categories_category"`, undefined);
        await queryRunner.query(`DROP TABLE "address"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "post"`, undefined);
        await queryRunner.query(`DROP TABLE "category"`, undefined);
    }

}
