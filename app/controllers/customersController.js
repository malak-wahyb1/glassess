import Customer from "../models/customer.js";

export function getCustomers(req, res, next) {
    const pageNumber = req.query.page || 1;
    const pageSize = req.query.pageSize || 10;
  Customer.paginate({}, { page: pageNumber, limit: pageSize })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "Customers not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function getCustomer(req, res, next) {
  const { id } = req.params;
  Customer.find({ _id: id })
    .then((response) => {
      if (!response)
        response.status(404).send({ message: "Customer not found" });
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function createCustomer(req, res, next) {
  const customer = new Customer(req.body);
  customer
    .save()
    .then((response) => {
      res.status(201).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function editCustomer(req, res, next) {
  const { id } = req.params;
  Customer.findOneAndUpdate({ _id: id }, req.body, { New: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}

export function deleteCustomer(req, res, next) {
  const { id } = req.params;
  Customer.findOneAndDelete({ _id: id }, { new: true })
    .then((response) => {
      res.status(200).send({ message: response });
    })
    .catch((err) => {
      next(err);
    });
}
export function GetAll(req, res, next) {
  Customer.find({})
  .then((response) => {
    if (!response)
      response.status(404).send({ message: "Customers not found" });
    res.status(200).send({ message: response });
  })
  .catch((err) => {
    next(err);
  }); 
}