import ProductInfo from "../models/productInfo.js";

export function getProductInfo(req, res, next) {
    const {id}=req.params
  Supplier.find({product:id})
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
  ProductInfo.findByIdAndUpdate({ product: id }, req.body, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function deleteProductInfo(req, res, next) {
  const { id } = req.params;
  ProductInfo.findByIdAndDelete({ product: id }, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
