const mongoose = require("mongoose");
try {
  mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
} catch {
  console.log("error in connecting to db");
}
const db = mongoose.connection;

// db.on('error',console.error.bind(console,"error in connecting to mongodb atlas"));
//nodejs had some update so passing callback func is a nessecity so dont try to remove callback and try to be smart
db.on("error", function () {
  console.log("error in connecting to mongodb");
});

db.once("open", function () {
  console.log("connected to mongodb ");
});

module.exports = db;
