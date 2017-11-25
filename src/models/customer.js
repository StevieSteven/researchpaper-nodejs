import BaseEntity from './BaseEntity';

class Customer extends BaseEntity{
    constructor() {
        super();
        this.tableName = 'customers';
    }
}
export default Customer;