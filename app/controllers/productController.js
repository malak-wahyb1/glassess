import Product from "../models/product.js";

export function getProducts(req, res, next) {
    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    Product.paginate({}, { page: pageNumber, limit: pageSize })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "Products not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function getProduct(req, res, next) {
  const { id } = req.params;
  Product.find({ _id: id })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "Product not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function createProduct(req, res, next) {
  const product = new Product(req.body);
  product
    .save()
    .then((response) => {
      res.status(201).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function editProduct(req, res, next) {
  const { id } = req.params;
  Product.findOneAndUpdate({ _id: id }, req.body, { New: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function deleteProduct(req, res, next) {
  const { id } = req.params;
  Product.findOneAndDelete({ _id: id }, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
