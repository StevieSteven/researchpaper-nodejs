/**
 * Created by stephan.strehler on 25.10.2017.
 */
import conn from './../database/connection';

import Customer from './../models/customer';
import Category from './../models/category';
import Address from './../models/address';
import Shoppingcard from './../models/shoppingcard';
import ShoppingcardElement from './../models/shoppingcardElement';
import Order from './../models/order';
import Rating from './../models/rating';
import Product from './../models/product';
import OrderItem from './../models/orderItem';
import OrderStatus from './../models/orderStatus';

let CustomerDB = new Customer();
let CategoryDB = new Category();
let AddressDB = new Address();
let ShoppingcardDB = new Shoppingcard();
let ShoppingcardElementDB = new ShoppingcardElement();
let OrderDB = new Order();
let RatingDB = new Rating();
let ProductDB = new Product();
let OrderItemDB = new OrderItem();
let OrderStatusDB = new OrderStatus();

const userId = 5;
const resolveFunctions = {
        RootQuery: {
            me(_) {
                return CustomerDB.findById(userId);
            },
            Customer(_, {id}) {
                return CustomerDB.findById(id);

            },
            Category(_, {name}) {
                if (!name) {
                    return CategoryDB.findAll();
                }
                return CategoryDB.findAll({where: {name: name}});
            },
            Orders(_, {id}) { //TODO with start and end
                if (!id) {
                    return OrderDB.findAll();
                }
                return OrderDB.findById(id);
            }
        },
        RootMutation: {
            putProductIntoShoppingCard: (root, {productId, count}) => {
                let addFct = (shoppingcard) => {
                    ShoppingcardElementDB.create({
                        shoppingcard_id: shoppingcard.id,
                        quantity: count,
                        product_id: productId
                    })
                };

                return new Promise((resolve, reject) => {
                    ShoppingcardDB.findOne({where: {customer_id: userId}}).then((shoppingcard) => {
                        if (!shoppingcard) {
                            ShoppingcardDB.create({
                                customer_id: userId
                            }).then((data) => {
                                addFct(data);
                                resolve(data)
                            });
                            return;
                        }
                        addFct(shoppingcard);
                        resolve(shoppingcard)

                    });

                });
            },
            finishOrder: (root, {addressId}) => {
                return new Promise((resolve, reject) => {
                    ShoppingcardDB.findOne({where: {customer_id: userId}}).then((shoppingcard) => {
                        ShoppingcardElementDB.findAll({where: {shoppingcard_id: shoppingcard.id}}).then((elements) => {
                            OrderDB.create({
                                address_id: addressId,
                                customer_id: userId,
                                status_id: 1,
                                date: Date.now()
                            }).then((order) => {
                                for (let item of elements) {
                                    OrderItemDB.create({
                                        product_id: item.product_id,
                                        quantity: item.quantity,
                                        order_id: order.id
                                    });
                                    ShoppingcardElementDB.drop(item.id);
                                }
                                ShoppingcardDB.drop(shoppingcard.id).then(() => {
                                    resolve(order);
                                })
                            })
                        });
                    });
                });


                return conn.models.customer.findById(userId).then((customer) => {
                    return customer.getShoppingcard().then((shoppingcard) => {
                        return shoppingcard.getProducts().then((elements) => {
                            conn.models.order.build({
                                customer_id: userId,
                                address_id: addressId,
                                date: Date.now(),
                                status_id: 1
                            }).save().then((order) => {

                                let argArray = [];
                                elements.forEach((item) => {
                                    if (!item.quantity)
                                        item.quantity = 0;
                                    argArray.push({
                                        quantity: item.quantity,
                                        product_id: item.product_id,
                                        order_id: order.id
                                    });
                                });
                                conn.models.orderItem.bulkCreate(argArray).then(() => {
                                    elements.forEach((item) => {
                                        item.destroy();
                                    });
                                    shoppingcard.destroy();
                                    resolve(order);
                                })
                            })
                        })
                    })
                    // });


                });
            },
            addRating: (root, {productId, stars, comment}) => {
                return RatingDB.create({
                    product_id: productId,
                    stars: stars,
                    comment: comment,
                    customer_id: userId
                });
            },
            addProduct: (root, {name, price, description, deliveryTime}) => {
                return ProductDB.create({
                    name: name,
                    delivery_time: deliveryTime,
                    description: description,
                    price: price
                })
            }
        },
        Customer: {
            address: {
                resolve(customer) {
                    return AddressDB.findAll({where: {customer_id: customer.id}});
                }
            }
            ,
            shoppingcard: {
                resolve(customer) {
                    return ShoppingcardDB.findOne({where: {customer_id: customer.id}});
                }
            }
            ,
            orders: {
                resolve(customer) {
                    return OrderDB.findAll({where: {customer_id: customer.id}});
                }
            }
            ,
            ratings: {
                resolve(customer) {
                    return RatingDB.findAll({where: {customer_id: customer.id}});
                }
            }
        }
        ,
        Shoppingcard: {
            customer: {
                resolve(shoppingcard) {
                    return CustomerDB.findById(shoppingcard.customer_id);

                }
            }
            ,
            products: {
                resolve(shoppingcard) {
                    return ShoppingcardElementDB.findAll({where: {shoppingcard_id: shoppingcard.id}})
                }
            }
            ,
        }
        ,
        ShoppingcardElement: {
            product: {
                resolve(shoppingcardelement) {
                    return ProductDB.findById(shoppingcardelement.product_id);
                }
            }
        }
        ,
        Product: {
            ratings: {
                resolve(product) {
                    return RatingDB.findAll({where: {product_id: product.id}});
                }
            }
            ,
            category: {
                resolve(product) {
                    return CategoryDB.findById(product.category_id);
                }
            },
            status: {
                resolve(product) {
                    return "LIEFERBAR";
                }
            }
        }
        ,
        Rating: {
            customer: {
                resolve(rating) {
                    return CustomerDB.findById(rating.customer_id);
                }
            }
            ,
            product: {
                resolve(rating) {
                    return ProductDB.findById(rating.product_id);
                }
            }
        }
        ,
        Category: {
            parent: {
                resolve(category) {
                    return CategoryDB.findById(category.parent_id);
                }
            }
            ,
            products: {
                resolve(category) {
                    return ProductDB.findAll({where: {category_id: category.id}})
                    // return CategoryDB.getProducts(category.id);
                }
            }
        }
        ,
        Order: {
            items: {
                resolve(order) {
                    return OrderItemDB.findAll({where: {order_id: order.id}});
                }
            }
            ,
            customer: {
                resolve(order) {
                    return CustomerDB.findById(order.customer_id)
                }
            }
            ,
            address: {
                resolve(order) {
                    return AddressDB.findById(order.address_id)
                }
            }
            ,
            status: {
                resolve(order) {
                    return OrderStatusDB.findById(order.status_id)
                }
            }
            ,
        }
        ,
        OrderItem: {
            product: {
                resolve(orderitem) {
                    return ProductDB.findById(orderitem.product_id);
                }
            }
        }
    }
;

export default resolveFunctions;