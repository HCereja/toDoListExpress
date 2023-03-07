const express = require("express");
const Checklist = require("../models/checklist");

const router = express.Router();

//Rotas GET
router.get("/", async (req, res) => {
  //Página inicial
  try {
    let checklists = await Checklist.find({});
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (er) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir as listas" });
  }
});

router.get("/new", async (req, res) => {
  //Adicionar nova checklist
  try {
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (er) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao carregar o formulário" });
  }
});

router.get("/:id/edit", async (req, res) => {
  //Editar checklist
  try {
    let checklist = await Checklist.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (er) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir página de edição" });
  }
});

router.get("/:id", async (req, res) => {
  //Página da checklist
  try {
    let checklist = await Checklist.findById(req.params.id).populate("tasks");
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (er) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir as listas" });
  }
});

//Rotas POST
router.post("/", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = new Checklist({ name });

  try {
    await checklist.save();
    res.redirect("/checklists");
  } catch (er) {
    res
      .status(500)
      .render("checklists/new", { checklist: { ...checklist, er } });
  }
});

//Rotas PUT
router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = await Checklist.findById(req.params.id);

  try {
    await checklist.updateOne({ name });
    res.redirect("/checklists");
  } catch (er) {
    res
      .status(422)
      .render("checklists/edit", { checklist: { ...checklist, er } });
  }
});

//Rotas DELETE
router.delete("/:id", async (req, res) => {
  try {
    /*let checklist = */ await Checklist.findByIdAndRemove(req.params.id);
    res.redirect("/checklists");
  } catch (er) {
    res.status(422).render("pages/error", { error: "Erro ao deletar a lista" });
  }
});

module.exports = router;
