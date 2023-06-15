import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const customerSchema = new mongoose.Schema(
  {
    company_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);
customerSchema.plugin(mongoosePaginate);
const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
