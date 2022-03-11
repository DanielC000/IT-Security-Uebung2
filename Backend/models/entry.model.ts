export class Contact {
    id: string;
    name: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
    state: string;

    constructor(name: string, street: string, city: string, zipCode: string, state: string, country: string, id: string) {
        this.name = name;
        this.street = street;
        this.city = city;
        this.zipCode = zipCode;
        this.state = state;
        this.country = country;
        this.id = id;
    }
}