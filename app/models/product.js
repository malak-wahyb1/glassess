import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    bar_code: {
      type: String,
      required: true,
      unique: true,
    },
    diameter: {
      type: String,
    },
    power: {
      type: String,
    },
    selling_price: {
      type: String,
    },
    buying_price: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    isStocked: {
      type: Boolean,
      default: true,
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
productSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate && docToUpdate.quantity === 1) {
      docToUpdate.isStocked = false;
      await docToUpdate.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});
productSchema.plugin(mongoosePaginate);
const Product = mongoose.model("Product", productSchema);
export default Product;
