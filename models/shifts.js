module.exports = function (sequelize, DataTypes) {
  var Shift = sequelize.define("Shift", {
    shiftName: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    day: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  Shift.associate = function (models) {
    Shift.belongsTo(models.Employee);
  };

  return Shift;
};
