import { useState } from "react";
import staffData from "../pages/staffs.json";
import "../styles/Staffs.css";

export default function Staff() {

  const [staff, setStaff] =
    useState(staffData);

  

  const updateStatus = (
    id,
    newStatus
  ) => {

    const updatedStaff =
      staff.map((member) =>

        member.staff_id === id

          ? {
              ...member,
              status:newStatus
            }

          : member
      );

    setStaff(updatedStaff);

  };

  return (

    <div className="staff-page">

      <h1 className="staff-title">
        Staff Members
      </h1>

      <div className="staff-container">

        {
          staff.map((member) => (

            <div
              key={member.staff_id}
              className={`staff-card ${
                member.status === "Working"
                ? "working-card"
                : "absent-card"
              }`}
            >

              <h2>
                {member.full_name}
              </h2>

              <p>
                <strong>Role :</strong>
                {" "}
                {member.role}
              </p>

              <p>
                <strong>Shift :</strong>
                {" "}
                {member.shift_time}
              </p>

              <p>
                <strong>Phone :</strong>
                {" "}
                {member.phone}
              </p>

              <p>
                <strong>Salary :</strong>
                {" "}
                ₹{member.salary}
              </p>

              <div
                className={`status-box ${
                  member.status === "Working"
                  ? "green-status"
                  : "red-status"
                }`}
              >

                {
                  member.status === "Working"

                  ? "🟢 Currently Working"

                  : "🔴 Absent Today"
                }

              </div>

              {/* BUTTONS */}

              <div className="staff-buttons">

                <button
                  className="work-btn"
                  onClick={() =>
                    updateStatus(
                      member.staff_id,
                      "Working"
                    )
                  }
                >

                  Working

                </button>

                <button
                  className="absent-btn"
                  onClick={() =>
                    updateStatus(
                      member.staff_id,
                      "Absent"
                    )
                  }
                >

                  Absent

                </button>

              </div>

            </div>

          ))
        }

      </div>

    </div>

  );
}