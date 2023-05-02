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

  const [startDate, setStartDate] = useState(new Date());
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
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
            {"<"}
          </button>
          <select
            value={date.getFullYear()}
            onChange={({ target: { value } }) => changeYear(value)}
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
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
            {">"}
          </button>
        </div>
      )}
      selected={startDate}
      onChange={(date) => {setStartDate(date);
                           props.onDateChange(date);                      
      }}
    />
  );
}

export default MultiAgentDatePicker