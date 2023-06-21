import Sale from "../models/sales.js";
import ProductInfo from "../models/productInfo.js";
import Customer from "../models/customer.js";
import Supplier from "../models/ suplier.js";
export function getSales(req, res, next) {
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.pageSize || 8;
  Sale.paginate({}, { page: pageNumber, limit: pageSize })
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
export async function createSale(req, res, next) {
  const sale = new Sale(req.body);

  const products = sale.products;
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
        products[i].product_id = existingProduct._id;
      }
    }
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
export function editSale(req, res, next) {
  const { id } = req.params;
  const { products } = req.body;
  if(req.body.products) {
 
    Sale.findOne({ _id: id }) // Retrieve the existing sale without updating it yet
    .then(async (existingSale) => {
      if (!existingSale) {
        throw new Error("Sale not found: " + id);
      }

      const updatedSale = existingSale;

      for (const product of products) {
        const { barcode, quantity } = product;
        
        const existingProduct = await ProductInfo.findOne({
          bar_code: barcode,
        });

        if (!existingProduct) {
          throw new Error("Product not found: " + barcode);
        }

        const productQuantity = parseInt(existingProduct.quantity);
        const oldQuantity = parseInt(existingSale.products.find((p) => p.barcode === barcode)?.quantity || 0);

        let updatedQuantity;
    
        if (quantity > oldQuantity) {
          updatedQuantity = quantity - oldQuantity;
        } else {
        const  addedQuantity = oldQuantity - quantity;
          product.quantity = quantity;
          const productQuantityNum = parseInt(productQuantity);
          const addedQuantityNum = parseInt(addedQuantity);
          const updatedQuantityTow=productQuantityNum +addedQuantityNum ;
          console.log("updated"+updatedQuantityTow)
          const savedQt=parseInt(updatedQuantityTow)
          await ProductInfo.findOneAndUpdate(
            { bar_code: barcode },
            
            { $set: { quantity: savedQt } }
          );
        }
        if (updatedQuantity > productQuantity) {
          product.quantity = productQuantity;
          await ProductInfo.findOneAndUpdate(
            { bar_code: barcode },
            { $set: { quantity: 0 } }
          );
          updatedSale.products.forEach((saleProduct) => {
            if (saleProduct.barcode === barcode) {
              saleProduct.quantity = productQuantity;
            }
          });
        } else {
          const updatedQuantity1 =productQuantity - updatedQuantity;
          await ProductInfo.findOneAndUpdate(
            { bar_code: barcode },
            { $set: { quantity: updatedQuantity1 } }
          );
        }
      
        updatedSale.products.forEach((saleProduct) => {
          if (saleProduct.barcode === barcode) {
            saleProduct.quantity = product.quantity; // Replace with the new quantity from req.body
          }
        });
      }

      await updatedSale.save();

      res.status(200).send({ message: updatedSale });
    })
    .catch((err) => {
      next(err);
    });
  }else{
   
      Sale.findOneAndUpdate({ _id: id }, req.body, { new: true })
        .then(async (response) => {
          res.status(200).send({ message: response });
        })
        .catch((error) => {
          next(error);
        });
    
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
  const fields = ['created_at', 'created_at', 'created_at'];
  const responses = [];

  const fetchItems = (index) => {
    if (index >= models.length) {
      res.status(200).send({ messages: responses });
      return;
    }

    if (models[index] === ProductInfo) {
      const quantityZeroQuery = { quantity: 0 };
      const quantityLessThanTenQuery = { quantity: { $lt: 10 } };

      Promise.all([
        models[index].find(quantityZeroQuery),
        models[index].find(quantityLessThanTenQuery),
        models[index].find({}).sort({ [fields[index]]: -1 }).limit(5),
      ])
        .then(([zeroResponse, lessThanTenResponse, lastFiveResponse]) => {
          responses.push(zeroResponse);
          responses.push(lessThanTenResponse);
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

