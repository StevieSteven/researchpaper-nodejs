import conn from './../database/connection';
import BaseEntity from './BaseEntity';

class Product extends BaseEntity {
    constructor() {
        super();
        this.tableName = 'products';
    }

}

export default Product;