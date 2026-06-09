import React from "react";
import "../Styles/IncidentReport.css";
import Header from "../Components/Header";

const IncidentReport: React.FC = () => {
  return (
    <>
    <Header/>
     <div className="main_box">
      <div
        style={{
          textAlign: "center",
          marginBottom: "18px",
          position: "relative",
        }}
      >
        <div style={{ fontSize: "18px" }}>Encore Hospitality, LLC</div>
        <div style={{ fontSize: "18px" }}>{"propertyName"}</div>
        <div style={{ fontSize: "18px" }}>{"propertyAddress"}</div>

        <div style={{ fontSize: "18px", fontWeight: "bold", margin: "4px 0" }}>
          INCIDENT/ACCIDENT REPORT
        </div>
        <div style={{ fontSize: "13px", color: "#444" }}>
          (Please Complete All Applicable Sections)
        </div>
        <div
          style={{
            display: "flex",
            gap: "0px",
            position: "absolute",
            top: "0",
            right: "0",
            bottom: "0",
          }}
        >
          {"propertyMarshaCodeArray"}
          <input
            type="text"
            // maxlength="1"
            className="focus-none no-spinner"
            style={{
              width: "30px",
              height: "20px",
              border: "1px solid",
              textAlign: "center",
            }}
            value="{{.}}"
          />
          {/* {"/propertyMarshaCodeArray"} */}
        </div>
      </div>

      {/* <!-- Main Table --> */}
      <table
        border={1}
        cellSpacing={0}
        cellPadding={2}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        <tbody>
          <tr>
            <td style={{ width: "25%" }}>
              Type of Incident <br />
              <input type="text" className="underline-input w-full" />
            </td>
            <td style={{ width: "25%" }} colSpan={2}>
              Location of Hotel <br />
              <input type="text" className="underline-input w-full" />
            </td>
            <td style={{ width: "50%" }} colSpan={2}>
              <div style={{ display: "flex" }}>
                Date Reported:
                <input
                  type="date"
                  className="underline-input"
                  style={{ width: "120px" }}
                />
              </div>
              <br />
              <div style={{ display: "flex" }}>
                Date/Time of Incident:
                <input
                  type="datetime-local"
                  className="underline-input"
                  style={{ width: "fit-content" }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={4} className="illness-label">
              <input
                type="radio"
                name="guest_select"
                style={{ cursor: "pointer" }}
              />
              GUEST <br />
              <input
                type="radio"
                name="guest_select"
                style={{ cursor: "pointer" }}
              />
              NON-GUEST
              <br />
              <input
                type="radio"
                name="guest_select"
                style={{ cursor: "pointer" }}
              />
              EMPLOYEE
              <br />
            </td>
            <td>
              Name <span className="label-small">(Print, Middle, Last)</span>
              <br />
              <input type="text" className="underline-input w-full" />
            </td>
            <td>
              Address: <input type="text" className="underline-input w-full" />
            </td>
          </tr>
          <tr>
            <td style={{ verticalAlign: "top", width: "300px" }}>
              Race: <input type="text" className="underline-input long" />
              <br />
              <div style={{ marginTop: "4px" }}>
                Sex:
                <input
                  type="radio"
                  name="gender"
                  style={{ cursor: "pointer" }}
                />
                Male
                <input
                  type="radio"
                  name="gender"
                  style={{ cursor: "pointer" }}
                />
                Female
                <br />
              </div>
              Date of Birth:
              <input
                placeholder="MM/DD/YYYY"
                type="date"
                className="underline-input"
                style={{ width: "140px" }}
              />
            </td>
            <td colSpan={3} style={{ verticalAlign: "top" }}>
              Phone: (H) <input type="text" className="underline-input long" />
              <br /> (W) <input type="text" className="underline-input long" />
              <br />
              <div className="flex-center">
                Room Number:
                <input type="text" className="underline-input long" />
              </div>
            </td>
          </tr>
          <tr>
            <td>
              Check In Date:
              <input
                type="date"
                className="underline-input"
                style={{ width: "140px;" }}
              />
              <br />
              Check Out Date:
              <input
                type="date"
                className="underline-input"
                style={{ width: "140px;" }}
              />
            </td>
            <td colSpan={3} style={{ verticalAlign: "top" }}>
              <span className="purpose-label">Purpose in Hotel:</span>
              <br />
              <input type="text" className="underline-input w-full" />
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="attitude-label">
              Attitude:
              <div
                style={{ display: "flex", gap: "3px", alignItems: "center" }}
              >
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="attitude"
                />
                Calm
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="attitude"
                />
                Abusive
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="attitude"
                />
                Defensive
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="attitude"
                />
                Will File Claim{" "}
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="attitude"
                />
                Other <input type="text" className="underline-input " />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        <tbody>
          <tr>
            <td className="illness-label">REPORTED BY</td>
            <td>
              Name: <input type="text" className="underline-input w-full" />
            </td>
            <td>
              Address: <input type="text" className="underline-input w-full" />
            </td>
            <td>
              Phone: (H) <input type="text" className="underline-input long" />{" "}
              <br />
              (W) <input type="text" className="underline-input long" />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={3} className="illness-label">
              WITNESSES
            </td>
            <td>Name</td>
            <td>Address:</td>
            <td colSpan={2}>Phone:</td>
          </tr>
          <tr>
            <td>
              <input type="text" className="underline-input w-full" />
            </td>
            <td>
              <input type="text" className="underline-input w-full" />
            </td>
            <td colSpan={2}>
              <input type="text" className="underline-input w-full" />
            </td>
          </tr>
          <tr>
            <td>
              <input type="text" className="underline-input w-full" />
            </td>
            <td>
              <input type="text" className="underline-input w-full" />
            </td>
            <td colSpan={2}>
              <input type="text" className="underline-input w-full" />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={10} className="illness-label">
              INJURY/
              <br />
              ILLNESS
              <br />
              <img
                className="body-img"
                src="https://api.datarover.us/core/file/view/1753426555836_1331_Incident%20Accident%20Report-Body%20Image.png"
                alt="body"
                width="60"
              />
              <br />
              <span className="illness-note">
                Mark Injured Area
                <br />
                With an X
              </span>
            </td>
            <td colSpan={5}>
              Degree of Injury:
              <input
                type="radio"
                name="degreeOfInjury"
                style={{ cursor: "pointer" }}
              />
              No Visible Injury{" "}
              <input
                type="radio"
                name="degreeOfInjury"
                style={{ cursor: "pointer" }}
              />{" "}
              Bruises{" "}
              <input
                type="radio"
                name="degreeOfInjury"
                style={{ cursor: "pointer" }}
              />{" "}
              Abrasions{" "}
              <input
                type="radio"
                name="degreeOfInjury"
                style={{ cursor: "pointer" }}
              />{" "}
              Swelling
              <input
                type="radio"
                name="degreeOfInjury"
                style={{ cursor: "pointer" }}
              />
              Bleeding{" "}
            </td>
          </tr>
          <tr>
            <td colSpan={5}>
              Apparent Cause:{" "}
              <input type="text" className="underline-input long" />
              <input
                type="radio"
                name="apparenCause"
                style={{ cursor: "pointer" }}
              />
              Admitted to Hospital{" "}
              <input
                type="radio"
                name="apparenCause"
                style={{ cursor: "pointer" }}
              />
              Remained at Hotel{" "}
              <input
                type="radio"
                name="apparenCause"
                style={{ cursor: "pointer" }}
              />
              Went Home{" "}
              <input
                type="radio"
                name="apparenCause"
                style={{ cursor: "pointer" }}
              />
              Victim’s Condition:
              <input type="text" className="underline-input" />
              Victim's Condition:{" "}
              <input
                type="radio"
                name="victimCondition"
                style={{ cursor: "pointer" }}
              />{" "}
              Good
              <input
                type="radio"
                name="victimCondition"
                style={{ cursor: "pointer" }}
              />{" "}
              Fair{" "}
              <input
                type="radio"
                name="victimCondition"
                style={{ cursor: "pointer" }}
              />
              Serious{" "}
              <input
                type="radio"
                name="victimCondition"
                style={{ cursor: "pointer" }}
              />
              Critical{" "}
              <input
                type="radio"
                name="victimCondition"
                style={{ cursor: "pointer" }}
              />{" "}
              Other <input type="text" className="underline-input long" />{" "}
              <br />
              County: <input
                type="text"
                className="underline-input long"
              />{" "}
              Occupation: <input type="text" className="underline-input long" />
              <br />
              Social Security #:{" "}
              <input type="text" className="underline-input long" /> Age:{" "}
              <input type="text" className="underline-input long" /> <br />{" "}
              Specify Part of Body Injured:{" "}
              <input type="text" className="underline-input long" /> Was Lifting
              a Factor?
              <input
                type="radio"
                name="liftingFector"
                style={{ cursor: "pointer" }}
              />
              Yes{" "}
              <input
                type="radio"
                name="liftingFector"
                style={{ cursor: "pointer" }}
              />
              No <br />
              Describe Injury (Use Narrative Section, <b>BE SPECIFIC</b>):{" "}
              <input type="text" className="underline-input w-full" />
            </td>
          </tr>
          <tr>
            <td colSpan={5}>
              For Slips and Falls: Bathtub{" "}
              <input
                type="radio"
                name="forSlipFall"
                style={{ cursor: "pointer" }}
              />
              Down Steps{" "}
              <input
                type="radio"
                name="forSlipFall"
                style={{ cursor: "pointer" }}
              />
              Floors{" "}
              <input
                type="radio"
                name="forSlipFall"
                style={{ cursor: "pointer" }}
              />{" "}
              Parking Lot <br />{" "}
              <input
                type="radio"
                name="forSlipFall"
                style={{ cursor: "pointer" }}
              />{" "}
              Other <input type="text" className="underline-input long" /> Was
              Area Inspected Immediately? <input type="checkbox" />
              Yes <input type="checkbox" />
              No
              <br />
              By Whom: <input
                type="text"
                className="underline-input long"
              />{" "}
              <br /> Any Foreign Substances/Defect Present:{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="foreign_sub"
              />
              Yes{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="foreign_sub"
              />
              No <input type="text" className="underline-input long" />
              <br />
              Surfaces Clean?{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="surface_clean"
              />
              Yes{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="surface_clean"
              />
              No
              <span style={{ marginLeft: "20px" }}>Dry? </span>
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="dry_clean"
              />
              Yes{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="dry_clean"
              />
              No Type of Floor{" "}
              <input type="text" className="underline-input long" />
              <br />
              Time Floor Last Swept, Mopped, Cleaned?{" "}
              <input type="text" className="underline-input long" /> By Whom:{" "}
              <input type="text" className="underline-input long" />
              <br />
              What type of shoes did victim have on?{" "}
              <input type="text" className="underline-input long" />
              Was Victim Wearing Glasses?{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="wearing_glass"
              />
              Yes{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="wearing_glass"
              />
              No Had the Victim Been Drinking or Taking Medication?{" "}
              <input
                type="radio"
                name="taking_medication"
                style={{ cursor: "pointer" }}
              />
              Yes{" "}
              <input
                type="radio"
                name="taking_medication"
                style={{ cursor: "pointer" }}
              />
              No
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
      >
        <tbody>
          <tr>
            <td
              className="illness-label"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                verticalAlign: "top",
                fontSize: "16px",
                letterSpacing: "1px",
              }}
            >
              COMPLETE
              <br />
              FOR
              <br />
              EMPLOYEE
              <br />
              ACCIDENT
              <br />
              ONLY
            </td>
            <td>
              Hire Date:{" "}
              <input
                type="date"
                className="underline-input"
                style={{ width: "120px" }}
              />
              Years of Education Completed?{" "}
              <input type="text" className="underline-input long" />
              Job Assigned When Injured:{" "}
              <input type="text" className="underline-input long" />
              Length of Experience at This Assignment:{" "}
              <input type="text" className="underline-input long" />
              Average Weekly Wage at Time of Injury?{" "}
              <input type="text" className="underline-input long" />
              Hourly Wage: <input type="text" className="underline-input" />
              Schedule Work Week:{" "}
              <input type="text" className="underline-input long" />
              Hrs./Day and{" "}
              <input type="text" className="underline-input long" />
              Hrs./Week Date Employer Notified:{" "}
              <input type="text" className="underline-input long" />
              <br />
              Injury Date:{" "}
              <input
                type="date"
                className="underline-input"
                style={{ width: "120px" }}
              />
              Last Day Worked:
              <input type="text" className="underline-input long" />
              Date Returned to Work:
              <input type="text" className="underline-input long" />
              Estimated Date of Return:
              <input type="text" className="underline-input long" />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginBottom: "0",
        }}
        className="employee_guest_injury_incident"
      >
        <tbody>
          <tr>
            <td
              style={{
                fontWeight: "bold",
                textAlign: "center",
                verticalAlign: "top",
              }}
              className="illness-label"
            >
              EMPLOYEE
              <br />
              GUEST
              <br />
              INJURY
              <br />
              INCIDENT
            </td>
            <td>
              Interview the Injured. B. Interview all persons observing the
              accident. C. Examine the accident scene.
              <br />
              D. Now answer the following questions: What caused the accident?
              <br />
              <input
                type="text"
                className="underline-input long"
                style={{ width: "100%" }}
              />
              <br />
              What should be done to prevent the accident from happening again?
              <br />
              <input
                type="text"
                className="underline-input long"
                style={{ width: "100%" }}
              />
              <br />
              Who will do it?{" "}
              <input type="text" className="underline-input long" /> When?{" "}
              <input type="text" className="underline-input long" />
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ pageBreakBefore: "always", marginTop: "40px" }}></div>
      <div style={{ height: "20px" }}></div>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={3} className="illness-label">
              PROPERTY
              <br />
              DAMAGE/
              <br />
              LOSS
            </td>

            <td colSpan={4}>
              <span>Description of Property:</span>
              <input type="text" className="underline-input long" />
              <br />
              <span>Property</span> in Custody:
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="Properly_custody"
              />
              Yes
              <span style={{ marginLeft: "20px" }}></span>
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="Properly_custody"
              />
              No
              <span style={{ marginLeft: "20px" }}></span>
              <span>Location</span> Where Property Was <span>Found?</span>
              <input type="text" className="underline-input long" />
              Does Guest Have Insurance? Car? Homeowners? Company &amp; Policy
              #:
              <input type="text" className="underline-input long" />
              How Did It Happen? (Explain in Narrative) Room Rekeyed?
              <input type="text" className="underline-input long" />
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={7} className="illness-label">
              FOOD
              <br />
              CASES
            </td>

            <td colSpan={4}>
              Type of Foreign Object:
              <input type="text" className="underline-input xlSize" /> Did You
              See It?
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="total_foreign_key"
              />
              Yes
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="total_foreign_key"
              />
              No
              <div>
                Who Has It?
                <input type="text" className="underline-input long" /> Food
                Supplier:
                <input type="text" className="underline-input long" /> Delivery
                Date:
                <input
                  type="date"
                  className="underline-input"
                  style={{ width: "140px" }}
                />
              </div>
              <div>
                Total Served:
                <input type="text" className="underline-input long" /> Sample
                Available:
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="total_foreign_sample"
                />
                Yes
                <input
                  type="radio"
                  style={{ cursor: "pointer" }}
                  name="total_foreign_sample"
                />
                No
                <span style={{ marginLeft: "20px" }}>
                  Where:
                  <input type="text" className="underline-input xlSize" />
                </span>
              </div>
              <div>
                Food Illness: Date/Time Illness Started:
                <input
                  type="datetime-local"
                  className="underline-input"
                  style={{ width: "fit-content" }}
                />
                <br />
              </div>
              <div>
                Symptoms{" "}
                <span className="label-small">(circle all applicable):</span>
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Nausea
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Vomiting
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Diarrhea
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Chills
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Dizzines
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Weakness
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Paralysis
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Allergies
                <input
                  type="radio"
                  name="symptoms"
                  style={{ cursor: "pointer" }}
                />
                Fever
                <br />
              </div>
              <div>
                Duration of Illness:
                <input type="text" className="underline-input long" />
                <br />
                Date/Time Food Eaten:
                <input
                  type="datetime-local"
                  className="underline-input"
                  style={{ width: "fit-content" }}
                />
                <div>
                  Was Testing Done?
                  <input
                    type="radio"
                    style={{ cursor: "pointer" }}
                    name="testing_done"
                  />
                  Yes
                  <input
                    type="radio"
                    style={{ cursor: "pointer" }}
                    name="testing_done"
                  />
                  No Results:
                  <input type="text" className="underline-input long" />
                  <br />
                  Physician’s Diagnosis:
                  <input type="text" className="underline-input xlSize" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={3} className="illness-label">
              SUSPECT
            </td>

            <td colSpan={4}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Name (First, Middle, Last):
                <input type="text" className="underline-input long" />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Address:
                <input type="text" className="underline-input w-full" />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Age:
                <input type="text" className="underline-input w-full" />
                Height:
                <input type="text" className="underline-input w-full" />
                Weight:
                <input type="text" className="underline-input w-full" />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Hair:
                <input type="text" className="underline-input w-full" />
                Sex:
                <input type="text" className="underline-input w-full" />
                Race:
                <input type="text" className="underline-input w-full" />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "30%",
                  }}
                >
                  Clothing:
                  <input type="text" className="underline-input w-full" />
                </div>

                <div
                  style={{
                    display: "flex",
                    width: "70%",
                    whiteSpace: "nowrap",
                  }}
                >
                  Marks, Scars, Ext.:
                  <input type="text" className="underline-input w-full" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={2} className="illness-label">
              VEHICLE
            </td>

            <td colSpan={4}>
              Vehicle License #:
              <input type="text" className="underline-input long" />
              State:
              <input type="text" className="underline-input long" />
              Vehicle Make:
              <input type="text" className="underline-input long" />
              Model:
              <input type="text" className="underline-input long" />
              Year:
              <input type="text" className="underline-input long" />
              Color:
              <input type="text" className="underline-input long" />
              Damaged or Lost (Explain in Narrative)
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={2} className="illness-label">
              NARRATIVE OR DIAGRAM
            </td>
            <td colSpan={4}>
              <div
                contentEditable={true}
                className="narrativeOrDiagram"
                style={{ minHeight: "83px", border: "1px solid" }}
              ></div>
            </td>
          </tr>
        </tbody>
      </table>

      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td rowSpan={2} className="illness-label">
              POLICE
            </td>
            <td colSpan={4}>
              Did Guest Agree to Notify Police?{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="Notified_police"
              />
              Yes{" "}
              <input
                type="radio"
                style={{ cursor: "pointer" }}
                name="Notified_police"
              />
              No <br />
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                Date Police Contacted:{" "}
                <input
                  type="date"
                  className="underline-input"
                  style={{ width: "140px" }}
                />
                <div>Police Report #:</div>{" "}
                <input type="text" className="underline-input " />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>Officer Taking Report: </div>{" "}
                <input type="text" className="underline-input w-full" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border={1}
        cellSpacing="0"
        cellPadding="5"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          fontSize: "14px",
          marginTop: 0,
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "220px",
                verticalAlign: "top",
              }}
            >
              <div style={{ display: "flex" }}>
                Report Written By:
                <div>
                  <input
                    type="text"
                    className="underline-input"
                    style={{ width: "300px" }}
                  />
                  <br />
                  <span style={{ fontSize: "10px" }}>
                    (Print Name and Sign)
                  </span>
                </div>
                <div>
                  <input
                    type="text"
                    className="underline-input"
                    style={{ width: "300px" }}
                  />
                  <br />
                  <span style={{ fontSize: "10px" }}>Position</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >
                <input type="checkbox" style={{ marginRight: "5px" }} />
                OSHA 200 Form Filled Out
                <div
                  style={{
                    display: "flex",
                    marginLeft: "10px",
                  }}
                >
                  <div>
                    <div
                      id="signatureContainer"
                      style={{
                        position: "relative",
                        paddingBottom: "24px",
                      }}
                    >
                      <canvas
                        id="signaturePad"
                        width="250"
                        height="150"
                        style={{
                          border: "1px solid #ccc",
                          display: "block",
                        }}
                      />

                      <button
                        type="button"
                        // onClick={clearSignature}
                        className="pdf-hide clear-signature"
                        style={{
                          background: "#efefef",
                          border: "1px solid",
                        }}
                      >
                        Clear
                      </button>
                    </div>

                    <span style={{ fontSize: "10px" }}>Signature</span>
                  </div>
                </div>
                <div>
                  <div
                    id="signatureContainerHR"
                    style={{
                      position: "relative",
                      paddingBottom: "24px",
                    }}
                  >
                    <canvas
                      id="signaturePadHR"
                      width="250"
                      height="150"
                      style={{
                        border: "1px solid #ccc",
                        display: "block",
                      }}
                    />

                    <button
                      type="button"
                      //   onClick={clearSignatureHR}
                      className="pdf-hide clear-signature-hr"
                      style={{
                        background: "#efefef",
                        border: "1px solid",
                      }}
                    >
                      Clear
                    </button>
                  </div>

                  <span style={{ fontSize: "10px" }}>
                    General Manager’s Signature
                  </span>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </>
   
  );
};

export default IncidentReport;
