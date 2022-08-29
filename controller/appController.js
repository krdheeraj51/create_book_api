const express = require("express");
const appConfig = require("../config/appConfig");
const response = require("../lib/response");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const bcrypt = require('bcrypt');
const userModel = mongoose.model("users");
const saltRounds = 10;
const secretKey = "SomeRandomkey";
const BookModel = mongoose.model("books");
const { uploadFileFilter, storage } = require('../utils/multer_config');
const { countNumberOfPages } = require('../utils/helper')

let loginUser = (req, res) => {
  console.log("req ::", req.body);
  userModel.findOne({
    username: req.body.username
  }).exec((err, user) => {
    console.log("user data  1 ::", user);
    if (err) {
      let apiResponse = response.generate(true, 'Error Occured.', 500, err);

      res.send(apiResponse);
    } else {
      console.log("user data  ::", user);
      bcrypt.compare(req.body.password, user.password)
        .then((result) => {
          if (result == true) {
            console.log("Login successfully done .....");
            jwt.sign({ data: user }, secretKey, (error, token) => {
              if (error) {
                console.log("Something Wrong");
                let apiResponse = response.generate(true, 'Error Occured.', 500, error);
                res.send(apiResponse);
              } else {
                let authToken = { 'authToken': token };
                console.log("authToken ::", authToken)
                let apiResponse = response.generate(false, 'Login successfully done', 200, authToken);
                res.send(apiResponse);
              }
            })
          }
        })
        .catch((error) => {
          console.log("error ::", error)
          console.log("Email or Password is wrong ...");
          let apiResponse = response.generate(true, 'Email or Password is wrong ', 200, error);
          res.send(apiResponse);
        })

    }
  })
}

let createUser = (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    let createNewUser = new userModel({
      name: req.body.name,
      role: req.body.role,
      username: req.body.username,
      // Store hash in your password DB.
      password: hash,
    })
    createNewUser.save().then((result) => {
      let userDetails = { 'userDetails': result };
      let apiResponse = response.generate(false, 'User Account has been created Successfully.', 200, userDetails);
      res.send(apiResponse);
    })
      .catch((err) => {
        console.log("error ::", err);
        console.log("Something going wrong ....");
        let apiResponse = response.generate(true, 'Error Occured', 500, null);
        res.send(apiResponse);

      })
  })
}

let getAllUsers = async (req, res) => {
  try {
    let userDeatils = await userModel.find().exec();
    let apiResponse = response.generate(
      false,
      "All User Deatils are listed.",
      200,
      userDeatils
    );
    res.send(apiResponse);
  } catch (err) {
    let apiResponse = response.generate(true, "Error occured", 500, null);
    res.send(apiResponse);
  }
};

let addBookDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const numberOfpages = await countNumberOfPages(req.files.pdf_book[0].path);
    console.log("numberOfpages ::", numberOfpages);
    let addNewBook = new BookModel({
      name: req.body.name,
      image_url: req.files.image_url[0].path,
      pdf_book: req.files.pdf_book[0].path,
      author: req.body.author,
      pages: numberOfpages,
      price: req.body.price,
      userId: userId,
    });
    let bookDetails = await addNewBook.save();
    let apiResponse = response.generate(
      false,
      "Adding Book Successfully",
      200,
      bookDetails
    );
    res.send(apiResponse);

  } catch (err) {
    let apiResponse = response.generate(
      true,
      "Failed to add Book Details",
      500,
      null
    );
    res.send("Something is missing");

  }
};

let getAllBooks = async (req, res) => {
  try {
    if (req.body.role === 'admin') {
      let page = req.params.page;
      let limit = req.params.limit;
      const firstIndex = (page - 1) * limit
      const lastIndex = page * limit
      const paginatedArticlesList = {}
      if (firstIndex > 0) {
        paginatedArticlesList.previous = {
          previouspage: page - 1,
          limit: limit
        }
      }
      if (lastIndex < await BookModel.countDocuments().exec()) {
        paginatedArticlesList.next = {
          nextpage: page + 1,
          limit: limit
        }
      }

      try {
        paginatedArticlesList.results = await
          BookModel.find().limit(limit).skip(firstIndex).exec();
        console.log("paginatedArticlesList ::", paginatedArticlesList);
        let bookDeatils = paginatedArticlesList.results;
        let apiResponse = response.generate(
          false,
          "All Book Deatils are listed.",
          200,
          bookDeatils
        );
        res.send(apiResponse);
      } catch (e) {
        let apiResponse = response.generate(
          true,
          "Something is missing",
          200,
          null,
        );
        res.send(apiResponse);
      }

    } else {
      let apiResponse = response.generate(
        true,
        "Only Admin user can get all Books Details",
        200,
        null,
      );
      res.send(apiResponse);

    }
  } catch (err) {
    console.log("Error ::", err);
    let apiResponse = response.generate(true, "Error occured", 500, null);
    res.send(apiResponse);
  }
};

