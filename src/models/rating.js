import BaseEntity from './BaseEntity';

class Rating extends BaseEntity{
    constructor() {
        super();
        this.tableName = 'ratings';
    }
}
export default Rating;