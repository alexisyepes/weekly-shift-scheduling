module.exports = function (sequelize, DataTypes) {
  var Employee = sequelize.define("Employee", {
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Employee.associate = function (models) {
    Employee.hasMany(models.Shift);
  };

  return Employee;
};
