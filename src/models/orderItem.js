
import BaseEntity from './BaseEntity';

class OrderItem extends BaseEntity {
    constructor() {
        super();
        this.tableName = 'orderitems';
    }

}

export default OrderItem;