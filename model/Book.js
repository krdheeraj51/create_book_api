// Books [name, image_url, pdf_book, author, pages, price, userId]
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const shortid = require("shortid");
const bookSchema = new Schema({
    id: {
        type: String,
        default: shortid.generate,
    },
    name: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
        // data:Buffer,
        // contentType: String
    },
    pdf_book: {
        type: String,
        // required: true,
    },
    author: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    price: {
        type: Number
    },
    userId: {
        type: String,
        required: true,
    }
}, { timestamps: true }
);
let collectionName = "book";
mongoose.model("books", bookSchema, collectionName);