let getBookByUserId = async (req, res) => {
  try {
    const { userId,page,limit } = req.params;
    const firstIndex = (page - 1) * limit
    const lastIndex = page * limit
    const paginatedArticlesList = {}
    if (firstIndex > 0) {
      paginatedArticlesList.previous = {
        previouspage: page - 1,
        limit: limit
      }
    }
    if (lastIndex < await BookModel.countDocuments().exec()) {
      paginatedArticlesList.next = {
        nextpage: page + 1,
        limit: limit
      }
    }

    try {
      paginatedArticlesList.results = await
        BookModel.find({userId}).limit(limit).skip(firstIndex).exec();
      let bookDeatils = paginatedArticlesList.results;
      let apiResponse = response.generate(
        false,
        bookDeatils.length ? "All Book Deatils are listed." : "No Book found for this user Id",
        200,
        bookDeatils
      );
      res.send(apiResponse);
    } catch (err) {
      console.log("Error ::", err);
      let apiResponse = response.generate(true, "Error occured", 500, null);
      res.send(apiResponse);
    }
  } catch (err) {
    console.log("Error ::", err);
    let apiResponse = response.generate(true, "Error occured", 500, null);
    res.send(apiResponse);
  }
}

let getBookById = async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log("bookId ::", bookId);
    let bookDeatil = await BookModel.find({ id: bookId }).exec();
    let apiResponse = response.generate(
      false,
      bookDeatil.length ? "Book Deatils are listed." : "No match book found with this Book Id",
      200,
      bookDeatil
    );
    res.send(apiResponse);
  } catch (err) {
    let apiResponse = response.generate(true, "Error occured", 500, null);
    res.send(apiResponse);
  }
}



const updateBook = async (req, res) => {
  try {
    let dataObj = req.body;
    const { bookId } = req.params;
    let update_data = {};
    if (dataObj.name) update_data.name = dataObj.name;
    if (req.files.image_url) update_data.image_url = req.files.image_url[0].path;
    if (req.files.pdf_book) {
      const numberOfpages = await countNumberOfPages(req.files.pdf_book[0].path);
      update_data.pdf_book = req.files.pdf_book[0].path;
      update_data.pages = numberOfpages;
    }
    if (dataObj.author) update_data.author = dataObj.author;
    if (dataObj.price) update_data.price = dataObj.price;
    let userDetail = await userModel.findOne({ id: dataObj.userId });
    if (!userDetail) {
      let apiResponse = response.generate(
        true,
        "User does not exist in database.",
        200,
        null
      );
      res.send(apiResponse);

    }
    let filterParams = {};
    if (userDetail.role === 'admin') {
      filterParams = { id: bookId }
    } else {
      filterParams = { id: bookId, userId: dataObj.userId }
    }
    let updateBookDetails = await BookModel.findOneAndUpdate(filterParams, update_data)
    if (updateBookDetails) {
      let apiResponse = response.generate(
        false,
        "Book Details has been updated Successfully",
        200,
        update_data
      );
      res.send(apiResponse);
    } else {
      let apiResponse = response.generate(
        true,
        "Book Details has not been found",
        200,
        null
      );
      res.send(apiResponse);
    }
  } catch (err) {
    console.log("error ::", err);
    let apiResponse = response.generate(
      true,
      "Failed to update Task Details",
      500,
      null
    );
    res.send("Something is missing");

  }
};

const deleteBookDetailsOfUser = async (req, res) => {
  try {
    let dataObj = req.body;
    const { bookId } = req.params;
    let userDetail = await userModel.findOne({ id: req.body.userId });
    console.log("userDetail ::", userDetail);
    if (!userDetail) {
      let apiResponse = response.generate(
        true,
        "User does not exist in database.",
        200,
        null
      );
      res.send(apiResponse);
    }
    let filterParams = {};
    if (userDetail.role === 'admin') {
      filterParams = { id: bookId }
    } else {
      filterParams = { id: bookId, userId: dataObj.userId }
    }
    console.log("filterParams ::", filterParams);
    let deleteBookDetails = await BookModel.findOneAndDelete(filterParams)
    console.log("deleteBookDetails ::", deleteBookDetails);
    if (deleteBookDetails) {
      let apiResponse = response.generate(
        false,
        "Book has been deleted Successfully",
        200,
        deleteBookDetails
      );
      res.send(apiResponse);
    } else {
      let apiResponse = response.generate(
        true,
        "Something is missing during deleting book details",
        200,
        deleteBookDetails
      );
      res.send(apiResponse);
    }

  } catch (err) {
    let apiResponse = response.generate(
      true,
      "Failed to delete Book Details",
      200,
      null
    );
    res.send(apiResponse);
  }

};
module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  addBookDetails,
  getAllBooks,
  getBookByUserId,
  getBookById,
  updateBook,
  deleteBookDetailsOfUser
};