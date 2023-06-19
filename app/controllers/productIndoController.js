import ProductInfo from "../models/productInfo.js";

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
  ProductInfo.find({ isStocked: false })
    .sort({ created_at: -1 })
    .limit(5)
    .populate('product')
    .exec((err, products) => {
      if (err) {
        console.log("Error retrieving products:", err);
        return next(err);
      }
      res.status(200).send({ message: products });
    });
}

