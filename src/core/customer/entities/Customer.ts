export default class Customer {
  public id: string;
  public email: string;
  public phone: string | undefined;
  public fullName: string;
  public firstName: string;
  public lastName: string;
  public cpf: string;
  public readonly createdAt: Date = new Date();
  // Potentially a reference to the specific entity ID if needed
  // public readonly entityId: string;
  // public readonly entityType: 'advisor' | 'backoffice' | 'domain'; // Adjust roles as needed

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
