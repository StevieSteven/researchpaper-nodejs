import conn from './../database/connection';

class BaseEntity {

    constructor() {

    }

    findById(id) {
        let me = this;
        return new Promise((resolve, reject) => {
            conn.query('SELECT * FROM ' + me.tableName + ' WHERE ID=' + id + ";", function (error, results, fields) {
                if (error) throw error;
                resolve(results[0]);
            });
        });
    }

    findAll(params) {
        let me = this;
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM ' + me.tableName;
            if (params && params.where) {
                let whereStrings = [];
                for (let key in params.where) {
                    whereStrings.push(` ${key} = '${params.where[key]}' `);
                }
                if (whereStrings.length > 0) {
                    query += ' WHERE ';
                    for (let index = 0; index < whereStrings.length - 1; index++) {
                        query += whereStrings[index] + " AND ";
                    }
                    query += whereStrings[whereStrings.length - 1];
                }
            }
            if (params && params.limit) {
                query += ' LIMIT ' + params.limit;
            }

            // console.log("query: ", query);

            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                if (params && params.limit === 1)
                    results = results[0];


                resolve(results);
            });
        });
    }


    findOne(params) {
        if (!params)
            params = {};
        params.limit = 1;
        return this.findAll(params);

    }


    create(data) {
        let me = this;
        if (!data)
            return;
        let keys = [];
        let values = [];
        for (let key in data) {
            keys.push(key);
            values.push(data[key]);
        }
        if (!keys.length === 0)
            return;
        let query = `INSERT INTO ${this.tableName} (`;
        for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++)
            query += `${keys[keyIndex]}, `
        query += `${keys[keys.length - 1]}) VALUES (`;
        for (let keyIndex = 0; keyIndex < keys.length - 1; keyIndex++) {
            let data = values[keyIndex];
            if (data !== parseInt(data, 10))
                data = `'${data}'`;
            query += `${data}, `

        }
        query += `${values[keys.length - 1]}) ;`;

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(me.findById(results.insertId));
            });


        });
    }


    drop(id){
        if(!id)
            return;
        let query = `DELETE FROM ${this.tableName} WHERE ID= ${id}`;

        return new Promise((resolve, reject) => {
            conn.query(query, function (error, results, fields) {
                if (error) throw error;
                resolve(results);
            });


        });

    };
}

export default BaseEntity;