import conn from './../database/connection';
import BaseEntity from './BaseEntity';

class Category extends BaseEntity{
    constructor() {
        super();
        this.tableName = 'categories';
    }

    getProducts(id) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM products_categories AS pc
                JOIN products as p ON pc.product_id = p.id WHERE pc.categories_id = ${id}
            `;
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });
        });
    }
}
export default Category;