import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAmount implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. add column
    await queryRunner.query(`
      ALTER TABLE Portfolio
      ADD COLUMN amount BIGINT DEFAULT 0
    `);

    // 2. backfill old rows
    await queryRunner.query(`
      UPDATE Portfolio
      SET amount = 0
      WHERE amount IS NULL OR amount = 0
    `);

    // 3. enforce not null (optional)
    await queryRunner.query(`
      ALTER TABLE Portfolio
      ALTER COLUMN amount SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE Portfolio
      DROP COLUMN amount
    `);
  }
}
