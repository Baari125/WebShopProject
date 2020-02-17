'use strict';

const thinkagain = require('thinkagain')({
	db: 'ShopProject'
});

let Shop = thinkagain.createModel('Shops', {
	type: 'object',
	properties: {
		id: { type: 'string' },
		name: { type: 'string' },
		description: { type: 'string' },
		city: { type: 'string' },
		address: { type: 'string' }
	},
	required: ['name']
});

let Product = thinkagain.createModel('Products', {
	type: 'object',
	properties: {
		id: { type: 'string' },
		name: { type: 'string' },
		description: { type: 'string' }, 
		price: { type: 'number' },
		count: { type: 'number' }
	},
	required: ['name', 'idShop']
});

Product.belongsTo(Shop, 'shop', 'idShop', 'id');

module.exports = {
	Shop: Shop,
	Product: Product
};
	