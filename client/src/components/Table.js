import React, { useState, useEffect } from "react";
import axios from "axios";
import "./table.css";
import TableEmployees from "./TableEmployees";
import Spinner from "./Spinner";

const Index = () => {
  const [employees, setEmployees] = useState([]);
  const [shiftsList, setShiftsList] = useState([]);
  const [showButtonIndex, setShowButtonIndex] = useState("");
  const [hideButtons, setHideButtons] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState("");
  const [shiftId, setShiftId] = useState("");
  const [shiftToBeAdded, setShiftToBeAdded] = useState("");
  const [employeeNameInTable, setEmployeeNameInTable] = useState("");
  // const [morningUS, setMorningUS] = useState(null);
  // const [morningDS, setMorningDS] = useState(null);
  // const [morningPL, setMorningPL] = useState(null);
  // const [lunchA, setLunchA] = useState(null);
  // const [lunchB, setLunchB] = useState(null);
  // const [lunchC, setLunchC] = useState(null);
  // const [lunchD, setLunchD] = useState(null);
  // const [afternoonUS, setAfternoonUS] = useState(null);
  // const [afternoonDS, setAfternoonDS] = useState(null);
  // const [afternoonPL, setAfternoonPL] = useState(null); don't need these states at all

  useEffect(() => {
    fetchInitialData();
    fetchEmployees();
  }, []);

  const fetchInitialData = async () => {
    try {
      fetchShiftsList();
    } catch (error) {
      console.log(error);
    }
  };

  const resetWholeSchedule = async () => {
    const updatedObj = {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
    };
    const shiftRequest1 = axios.put(`/shifts_list/1`, updatedObj);
    const shiftRequest2 = axios.put(`/shifts_list/2`, updatedObj);
    const shiftRequest3 = axios.put(`/shifts_list/3`, updatedObj);
    const shiftRequest4 = axios.put(`/shifts_list/4`, updatedObj);
    const shiftRequest5 = axios.put(`/shifts_list/5`, updatedObj);
    const shiftRequest6 = axios.put(`/shifts_list/6`, updatedObj);
    const shiftRequest7 = axios.put(`/shifts_list/7`, updatedObj);
    const shiftRequest8 = axios.put(`/shifts_list/8`, updatedObj);
    const shiftRequest9 = axios.put(`/shifts_list/9`, updatedObj);
    const shiftRequest10 = axios.put(`/shifts_list/10`, updatedObj);
    const shiftRequestReset = axios.delete(`/shifts/reset`);

    setIsLoading(true);
    await axios
      .all([
        shiftRequest1,
        shiftRequest2,
        shiftRequest3,
        shiftRequest4,
        shiftRequest5,
        shiftRequest6,
        shiftRequest7,
        shiftRequest8,
        shiftRequest9,
        shiftRequest10,
        shiftRequestReset,
      ])
      .then(
        axios.spread(() => {
          console.log("Evrything is empty!");
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        console.log(errors);
        setIsLoading(false);
        // react on errors.
      });

    fetchShiftsList();
    fetchEmployees();
  };

  const fetchEmployees = async () => {
    const employeesResponse = await axios.get("/employees/all");
    setEmployees(employeesResponse.data);
  };

  const fetchShiftsList = async () => {
    const shifstListResponse = await axios.get("/shifts_list/all");
    setShiftsList(shifstListResponse.data);
  };

  const toggleButtons = async (e, day) => {
    e.preventDefault();
    const id = Number(e.target.id);
    setHideButtons(!hideButtons);
    setShowButtonIndex(Number(e.target.id));
    setDay(day);
    setShiftId(id);
    if (!hideButtons)
      await axios.get(`/shifts_list/one/${id}`).then((res) => {
        //find the day that matches the one in database
        const matchDay = Object.keys(res.data).filter((key) => key === day)[0];
        setEmployeeNameInTable(res.data[matchDay]);
        const shiftToBeAdded = res.data.shiftName;
        setShiftToBeAdded(shiftToBeAdded);
      });
  };

  const addShiftToEmployee = async (employeeId, employeeName) => {
    const shiftObj = {
      day: day,
      shiftName: shiftToBeAdded,
    };
    const dayToBeUpdated = {
      [day]: employeeName,
    };

    let shiftIdToDelete;

    if (employeeName !== employeeNameInTable && employeeNameInTable !== null) {
      await axios
        .get(`/employees/find/${employeeNameInTable}`)
        .then(
          (res) =>
            (shiftIdToDelete = res.data.Shifts.filter(
              (shift) => shift.day === day && shift.shiftName === shiftToBeAdded
            )[0].id)
        )
        .catch((err) => console.log(err));
    }

    const updateDatabase = async () => {
      await axios
        .post(`/shifts/add/${employeeId}`, shiftObj)
        .then(async () => {
          await axios
            .put(`/shifts_list/${shiftId}`, dayToBeUpdated)
            .then(() => {
              fetchShiftsList();
              fetchEmployees();
              setHideButtons(false);
              setShowButtonIndex("");
              setDay("");
              setShiftId("");
            });
        })
        .catch((err) => console.log(err));
    };

    await axios
      .get(`/employees/one/${employeeId}`)
      .then(async (res) => {
        //check that the employee has only been set to have lunch once in a day
        const checkForLunch = res.data.Shifts.filter(
          (shift) =>
            (shift.shiftName === "Lunch A" ||
              shift.shiftName === "Lunch B" ||
              shift.shiftName === "Lunch C" ||
              shift.shiftName === "Lunch D") &&
            shift.day === day &&
            (shiftToBeAdded === "Lunch A" ||
              shiftToBeAdded === "Lunch B" ||
              shiftToBeAdded === "Lunch C" ||
              shiftToBeAdded === "Lunch D")
        );

        //Check for the number of shifts in a day
        const checkForShifts = res.data.Shifts.filter(
          (shift) =>
            shift.day === day &&
            (shift.shiftName !== "Lunch A" ||
              shift.shiftName !== "Lunch B" ||
              shift.shiftName !== "Lunch C" ||
              shift.shiftName !== "Lunch D")
        );

        //Check for how many shifts in a week (No lunch included)
        const checkForShiftsInAWeek = res.data.Shifts.filter(
          (shift) =>
            shift.shiftName !== "" &&
            shift.shiftName !== "Lunch A" &&
            shift.shiftName !== "Lunch B" &&
            shift.shiftName !== "Lunch C" &&
            shift.shiftName !== "Lunch D"
        );

        //Check for shifts in a day (No Lunch)
        const checkForShiftsWithNoLunch = res.data.Shifts.filter(
          (shift) =>
            shift.day === day &&
            shift.shiftName !== "" &&
            shift.shiftName !== "Lunch A" &&
            shift.shiftName !== "Lunch B" &&
            shift.shiftName !== "Lunch C" &&
            shift.shiftName !== "Lunch D"
        );

        //Check if employee has been assigned to a shift in one place (Morning)
        const checkForTwoPlacesMorning = res.data.Shifts.filter(
          (shift) => shift.shiftName !== "" && shift.day === day
        ).filter(
          (shift) =>
            (shift.shiftName === "Morning Parking Lot" &&
              (shiftToBeAdded === "Morning Down Stairs" ||
                shiftToBeAdded === "Morning Up Stairs")) ||
            (shift.shiftName === "Morning Down Stairs" &&
              (shiftToBeAdded === "Morning Parking Lot" ||
                shiftToBeAdded === "Morning Up Stairs")) ||
            (shift.shiftName === "Morning Up Stairs" &&
              (shiftToBeAdded === "Morning Parking Lot" ||
                shiftToBeAdded === "Morning Down Stairs"))
        );

        const checkForTwoPlacesAfternoonPL = res.data.Shifts.filter(
          (shift) => shift.shiftName !== "" && shift.day === day
        ).filter(
          (shift) =>
            shift.shiftName === "Afternoon Parking Lot" &&
            (shiftToBeAdded === "Afternoon Down Stairs" ||
              shiftToBeAdded === "Afternoon Up Stairs")
        );
        const checkForTwoPlacesAfternoonUS = res.data.Shifts.filter(
          (shift) => shift.shiftName !== "" && shift.day === day
        ).filter(
          (shift) =>
            shift.shiftName === "Afternoon Up Stairs" &&
            (shiftToBeAdded === "Afternoon Down Stairs" ||
              shiftToBeAdded === "Afternoon Parking Lot")
        );
        const checkForTwoPlacesAfternoonDS = res.data.Shifts.filter(
          (shift) => shift.shiftName !== "" && shift.day === day
        ).filter(
          (shift) =>
            shift.shiftName === "Afternoon Down Stairs" &&
            (shiftToBeAdded === "Afternoon Parking Lot" ||
              shiftToBeAdded === "Afternoon Up Stairs")
        );

        if (
          (shiftToBeAdded === "Lunch A" ||
            shiftToBeAdded === "Lunch B" ||
            shiftToBeAdded === "Lunch C" ||
            shiftToBeAdded === "Lunch D") &&
          checkForShiftsWithNoLunch.length === 0
        ) {
          return alert(
            "You need to assign a shift to a staff member first and then Lunch"
          );
        }

        if (
          checkForTwoPlacesMorning.length > 0 ||
          checkForTwoPlacesAfternoonPL.length > 0 ||
          checkForTwoPlacesAfternoonUS.length > 0 ||
          checkForTwoPlacesAfternoonDS.length > 0
        ) {
          return alert("Staff member cannot be in two places at once!");
        }
        if (checkForShifts.length > 2) {
          return alert(
            "Staff members cannot have more than two shifts per day!"
          );
        }
        if (checkForLunch.length > 0) {
          return alert(
            "Staff member has already been assigned to have lunch on this day!"
          );
        }
        if (checkForShiftsInAWeek.length === 7) {
          return alert(
            "You cannot assign more than 7 shifts to a staff member in a week!"
          );
        }

        if (
          employeeNameInTable !== employeeName &&
          employeeNameInTable !== null
        ) {
          updateDatabase();
          axios
            .delete(`/shifts/delete/${shiftIdToDelete}`)
            .then((res) => console.log(res));
        } else if (employeeNameInTable === null) {
          updateDatabase();
        } else if (employeeNameInTable === employeeName) {
          setHideButtons(false);
          setShowButtonIndex("");
          setDay("");
          setShiftId("");
          return;
        }
      })
      .catch((err) => console.log(err));
  };

  const shifts = shiftsList.map((shift) => {
    return (
      <tr key={shift.id}>
        <td>{shift.shiftName}</td>
        <td>
          <p className="m-0 btn-primary">{shift.monday}</p>
          <button
            className="btn btn-info text-light"
            id={shift.id}
            onClick={(e) => toggleButtons(e, "monday")}
          >
            Set Schedule
          </button>
          <div className="names-main-container">
            {hideButtons && showButtonIndex === shift.id && day === "monday" ? (
              <div className="names-container">
                {employees.map((employee) => {
                  return (
                    <div className="names-container-wrapper" key={employee.id}>
                      <button
                        className="btn-name"
                        onClick={() =>
                          addShiftToEmployee(employee.id, employee.employeeName)
                        }
                      >
                        {employee.employeeName}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </td>
        <td>
          <p className="m-0 btn-primary">{shift.tuesday}</p>
          <button
            className="btn btn-info text-light"
            id={shift.id}
            onClick={(e) => toggleButtons(e, "tuesday")}
          >
            Set Schedule
          </button>
          <div className="names-main-container">
            {hideButtons &&
            showButtonIndex === shift.id &&
            day === "tuesday" ? (
              <div className="names-container">
                {employees.map((employee) => {
                  return (
                    <div className="names-container-wrapper" key={employee.id}>
                      <button
                        className="btn-name"
                        onClick={() =>
                          addShiftToEmployee(employee.id, employee.employeeName)
                        }
                      >
                        {employee.employeeName}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </td>
        <td>
          <p className="m-0 btn-primary">{shift.wednesday}</p>
          <button
            className="btn btn-info text-light"
            id={shift.id}
            onClick={(e) => toggleButtons(e, "wednesday")}
          >
            Set Schedule
          </button>
          <div className="names-main-container">
            {hideButtons &&
            showButtonIndex === shift.id &&
            day === "wednesday" ? (
              <div className="names-container">
                {employees.map((employee) => {
                  return (
                    <div className="names-container-wrapper" key={employee.id}>
                      <button
                        className="btn-name"
                        onClick={() =>
                          addShiftToEmployee(employee.id, employee.employeeName)
                        }
                      >
                        {employee.employeeName}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </td>
        <td>
          <p className="m-0 btn-primary">{shift.thursday}</p>
          <button
            className="btn btn-info text-light"
            id={shift.id}
            onClick={(e) => toggleButtons(e, "thursday")}
          >
            Set Schedule
          </button>
          <div className="names-main-container">
            {hideButtons &&
            showButtonIndex === shift.id &&
            day === "thursday" ? (
              <div className="names-container">
                {employees.map((employee) => {
                  return (
                    <div className="names-container-wrapper" key={employee.id}>
                      <button
                        className="btn-name"
                        onClick={() =>
                          addShiftToEmployee(employee.id, employee.employeeName)
                        }
                      >
                        {employee.employeeName}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </td>
        <td>
          <p className="m-0 btn-primary">{shift.friday}</p>
          <button
            className="btn btn-info text-light"
            id={shift.id}
            onClick={(e) => toggleButtons(e, "friday")}
          >
            Set Schedule
          </button>
          <div className="names-main-container">
            {hideButtons && showButtonIndex === shift.id && day === "friday" ? (
              <div className="names-container">
                {employees.map((employee) => {
                  return (
                    <div className="names-container-wrapper" key={employee.id}>
                      <button
                        className="btn-name"
                        onClick={() =>
                          addShiftToEmployee(employee.id, employee.employeeName)
                        }
                      >
                        {employee.employeeName}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        </td>
      </tr>
    );
  });

  return (
    <Spinner isLoading={isLoading}>
      <div className="waitList-admin-container">
        <h4>
          Schedule by Alex Y. Sanabria{" "}
          <button onClick={resetWholeSchedule} className="btn-danger">
            Reset Schedule
          </button>
        </h4>

        <table>
          <tbody>
            <tr>
              <th>Shift</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
            {shifts}
          </tbody>
        </table>
        <TableEmployees employees={employees} />
      </div>
    </Spinner>
  );
};

export default Index;
