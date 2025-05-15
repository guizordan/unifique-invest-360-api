import { Entity, PrimaryColumn, Column, Unique } from "typeorm";

@Entity()
export class Customer {
  @PrimaryColumn("uuid")
  id: string;

  @Column()
  @Unique(["email"])
  email: string;

  @Column()
  phone: string;

  @Column()
  fullName: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Unique(["cpf"])
  cpf: string;

  constructor(data: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    cpf: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.phone = data.phone;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.fullName = `${data.firstName} ${data.lastName}`;
    this.cpf = data.cpf;
  }

  isValidEmail(): boolean {
    return this.email.includes("@");
  }

  // You can uncomment and adapt the toJSON method if needed
  // toJSON(): Omit<Customer, "passwordHash"> & { fullName: string } {
  //   const { passwordHash, ...rest } = this;
  //   return {
  //     ...rest,
  //     fullName: this.fullName,
  //   };
  // }

  // Add other customer-related behaviors here
}
