'use strict';

const { Contract } = require('fabric-contract-api');

class Products extends Contract {

    async InitLedger(ctx) {
        const products = [
            { ID: '1', Name: 'Nokia', Type: 'Mobile', Price: 10000, },
            { ID: '2', Name: 'Samsung', Type: 'Tv', Price: 50000, },
            { ID: '1', Name: 'Nike', Type: 'Shoe', Price: 4000, },
        ];

        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState(product.ID, Buffer.from(JSON.stringify(product)));
            console.info(`Product ${product.ID} initialized`);
        }
    }

    // AddProduct issues a new product to the world state with given details.
    async AddProduct(ctx, id, name, type, price) {
        try {
            const product = {
                ID: id,
                Name: name,
                Type: type,
                Price: price,
            };
            await ctx.stub.putState(id, Buffer.from(JSON.stringify(product)));
            var result = {
                Status: 200,
                Message: "Successfully Added product"
            };
            return Buffer.from(JSON.stringify(result), "utf-8");
        } catch (exception) {
            throw new Error("Catch :" + exception);
        }
    }

    // ViewProduct returns the product stored in the world state with given id.
    async ViewProduct(ctx, id) {
            const productJSON = await ctx.stub.getState(id); // get the product from chaincode state
            if (!productJSON || productJSON.length === 0) {
                throw new Error(`The product ${id} does not exist`);
            }
            return productJSON.toString();
    }

    // ProductExists returns true when product with given ID exists in world state.
    async ProductExists(ctx, id) {
        const productJSON = await ctx.stub.getState(id);
        return productJSON && productJSON.length > 0;
    }

    // ViewAllProducts returns all products found in the world state.
    async ViewAllProducts(ctx) {
            const allResults = [];
            // range query with empty string for startKey and endKey does an open-ended query of all products in the chaincode namespace.
            const iterator = await ctx.stub.getStateByRange('', '');
            let result = await iterator.next();
            while (!result.done) {
                const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    console.log(err);
                    record = strValue;
                }
                allResults.push({ Key: result.value.key, Record: record });
                result = await iterator.next();
            }
            return JSON.stringify(allResults);
    }

    // RemoveProduct deletes an given product from the world state.
    async RemoveProduct(ctx, id) {
        try {
                const exists = await this.ProductExists(ctx, id);
                if (!exists) {
                    throw new Error(`The product ${id} does not exist`);
                }
                await ctx.stub.deleteState(id);
                var result = {
                    Status: 200,
                    Message: "Successfully removed product"
                };
                return Buffer.from(JSON.stringify(result), "utf-8");
        } catch (exception) {
            throw new Error("Catch :" + exception);
        }
    }

    // RemoveAllProducts deletes all products found in the world state.
    async RemoveAllProducts(ctx) {
        try {
                const allResults = [];
                // range query with empty string for startKey and endKey does an open-ended query of all products in the chaincode namespace.
                const iterator = await ctx.stub.getStateByRange('', '');
                let result = await iterator.next();
                while (!result.done) {
                    const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                    let record;
                    try {
                        record = JSON.parse(strValue);
                    } catch (err) {
                        console.log(err);
                        record = strValue;
                    }
                    allResults.pop({ Key: result.value.key, Record: record });
                    result = await iterator.next();
                }
                var result1 = {
                    Status: 200,
                    Message: "Successfully removed all products"
                };
                return Buffer.from(JSON.stringify(result1), "utf-8");
        } catch (exception) {
            throw new Error("Catch :" + exception);
        }
    }

}

module.exports = Products;