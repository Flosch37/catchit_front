import React, { useState, useEffect } from "react";

export default function GenericForm({
  initialState,
  onFormSubmit,
  buttonText,
  fields,
}) {
  const [formData, setFormData] = useState(initialState || {});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <label key={field.name}>
          {field.label}:
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : field.type === "textarea" ? (
            <textarea
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
            ></textarea>
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              name={field.name}
              checked={!!formData[field.name]} // Utilise `checked` au lieu de `value` pour les checkbox
              onChange={handleChange}
            />
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
            />
          )}
        </label>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
}
