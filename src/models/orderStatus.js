
import BaseEntity from './BaseEntity';

class OrderStatus extends BaseEntity {
    constructor() {
        super();
        this.tableName = 'order_status';
    }

}

export default OrderStatus;