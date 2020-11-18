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
        objKey: {
          type: String,
          unique: true,
        },
        decompressionReq: {
          type: Boolean,
        },
        algorithmUsed: {
          type: String,
        },
        extension: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userLibrary = mongoose.model("userLibrary", ObjectSchema);

module.exports = userLibrary;
