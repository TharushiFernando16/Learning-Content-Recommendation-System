import React, { useState } from 'react';
import Select from 'react-select';

const MultiSelectField = ({ label, options, selectedValues, handleCheckboxChange, fieldName }) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedValues || []); // Ensure it's not undefined

  const handleChange = (selectedOptions) => {
    const newSelectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedOptions(newSelectedValues);

    // Pass the selected values to the parent component
    handleCheckboxChange({ target: { value: newSelectedValues } }, fieldName);
  };

  const formattedOptions = options.map(option => ({
    value: option,
    label: option,
  }));

  return (
    <div className="form-group">
      <h4>{label}</h4>
      <Select
        isMulti
        name={fieldName}
        options={formattedOptions}
        value={formattedOptions.filter(option => selectedOptions.includes(option.value))}
        onChange={handleChange}
      />
    </div>
  );
};

export default MultiSelectField;
