const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://Thiru:Gryffindor7@cluster0.96vb1.mongodb.net/Gig"
);

module.exports = mongoose.connection;
