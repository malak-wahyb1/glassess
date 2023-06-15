import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
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
supplierSchema.plugin(mongoosePaginate);
const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;
