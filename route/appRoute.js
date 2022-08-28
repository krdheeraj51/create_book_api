const appConfig = require("../config/appConfig");
const express = require("express");
const appController = require("../controller/appController");
let setAppRouter = (app) => {
  let baseUrl = appConfig.apiVersion + "/todoTask";
  console.log(baseUrl);
  app.post(baseUrl + "/createUser", appController.createUser);
  app.post(baseUrl + "/createTask", appController.createTask);
  app.post(baseUrl + "/createSubTask/:taskId", appController.createSubTask);
  app.get(baseUrl + "/getTasks", appController.getAllTasks);
  app.put(baseUrl + "/updateTasks/:taskId", appController.updateTaks);
  app.put(
    baseUrl + "/updateSubTasks/:sub_taskId",
    appController.updateSubTasks
  );
  app.delete(baseUrl + "/deletTask/:taskId", appController.deleteTask);
  app.delete(
    baseUrl + "/deletSubTask/:sub_taskId",
    appController.deleteSubTasks
  );
};

module.exports = {
  setAppRouter,
};
Footer
