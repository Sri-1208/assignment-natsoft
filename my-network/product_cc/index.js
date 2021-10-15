/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const products= require('./lib/product_cc');

module.exports.Products = products;
module.exports.contracts = [products];
