const dbController = require("../controller/db-controller");
const { 
    validateRequest, 
    addTodoValidation, 
    editTodoValidation, 
    deleteTodoValidation 
} = require("../controller/validation-middleware");

const dbRouter = require("express").Router();

// GET routes
dbRouter.get("/get-todos", dbController.getTodos);
dbRouter.get("/summarise-unfinished-todos", dbController.getUnfinishedTodosSummary);

// POST route for creating new resources
dbRouter.post("/add-todos", validateRequest(addTodoValidation), dbController.addTodo);

// PUT route for updating existing resources
dbRouter.put("/edit-todos", validateRequest(editTodoValidation), dbController.editTodo);

// DELETE route for removing resources
dbRouter.delete("/delete-todos", validateRequest(deleteTodoValidation), dbController.deleteTodo);

module.exports = dbRouter;
