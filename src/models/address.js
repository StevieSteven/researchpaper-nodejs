import BaseEntity from './BaseEntity';

class Address extends BaseEntity{
    constructor() {
        super();
        this.tableName = 'addresses';
    }
}
export default Address;