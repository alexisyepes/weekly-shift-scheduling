const express = require("express");
const router = express.Router();
const ShiftsList = require("../models").ShiftsList;

router.post("/add", (req, res) => {
  ShiftsList.create({
    ...req.body,
  })
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/all", (req, res) => {
  ShiftsList.findAll({})
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/one/:id", (req, res) => {
  ShiftsList.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.put("/:id", function (req, res) {
  ShiftsList.update(
    {
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbClient) => {
      res.json(dbClient);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
