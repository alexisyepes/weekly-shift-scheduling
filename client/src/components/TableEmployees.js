import React from "react";
import "./table.css";

const TableEmployees = (props) => {
  const employeesList = props.employees.map((employee) => {
    const mondayLoads = employee.Shifts.filter(
      (shift) =>
        shift.day === "monday" &&
        shift.shiftName !== "Lunch A" &&
        shift.shiftName !== "Lunch B" &&
        shift.shiftName !== "Lunch C" &&
        shift.shiftName !== "Lunch D"
    );
    const tuesdayLoads = employee.Shifts.filter(
      (shift) =>
        shift.day === "tuesday" &&
        shift.shiftName !== "Lunch A" &&
        shift.shiftName !== "Lunch B" &&
        shift.shiftName !== "Lunch C" &&
        shift.shiftName !== "Lunch D"
    );
    const wednesdayLoads = employee.Shifts.filter(
      (shift) =>
        shift.day === "wednesday" &&
        shift.shiftName !== "Lunch A" &&
        shift.shiftName !== "Lunch B" &&
        shift.shiftName !== "Lunch C" &&
        shift.shiftName !== "Lunch D"
    );
    const thursdayLoads = employee.Shifts.filter(
      (shift) =>
        shift.day === "thursday" &&
        shift.shiftName !== "Lunch A" &&
        shift.shiftName !== "Lunch B" &&
        shift.shiftName !== "Lunch C" &&
        shift.shiftName !== "Lunch D"
    );
    const fridayLoads = employee.Shifts.filter(
      (shift) =>
        shift.day === "friday" &&
        shift.shiftName !== "Lunch A" &&
        shift.shiftName !== "Lunch B" &&
        shift.shiftName !== "Lunch C" &&
        shift.shiftName !== "Lunch D"
    );
    const totals =
      mondayLoads.length +
      tuesdayLoads.length +
      wednesdayLoads.length +
      thursdayLoads.length +
      fridayLoads.length;
    return (
      <tr key={employee.id}>
        <td>{employee.employeeName}</td>
        <td>{mondayLoads.length}</td>
        <td>{tuesdayLoads.length}</td>
        <td>{wednesdayLoads.length}</td>
        <td>{thursdayLoads.length}</td>
        <td>{fridayLoads.length}</td>

        <td>{totals}</td>
      </tr>
    );
  });

  return (
    <div>
      <table className="mt-2">
        <tbody>
          <tr>
            <th>Staff Members</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Totals</th>
          </tr>
          {employeesList}
        </tbody>
      </table>
    </div>
  );
};

export default TableEmployees;
