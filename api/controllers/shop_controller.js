'use strict';

var util = require('util')
var model = require('../model/model.js');
const thinkagain = require('thinkagain')();
var r = thinkagain.r;

module.exports = {
	getShops,
	createShop,
	getShop,
	modifyShop,
	createProduct,
	deleteShop,
	modifyProduct,
	deleteProduct
}

function getShops(req, res, next) {
	r.db("ShopProject").table("Shop").run().then(
		function(result) {
			console.log(JSON.stringify(result));
			res.json(result);
		}
	);
}

function createShop(req, res, next) {
	var newShop = {
		name: req.swagger.params.name.value,
		description: req.swagger.params.description.value,
		city: req.swagger.params.city.value,
		address: req.swagger.params.address.value
	};
	r.db("ShopProject").table("Shop").insert(newShop).run().then(
		function(result) {
			r.db("ShopProject").table("Shop").get(result["generated_keys"][0]).merge(function(shop) {
				return {
					'products': r.db("ShopProject").table("Product").filter({idShop: shop('id') }).coerceTo('array')
				};
			})
			.run().then(
				function(result) {
					console.log(JSON.stringify(result));
					res.json(result);
				});
		});
}

function getShop(req, res, next) {
	r.db("ShopProject").table("Shop").get(req.swagger.params.id.value).merge(function(shop) {
		return {
			'products': r.db("ShopProject").table("Product").filter({ idShop: shop('id') }).coerceTo('array')
		};
	})
	.run().then(
		function(result) {
			console.log(JSON.stringify(result));
			res.json(result);
		});
}

function modifyShop(req, res, next) {
	var id = req.swagger.params.id.value;
	var updatedShop = {
		name: req.swagger.params.name.value,
		description: req.swagger.params.description.value,
		city: req.swagger.params.city.value,
		address: req.swagger.params.address.value
	}
	r.db("ShopProject").table("Shop").get(id).update(updatedShop).run().then(
		function(result) {
			r.db("ShopProject").table("Shop").get(id).merge(function(shop) {
				return {
					'products': r.db("ShopProject").table("Product").filter({idShop: shop('id') }).coerceTo('array')
				};
			})
			.run().then(
				function(result) {
					console.log(JSON.stringify(result));
					res.json(result);
				});
		});
}

function createProduct(req, res, next) {
	var shopId = req.swagger.params.id.value;
	var newProduct = {
		name: req.swagger.params.name.value,
		description: req.swagger.params.description.value,
		price: req.swagger.params.price.value,
		count: req.swagger.params.count.value,
		idShop: shopId
	};
	r.db("ShopProject").table("Product").insert(newProduct).run().then(
		function(result) {
			r.db("ShopProject").table("Product").get(shopId).merge(function(shop) {
				return {
					'products': r.db("ShopProject").table("Product").filter({ idShop: shop('id') }).coerceTo('array')
				};
			})
			.run().then(
				function(result) {
					console.log(JSON.stringify(result));
					res.json(result);
				});
		});
}

function deleteShop(req, res, next) {
	var shopId = req.swagger.params.id.value;
	r.db("ShopProject").table("Product").get(shopId).delete({ returnChanges: true }).run().then(
		function(result) {
			try {
				result["changes"].array.forEach(element => {
					r.db("ShopProject").table("Product").filter({ idShop: element["old_val"]["id"] }).delete.run();
				});
			} catch (err) {
				console.log("No products tp delete");
			}
			r.db("ShopProject").table("Shop").run().then(
				function(result) {
					console.log(JSON.stringify(result));
					res.json(result);
				}
			);
		});
}

function modifyProduct(req, res, next) {
	var shopId = req.swagger.params.id.value;
	var productId = req.swagger.params.id.value;
	var updatedProduct = {
		name: req.swagger.params.name.value,
		description: req.swagger.params.description.value,
		price: req.swagger.params.price.value,
		count: req.swagger.params.count.value,
		idShop: shopId
	}
	r.db("ShopProject").table("Product").get(productId).update(updatedProduct).run().then(
		function(result) {
			r.db("ShopProject").table("Shop").get(shopId).merge(function(shop) {
				return {
					'products': r.db("ShopProject").table("Product").filter({idShop: shop('id') }).coerceTo('array')
				};
			})
			.run().then(
				function(result) {
					console.log(JSON.stringify(result));
					res.json(result);
				});
		});
}

function deleteProduct(req, res, next) {
	var shopId = req.swagger.params.id.value;
	var productId = req.swagger.params.id.value;
	r.db("ShopProject").table("Product").get(productId).delete().run().then(
		function(result) {
			r.db("ShopProject").table("Product").get(shopId).merge(function(shop) {
				return {
					'products': r.db("ShopProject").table("Product").filter({ idShop: shop('id') }).coerceTo('array')
				};
			})
			.run().then(
				function(result) {
					console.log(JSON.stringify(result));
					res.json(result);
				});
		});
}