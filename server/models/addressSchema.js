const { mongoose, Schema } = require("mongoose");

const addressSchema = new Schema(
  {
    street: {
      type: String,
      required: [true, "Street is compulsory"],
      maxLength: [32, "Street string cannot be more than 32 characters"],
    },
    houseNumber: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: [true, "City cannot be blank"],
    },
    state: {
      type: String,
      required: [true, "City cannot be blank"],
    },
    pincode: {
      type: String,
      required: [true, "Pincode cannot be blank"],
    },
    belongsTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
