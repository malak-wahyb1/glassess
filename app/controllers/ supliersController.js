import Supplier from "../models/ suplier.js";

export function getSuppliers(req, res, next) {
    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
    Supplier.paginate({}, { page: pageNumber, limit: pageSize })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "Suppliers not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function getSupplier(req, res, next) {
  const { id } = req.params;
  Supplier.find({ _id: id })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "Supplier not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function createSupplier(req, res, next) {
  const supplier = new Supplier(req.body);
  supplier
    .save()
    .then((response) => {
      res.status(201).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function editSupplier(req, res, next) {
  const { id } = req.params;
  Supplier.findOneAndUpdate({ _id: id }, req.body, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function deleteSupplier(req, res, next) {
  const { id } = req.params;
  Supplier.findOneAndDelete({ _id: id }, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function getLastFiveSuppliers (req, res, next)  {

  Supplier.find({})
    .sort({ created_at: -1 }) // Sort by createdAt field in descending order
    .limit(5).then((response) =>{
      res.status(200).send({ message: response})
    }).catch((error)=>{
 next(error);
})
};