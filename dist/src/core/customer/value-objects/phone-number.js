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
export class PhoneNumber {
    constructor(value){
        _define_property(this, "value", void 0);
        // Add phone number validation logic here
        this.value = value;
    }
}

//# sourceMappingURL=phone-number.js.map