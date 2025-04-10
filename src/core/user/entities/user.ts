export class User {
  constructor(
    public id: string,
    public email: string,
    public phone: string | undefined,
    public firstName: string,
    public lastName: string,
    public password: string,
    public role: "admin" | "backoffice" | "customer"
  ) {}

  isValidEmail(): boolean {
    return this.email.includes("@");
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // toJSON(): Omit<User, "password"> & { fullName: string } {
  //   const { password, ...rest } = this;
  //   return {
  //     ...rest,
  //     fullName: this.fullName,
  //   };
  // }
}
