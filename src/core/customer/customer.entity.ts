import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export default class Customer {
  @PrimaryColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  phone: string;

  @Column({ type: "varchar" })
  fullName: string;

  @Column({ type: "varchar" })
  firstName: string;

  @Column({ type: "varchar" })
  lastName: string;

  @Column({ type: "varchar", unique: true })
  cpf: string;

  constructor(data?: {
    id?: string;
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    cpf?: string;
  }) {
    this.id = data?.id ?? "";
    this.email = data?.email ?? "";
    this.phone = data?.phone ?? "";
    this.firstName = data?.firstName ?? "";
    this.lastName = data?.lastName ?? "";
    this.fullName = `${data?.firstName ?? ""} ${data?.lastName ?? ""}`;
    this.cpf = data?.cpf ?? "";
  }

  isValidEmail(): boolean {
    return this.email.includes("@");
  }
}
