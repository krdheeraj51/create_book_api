const express = require("express");
const appConfig = require("../config/appConfig");
const response = require("../lib/response");
const mongoose = require("mongoose");
const userModel = mongoose.model("users");
const taskModel = mongoose.model("tasks");
const subTaskModel = mongoose.model("sub_tasks");
let createUser = (req, res) => {
  let createNewUser = new userModel({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    user_type: req.body.user_type,
  });
  createNewUser
    .save()
    .then((result) => {
      let userDetails = { userDetails: result };
      let apiResponse = response.generate(
        false,
        "User Account has been created Successfully.",
        200,
        userDetails
      );
      res.send(apiResponse);
    })
    .catch((err) => {
      console.log("Something going wrong ....");
      let apiResponse = response.generate(true, "Error Occured", 500, null);
      res.send(apiResponse);
    });
};

let createTask = (req, res) => {
  if (req.body.user_type === 1) {
    let addNewTask = new taskModel({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });
    addNewTask.save((err, taskDetails) => {
      if (err) {
        let apiResponse = response.generate(
          true,
          "Failed to add Task Details",
          500,
          null
        );
        res.send("Something is missing");
      } else {
        let apiResponse = response.generate(
          false,
          "Adding Task Successfully",
          200,
          taskDetails
        );
        res.send(apiResponse);
      }
    });
  } else {
    let apiResponse = response.generate(
      true,
      "Only Admin can add Tasks",
      500,
      null
    );
    res.send(apiResponse);
  }
};

let createSubTask = (req, res) => {
  if (req.body.user_type === 1) {
    let addNewSubTask = new subTaskModel({
      title: req.body.title,
      status: req.body.status,
      taskId: req.params.taskId,
    });
    addNewSubTask.save((err, subTaskDetails) => {
      if (err) {
        let apiResponse = response.generate(
          true,
          "Failed to add Sub Task Details",
          500,
          null
        );
        res.send(apiResponse);
      } else {
        let apiResponse = response.generate(
          false,
          "Adding sub Task Successfully",
          200,
          subTaskDetails
        );
        res.send(apiResponse);
      }
    });
  } else {
    let apiResponse = response.generate(
      true,
      "Only Admin can add Tasks",
      500,
      null
    );
    res.send(apiResponse);
  }
};

const updateTaks = (req, res) => {
  if (req.body.user_type === 1) {
    let dataObj = req.body;
    const { taskId } = req.params;
    let update_data = {};
    if (dataObj.title) update_data.title = dataObj.title;
    if (dataObj.description) update_data.description = dataObj.description;
    if (dataObj.status) update_data.status = dataObj.status;
    taskModel.findOneAndUpdate(
      { id: taskId },
      update_data,
      function (err, updatedTask) {
        if (err) {
          let apiResponse = response.generate(
            true,
            "Failed to update Task Details",
            500,
            null
          );
          res.send("Something is missing");
        } else {
          let apiResponse = response.generate(
            false,
            "Task has been updated Successfully",
            200,
            update_data
          );
          res.send(apiResponse);
        }
      }
    );
  } else {
    let apiResponse = response.generate(
      true,
      "Only Admin can update Tasks",
      500,
      null
    );
    res.send(apiResponse);
  }
};

const updateSubTasks = (req, res) => {
  if (req.body.user_type === 1) {
    let dataObj = req.body;
    const { sub_taskId } = req.params;
    let update_data = {};
    if (dataObj.title) update_data.title = dataObj.title;
    if (dataObj.status) update_data.status = dataObj.status;
    subTaskModel.findOneAndUpdate(
      { id: sub_taskId },
      update_data,
      function (err, updatedTask) {
        if (err) {
          let apiResponse = response.generate(
            true,
            "Failed to update Sub Task Details",
            500,
            null
          );
          res.send("Something is missing");
        } else {
          let apiResponse = response.generate(
            false,
            "Sub Task has been updated Successfully",
            200,
            update_data
          );
          res.send(apiResponse);
        }
      }
    );
  } else {
    let apiResponse = response.generate(
      true,
      "Only Admin can update Sub Tasks",
      500,
      null
    );
    res.send(apiResponse);
  }
};

const deleteTask = (req, res) => {
  if (req.body.user_type === 1) {
    const { taskId } = req.params;
    taskModel.findOneAndDelete({ id: taskId }, (err, dataInfo) => {
      console.log("dataInfo ::", dataInfo);
      if (err) {
        let apiResponse = response.generate(
          true,
          "Failed to delete Task Details",
          500,
          null
        );
        res.send("Something is missing");
      } else {
        console.log("dataInfo ::", dataInfo);
        subTaskModel.find({ taskId: taskId }).deleteMany().exec();
        let apiResponse = response.generate(
          false,
          "Task has been deleted Successfully",
          200,
          dataInfo
        );
        res.send(apiResponse);
      }
    });
  } else {
    let apiResponse = response.generate(
      true,
      "Only Admin can delete Tasks",
      500,
      null
    );
    res.send(apiResponse);
  }
};

const deleteSubTasks = (req, res) => {
  if (req.body.user_type === 1) {
    const { sub_taskId } = req.params;
    subTaskModel.findOneAndDelete({ id: sub_taskId }, (err, dataInfo) => {
      if (err) {
        let apiResponse = response.generate(
          true,
          "Failed to delete Sub Task Details",
          500,
          null
        );
        res.send("Something is missing");
      } else {
        let apiResponse = response.generate(
          false,
          "Sub Task has been deleted Successfully",
          200,
          dataInfo
        );
        res.send(apiResponse);
      }
    });
  } else {
    let apiResponse = response.generate(
      true,
      "Only Admin can delete Sub Tasks",
      500,
      null
    );
    res.send(apiResponse);
  }
};

let getAllTasks = async (req, res) => {
  try {
    let task_subTask = await taskModel.aggregate([
      {
        $lookup: {
          from: "sub_task",
          localField: "id",
          foreignField: "taskId",
          as: "sub_tasks",
        },
      },
    ]);
    let apiResponse = response.generate(
      false,
      "All Tasks and sub tasks are listed.",
      200,
      task_subTask
    );
    res.send(apiResponse);
  } catch (err) {
    let apiResponse = response.generate(true, "Error occured", 500, null);
    res.send(apiResponse);
  }
};
module.exports = {
  createUser,
  createTask,
  createSubTask,
  getAllTasks,
  updateTaks,
  updateSubTasks,
  deleteTask,
  deleteSubTasks,
};