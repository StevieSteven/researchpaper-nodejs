const typeDefinitions = `
type Address {
	id: ID!
	street: String!
	number: String!
	city: String!
	postalCode: String!
}

type Category {
	id: ID!
	name: String!
	parent: Category
	products: [Product!]
}

type Customer {
	id: ID!
	prename: String!
	surname: String!
	email: String!
	address: [Address!]
	shoppingcard: Shoppingcard
	orders: [Order]
	ratings: [Rating]
}

type Order {
	id: ID!
	items: [OrderItem]
	date: String!
	customer: Customer!
	status: OrderStatus!
	address: Address!
}

type OrderItem {
	id: ID!
	quantity: Int!
	product: Product!
}

type OrderStatus {
	id: ID!
	message: String!
}

type Product {
	id: ID!
	name: String!
	price: Float!
	deliveryTime: Int
	ratings: [Rating]
	description: String
	categories: [Category]!
}

type Rating {
	id: ID!
	stars: Int!
	comment: String!
	customer: Customer!
	product: Product!
}

type Shoppingcard {
	id: ID!
	customer: Customer!
	products: [ShoppingcardElement]
}

type ShoppingcardElement {
	id: ID!
	product: Product!
	quantity: Int!
}


# the schema allows the following queries:
type RootQuery {
    Customer(id: ID!): Customer
    me: Customer
    Category(name: String): [Category]
    Orders(start: String, end: String): [Order]
}


# this schema allows the following two mutations:
type RootMutation {
    putProductIntoShoppingCard(
        productId: ID!
        count: Int!): Shoppingcard
        
    finishOrder(addressId: ID!): Order
    
    addRating(
        productId: ID!
        stars: Int!
        comment: String
    ):Rating   
    
    addProduct(
        name: String!
        price: Float!
        description: String
        deliveryTime: Int
    ):Product

}
# we need to tell the server which types represent the root query
# and root mutation types. We call them RootQuery and RootMutation by convention.
schema {
    query: RootQuery
    mutation: RootMutation
}
`;
export default [typeDefinitions];