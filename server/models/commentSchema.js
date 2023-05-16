const { mongoose, Schema } = require("mongoose");

const commentsSchema = new Schema(
  {
    product_id: [
      {
        type: Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
    description: [
      {
        type: String,
        required: [true, "Comment is compulsory"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comments", commentsSchema);
