import ProductInfo from "../models/productInfo.js";
// import csvtojson from 'csvtojson'
export function getProductInfo(req, res, next) {
  const { id } = req.params;
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;
  ProductInfo.paginate({ product: id }, { page: pageNumber, limit: pageSize })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "ProductInfo not found" });
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
  ProductInfo.find({isStocked: true})
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
    .limit(5)
    .then(( products) => {
    
      res.status(200).send({ message: products });
    }).catch((err) => {
      next(err);
    });
}
export const addProductsToBackend = async (req, res) => {
  try {
    const { dataArray ,product} = req.body;

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
    console.error('Error creating products:', error.writeErrors[0].err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// export function insertProduct(req,res,next){
//   csvtojson().fromFile('file.csv').then((data) => {res.send(data)}).catch((err) => {next(err);});
// }
