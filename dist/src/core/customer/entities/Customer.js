function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
class Customer {
    isValidEmail() {
        return this.email.includes("@");
    }
    // Potentially a reference to the specific entity ID if needed
    // public readonly entityId: string;
    // public readonly entityType: 'advisor' | 'backoffice' | 'domain'; // Adjust roles as needed
    constructor(data){
        _define_property(this, "id", void 0);
        _define_property(this, "email", void 0);
        _define_property(this, "phone", void 0);
        _define_property(this, "fullName", void 0);
        _define_property(this, "firstName", void 0);
        _define_property(this, "lastName", void 0);
        _define_property(this, "cpf", void 0);
        _define_property(this, "createdAt", new Date());
        this.id = data.id;
        this.email = data.email;
        this.phone = data.phone;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.fullName = `${data.firstName} ${data.lastName}`;
        this.cpf = data.cpf;
    }
}
export { Customer as default };

//# sourceMappingURL=Customer.js.map