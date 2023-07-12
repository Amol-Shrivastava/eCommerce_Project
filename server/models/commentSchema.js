const { mongoose, Schema } = require("mongoose");

const commentsSchema = new Schema(
  {
    product_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
        required: [true, "Product id cannot be null"],
      },
    ],
    description: [
      {
        type: String,
        required: [true, "Comment is compulsory"],
      },
    ],
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Commented by value cannot be null"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentsSchema);
