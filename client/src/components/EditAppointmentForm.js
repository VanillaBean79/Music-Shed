// src/components/EditAppointmentForm.js
import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";

function EditAppointmentForm({ appt, onUpdate, onCancel }) {
  const validationSchema = yup.object().shape({
    lesson_datetime: yup.string().required("Please select a new time."),
  });

  const formik = useFormik({
    initialValues: {
      lesson_datetime: appt.lesson_datetime.slice(0, 16), // format for input type=datetime-local
    },
    validationSchema,
    onSubmit: (values) => {
      onUpdate(appt.id, values.lesson_datetime);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} style={{ display: "inline" }}>
      <input
        type="datetime-local"
        name="lesson_datetime"
        value={formik.values.lesson_datetime}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.errors.lesson_datetime && formik.touched.lesson_datetime && (
        <p style={{ color: "red", fontSize: "0.8em" }}>{formik.errors.lesson_datetime}</p>
      )}
      <button type="submit" style={{ marginLeft: "0.5em" }}>
        Save
      </button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "0.5em" }}>
        Cancel
      </button>
    </form>
  );
}

export default EditAppointmentForm;
