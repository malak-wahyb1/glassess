import ProductInfo from "../models/productInfo.js";
// import csvtojson from 'csvtojson'
export function getProductInfo(req, res, next) {
  const { query } = req.query;
  const { id } = req.params;
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

  let queryCondition = { product: id };

  if (query && query !== "") {
    // If the 'query' parameter is provided, search for the 'power' field containing the query
    queryCondition.power = { $regex: query, $options: "i" }; // 'i' for case-insensitive search
  }
  console.log(queryCondition);
  ProductInfo.paginate(queryCondition, { page: pageNumber, limit: pageSize })
    .then((response) => {
      // console.log(response)
      if (!response || response.total === 0) {
        return res.status(404).send({ message: "ProductInfo not found" });
      }
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function createProductInfo(req, res, next) {
  const supplier = new ProductInfo(req.body);
  supplier
    .save()
    .then((response) => {
      res.status(201).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function editProductInfo(req, res, next) {
  const { id } = req.params;
  ProductInfo.findByIdAndUpdate({ _id: id }, req.body, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function deleteProductInfo(req, res, next) {
  const { id } = req.params;
  ProductInfo.findByIdAndDelete({ _id: id }, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function getProductsInfo(req, res, next) {
  ProductInfo.find({ isStocked: true })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "ProductInfo not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function getLastFiveOutOfStockProducts(req, res, next) {
  ProductInfo.find({ quantity: 0 })
    .sort({ created_at: -1 })
    .then((products) => {
      res.status(200).send({ message: products });
    })
    .catch((err) => {
      next(err);
    });
}
export const addProductsToBackend = async (req, res) => {
  try {
    const { dataArray, product } = req.body;

    const products = dataArray.map(({ power, barcode }) => ({
      selling_price: "", // Add your desired selling_price value
      buying_price: "", // Add your desired buying_price value
      quantity: 0, // Add your desired quantity value
      isStocked: true, // Add your desired isStocked value
      bar_code: barcode,
      power,
      product: product, // Add your desired product reference value
    }));

    const createdProducts = await ProductInfo.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (error) {
    console.error("Error creating products:", error.writeErrors[0].err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// export function insertProduct(req,res,next){
//   csvtojson().fromFile('file.csv').then((data) => {res.send(data)}).catch((err) => {next(err);});
// }
export async function updateProductInfos(req, res) {
  try {
    const { quantity, product } = req.body; // Assuming the array of productInfo objects is in the request body

    const updateOperations = quantity.map(async (productInfo) => {
      const { power, quantity, price } = productInfo;

      // Construct the update object
      const update = {
        quantity,
        selling_price: price,
        isStocked: quantity < 1 ? false : true,
      };

      // Update the productInfo document
      const updatedProductInfo = await ProductInfo.findOneAndUpdate(
        { power, product }, // Assuming power is unique for each productInfo
        update,
        { new: true } // Return the updated document
      );

      return updatedProductInfo;
    });

    const updatedProductInfos = await Promise.all(updateOperations);

    res.json(updatedProductInfos);
    // res.json(quantity)
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating productInfos." });
  }
}
