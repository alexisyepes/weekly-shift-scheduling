module.exports = function (sequelize, DataTypes) {
  var ShiftsList = sequelize.define("ShiftsList", {
    shiftName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    monday: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tuesday: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    wednesday: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thursday: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    friday: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return ShiftsList;
};
