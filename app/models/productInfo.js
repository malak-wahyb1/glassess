import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productInfoSchema = new mongoose.Schema(
  {
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
    bar_code: {
      type: String,
      required: true,
      unique: true,
    },
    power: {
      type: String,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
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
productInfoSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      docToUpdate.quantity = this._update.quantity; // Update the quantity value from the update operation
      docToUpdate.isStocked = docToUpdate.quantity < 1 ? false : true;
      await docToUpdate.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

productInfoSchema.pre(["find"], function () {
  this.populate("product");
});
productInfoSchema.plugin(mongoosePaginate);

const ProductInfo = mongoose.model("ProductInfo", productInfoSchema);
export default ProductInfo;
