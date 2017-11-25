import conn from './../database/connection';
import BaseEntity from './BaseEntity';

class Product extends BaseEntity {
    constructor() {
        super();
        this.tableName = 'products';
    }

    getCategories(id) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM products_categories AS pc
              
                JOIN categories as c ON pc.categories_id = c.id WHERE pc.product_id = ${id}
            `;
            conn.query(query, function (error, results, fields) {
                if (error) throw error;

                resolve(results);
            });
        });
    }
}

export default Product;