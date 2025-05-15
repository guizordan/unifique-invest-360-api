import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCustomer1747336618788 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "customer",
        columns: [
          {
            name: "id",
            type: "varchar",
            isPrimary: true,
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "phone",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "fullName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "firstName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "lastName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "cpf",
            type: "varchar",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "datetime",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("customer");
  }
}
