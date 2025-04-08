export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string
  ) {}

  isValidEmail(): boolean {
    return this.email.includes("@");
  }
}
