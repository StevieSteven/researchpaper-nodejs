import BaseEntity from './BaseEntity';

class Order extends BaseEntity{
    constructor() {
        super();
        this.tableName = 'orders';
    }
}
export default Order;