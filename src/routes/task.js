const express = require("express");
const Checklist = require("../models/checklist");
const Task = require("../models/task");

const checklistDependentRoute = express.Router();
const simpleRoute = express.Router();

//Rotas GET
checklistDependentRoute.get("/:id/tasks/new", async (req, res) => {
  //Criar nova task
  try {
    let task = new Task();
    res
      .status(200)
      .render("tasks/new", { checklistId: req.params.id, task: task });
  } catch (er) {
    res
      .status(422)
      .render("pages/error", { error: "Erro ao carregar formulário" });
  }
});

//Rotas POST
checklistDependentRoute.post("/:id/tasks", async (req, res) => {
  let { name } = req.body.task;
  let task = new Task({ name, checklist: req.params.id });

  try {
    await task.save();
    let checklist = await Checklist.findById(req.params.id);
    checklist.tasks.push(task);
    await checklist.save();
    res.redirect(`/checklists/${req.params.id}`);
  } catch (er) {
    res.status(422).render("tasks/new", {
      task: { ...task, er },
      checklistId: req.params.id,
    });
  }
});

//Rotas PUT
simpleRoute.put("/:id", async (req, res) => {
  let task = await Task.findById(req.params.id);
  try {
    task.set(req.body.task);
    await task.save();
    res.status(200).json({ task });
  } catch (er) {
    let error = er.errors;
    res.status(422).json({ task: { ...error } });
  }
});

//Rotas DELETE
simpleRoute.delete("/:id", async (req, res) => {
  try {
    let task = await Task.findByIdAndDelete(req.params.id);
    let checklist = await Checklist.findById(task.checklist);
    let taskToRemove = checklist.tasks.indexOf(req.params.id);
    checklist.tasks.slice(taskToRemove, 1);
    checklist.save();
    res.redirect(`/checklists/${checklist._id}`);
  } catch (er) {
    res.status(422).render("pages/error", { error: "Erro ao remover task" });
  }
});

module.exports = {
  checklistDependent: checklistDependentRoute,
  simple: simpleRoute,
};
