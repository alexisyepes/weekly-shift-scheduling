const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/add", (req, res) => {
  db.Employee.create({
    ...req.body,
  })
    .then((dbEmployee) => {
      res.json(dbEmployee);
    })
    .catch((err) => res.json(err));
});

router.get("/all", (req, res) => {
  db.Employee.findAll({
    include: [db.Shift],
  })
    .then((dbEmployee) => {
      res.json(dbEmployee);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/one/:id", (req, res) => {
  db.Employee.findOne({
    where: {
      id: req.params.id,
    },
    include: [db.Shift],
  })
    .then((dbEmployee) => {
      res.json(dbEmployee);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/find/:name", (req, res) => {
  db.Employee.findOne({
    where: {
      employeeName: req.params.name,
    },
    include: [db.Shift],
  })
    .then((dbEmployee) => {
      res.json(dbEmployee);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/:id", function (req, res) {
  db.Employee.update(
    {
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbEmployee) => {
      res.json(dbEmployee);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
