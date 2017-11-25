import BaseEntity from './BaseEntity';

class Shoppingcard extends BaseEntity{
    constructor() {
        super();
        this.tableName = 'shoppingcards';
    }
}
export default Shoppingcard;