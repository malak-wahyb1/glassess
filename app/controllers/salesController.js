import Sale from "../models/sales.js";

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
export function createSale(req, res, next) {
  const sale = new Sale(req.body);
  sale
    .save()
    .then((response) => {
      res.status(201).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function editSale(req, res, next) {
  const { id } = req.params;
  Sale.findOneAndUpdate({ _id: id }, req.body, { New: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
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
