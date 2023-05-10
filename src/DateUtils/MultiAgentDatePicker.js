import React, { useState } from "react";
import DatePicker from "react-datepicker";



import "react-datepicker/dist/react-datepicker.css";

function range(startValue, finalValue, increment){
    let range = [];

    for(let i = startValue; i < finalValue; i += increment){
        range.push(i);
    
    }

    return range
}



function MultiAgentDatePicker(props){

  const [startDate, setStartDate] = useState("");
  const years = range(2015, new Date().getFullYear() + 1, 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <DatePicker
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <>
        <button onClick={() => {setStartDate(""); props.onDateChange() } } className="month-button">{"Reset"}</button>
        <div

          // className="datepicker-select-container"
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className="month-button">
            {"<"}
          </button>
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(value)}
            className="date-picker-select"
          >
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={months[date.getMonth()]}
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
            className="date-picker-select"
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className="month-button">
            {">"}
          </button>
        </div>
        </>
      )}
      selected={startDate}
      onChange={(date) => {setStartDate(date);
                           props.onDateChange(date);                      
      }}
      
      className="form-control border-light bg-soft-light date-picker-input"

      
      placeholderText="Date"

      dateFormat="dd/MM/yyyy"

    
    />
  );

}



export default MultiAgentDatePicker