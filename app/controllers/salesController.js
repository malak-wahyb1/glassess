import Sale from "../models/sales.js";
import ProductInfo from "../models/productInfo.js";
import Customer from "../models/customer.js";
import Supplier from "../models/ suplier.js";
export function getSales(req, res, next) {
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.pageSize || 8;
  Sale.paginate(
    {},
    { page: pageNumber, limit: pageSize, sort: { updated_at: -1 } }
  )
    .then((response) => {
      if (!response) response.status(404).send({ message: "Sales not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function getSale(req, res, next) {
  const { id } = req.params;
  Sale.find({ _id: id })
    .then((response) => {
      if (!response) response.status(404).send({ message: "Sale not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export async function uncountedSales(req, res, next) {

  const tempProducts = req.body.products;

  // Create a new array to store the consolidated products
  const products = [];
  
  // Create a map to track products by barcode
  const productMap = new Map();
  
  // Iterate over the temporary products array
  for (const tempProduct of tempProducts) {
    const barcode = tempProduct.barcode;
  
    // If the product already exists in the product map, add its quantity and update the selling price
    if (productMap.has(barcode)) {
      const existingProduct = productMap.get(barcode);
      existingProduct.quantity += tempProduct.quantity;
    } else {
      // If the product doesn't exist in the product map, add it
      productMap.set(barcode, tempProduct);
      
    }
  }
  
  // Add the consolidated products from the product map to the products array
  for (const product of productMap.values()) {
    products.push(product);
  }
  
  try {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const existingProduct = await ProductInfo.findOne({
        bar_code: product.barcode,
      });

      if (!existingProduct || existingProduct.quantity === 0) {
        products.splice(i, 1);
        i--;
      } else {
        product.product_power = existingProduct.power;
        products[i].price = existingProduct.selling_price.replace("$", "");
      }
    }
  const sale = new Sale({...req.body,products});

    if (products.length > 0) {
      for (const product of products) {
        const { barcode, quantity } = product;
        const existingProduct = await ProductInfo.findOne({
          bar_code: barcode,
        });

        if (!existingProduct || existingProduct.quantity < quantity) {
          throw new Error("Insufficient quantity for product: " + barcode);
        }

        const updatedQuantity = existingProduct.quantity - quantity;

  
      }
      const customer = await Customer.findOne({ _id: req.body.customer });
      sale.customer = customer.company_name;
      sale
        .save()
        .then((response) => {
          res.status(201).send({ message: response });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      throw new Error("No valid products found");
    }
  } catch (error) {
    next(error);
  }
}
export async function createSale(req, res, next) {

  const tempProducts = req.body.products;

  // Create a new array to store the consolidated products
  const products = [];
  
  // Create a map to track products by barcode
  const productMap = new Map();
  
  // Iterate over the temporary products array
  for (const tempProduct of tempProducts) {
    const barcode = tempProduct.barcode;
  
    // If the product already exists in the product map, add its quantity and update the selling price
    if (productMap.has(barcode)) {
      const existingProduct = productMap.get(barcode);
      existingProduct.quantity += tempProduct.quantity;
    } else {
      // If the product doesn't exist in the product map, add it
      productMap.set(barcode, tempProduct);
      
    }
  }
  
  // Add the consolidated products from the product map to the products array
  for (const product of productMap.values()) {
    products.push(product);
  }
  
  try {
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const existingProduct = await ProductInfo.findOne({
        bar_code: product.barcode,
      });

      if (!existingProduct || existingProduct.quantity === 0) {
        products.splice(i, 1);
        i--;
      } else {
        product.product_power = existingProduct.power;
        products[i].price = existingProduct.selling_price.replace("$", "");
      }
    }
  const sale = new Sale({...req.body,products});

    if (products.length > 0) {
      for (const product of products) {
        const { barcode, quantity } = product;
        const existingProduct = await ProductInfo.findOne({
          bar_code: barcode,
        });

        if (!existingProduct || existingProduct.quantity < quantity) {
          throw new Error("Insufficient quantity for product: " + barcode);
        }

        const updatedQuantity = existingProduct.quantity - quantity;

        await ProductInfo.findOneAndUpdate(
          { bar_code: barcode },
          { $set: { quantity: updatedQuantity } }
        );
      }
      const customer = await Customer.findOne({ _id: req.body.customer });
      sale.customer = customer.company_name;
      sale
        .save()
        .then((response) => {
          res.status(201).send({ message: response });
        })
        .catch((err) => {
          next(err);
        });
    } else {
      throw new Error("No valid products found");
    }
  } catch (error) {
    next(error);
  }
}
export async function editSale(req, res, next) {
  const { id } = req.params;
  const { products } = req.body;
  
  try {
    const sale = await Sale.findById(id);

    if (!sale) {
      throw new Error("Sale not found: " + id);
    }

    for (const product of products) {
      const { barcode, quantity } = product;

      const existingProduct = await ProductInfo.findOne({
        bar_code: barcode,
      });

      if (!existingProduct) {
        throw new Error("Product not found: " + barcode);
      }

      const oldQuantity = parseInt(sale.products.find((p) => p.barcode === barcode)?.quantity || 0);
      const newQuantity = parseInt(quantity);

      const quantityDiff = newQuantity - oldQuantity;

      if (quantityDiff < 0) {
        throw new Error("Invalid quantity update for product: " + barcode);
      }

      const updatedQuantity = existingProduct.quantity - quantityDiff;

      if (updatedQuantity < 0) {
        throw new Error("Insufficient quantity for product: " + barcode);
      }

      await ProductInfo.findOneAndUpdate(
        { bar_code: barcode },
        { $set: { quantity: updatedQuantity } }
      );
    } 
    const updatedSale =await  Sale.findByIdAndUpdate(id,{products},{new:true})
    console.log(updatedSale)

    res.status(200).send({ message: "Sale updated successfully" ,sale:updatedSale});
  } catch (error) {
    next(error);
  }
}


export function deleteSale(req, res, next) {
  const { id } = req.params;
  Sale.findOneAndDelete({ _id: id }, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function getLastFiveItems(req, res, next) {
  const models = [ProductInfo, Customer, Supplier];
  const fields = ["created_at", "created_at", "created_at"];
  const responses = [];

  const fetchItems = (index) => {
    if (index >= models.length) {
      res.status(200).send({ messages: responses });
      return;
    }

    if (models[index] === ProductInfo) {
      const quantityZeroQuery = { quantity: 0 };
   

      Promise.all([
        models[index].find(quantityZeroQuery),
        models[index]
          .find({})
          .sort({ [fields[index]]: -1 })
          .limit(5),
      ])
        .then(([zeroResponse, lastFiveResponse]) => {
          responses.push(zeroResponse);
          responses.push(lastFiveResponse);
          fetchItems(index + 1);
        })
        .catch((error) => {
          next(error);
        });
    } else {
      models[index]
        .find({})
        .sort({ [fields[index]]: -1 })
        .limit(5)
        .then((response) => {
          responses.push(response);
          fetchItems(index + 1);
        })
        .catch((error) => {
          next(error);
        });
    }
  };

  fetchItems(0);
}
