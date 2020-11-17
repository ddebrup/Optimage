const mongoose = require("mongoose");
const ObjectSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    objectKeys: [
      {
        keyValue: {
          type: String,
          unique: true,
        },
        dim_val: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userObjectsInS3 = mongoose.model("userObjectsInS3Huffman", ObjectSchema);

module.exports = userObjectsInS3;
