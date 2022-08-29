const appConfig = require("../config/appConfig");
const express = require("express");
const appController = require("../controller/appController");
const { uploadHandler } = require('../utils/multer_config');
let setAppRouter = (app) => {
  let baseUrl = appConfig.apiVersion + "/libraryMagament";
  console.log(baseUrl);
  app.post(baseUrl + '/login', appController.loginUser);
  app.post(baseUrl + "/createUser", appController.createUser);
  app.post(baseUrl + "/addBook/:userId", uploadHandler.fields([
    { name: "image_url", maxCount: 1 }, { name: "pdf_book", maxCount: 1 }]), appController.addBookDetails);
  app.get(baseUrl + "/allUsers", appController.getAllUsers);
  app.get(baseUrl + "/allBooks/pages/:page/limits/:limit", appController.getAllBooks);
  app.get(baseUrl + "/allBooks/:userId/pages/:page/limits/:limit", appController.getBookByUserId);
  app.get(baseUrl + "/getbook/:bookId", appController.getBookById);
  app.put(baseUrl + "/updateBook/:bookId", uploadHandler.fields([
    { name: "image_url", maxCount: 1 }, { name: "pdf_book", maxCount: 1 }]), appController.updateBook);
  app.delete(baseUrl + "/deleteBook/:bookId", appController.deleteBookDetailsOfUser)
  
};

module.exports = {
  setAppRouter,
};
