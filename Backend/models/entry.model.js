"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
var Contact = /** @class */ (function () {
    function Contact(name, street, city, zipCode, state, country, id) {
        this.name = name;
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
        this.state = state;
        this.country = country;
        this.id = id;
    }
    return Contact;
}());
exports.Contact = Contact;
