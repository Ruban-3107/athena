import styles from './number-drop-down.module.css';
import React, { useState } from 'react';

export function NumberDropDown(props) {

  const [selectedValue, setSelectedValue] = useState(1);
  const [inputValues, setInputValues] = useState(Array.from({ length: 1 }, () => ''));

  const handleDropdownChange = (event) => {
    const selectedOption = parseInt(event.target.value);
    setSelectedValue(selectedOption);
    setInputValues(Array.from({ length: selectedOption }, () => ''));
  };

  const handleInputChange = (index, event) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };


  return (
    <div className="container mt-4">
    <div className="form-group">
      <label htmlFor="dropdownSelect">Select the Number of Input Fields:</label>
      <select
        className="form-control"
        id="dropdownSelect"
        value={selectedValue}
        onChange={handleDropdownChange}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
    {inputValues.map((value, index) => (
        <div key={index} className="form-group">
          <label htmlFor={`inputField${index + 1}`}>Input Field {index + 1}:</label>
          <input
            type="text"
            className="form-control"
            id={`inputField${index + 1}`}
            value={value}
            onChange={(event) => handleInputChange(index, event)}
          />
        </div>
      ))}
    </div>
  );
}
export default NumberDropDown;
