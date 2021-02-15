const express = require("express");
const router = express.Router();
const Shift = require("../models").Shift;

// Create a shift and associate it with an employee
router.post("/add/:employeeId", (req, res) => {
  Shift.create({
    ...req.body,
    EmployeeId: req.params.employeeId,
  })
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/all", (req, res) => {
  Shift.findAll({})
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/one/:id", (req, res) => {
  Shift.findOne({
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

// PUT route for updating shifts
router.put("/:id", function (req, res) {
  Shift.update(
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

// DELETE route for deleting shifts
router.delete("/delete/:id/", function (req, res) {
  Shift.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => res.json(err));
});

// DELETE route for deleting ALL shifts
router.delete("/reset/", function (req, res) {
  Shift.destroy({
    where: {},
  })
    .then((dbShift) => {
      res.json(dbShift);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
