// src/components/TestFormik.js
// src/components/TestFormik.js
import React from "react";
import { Formik, Form, Field } from "formik";

function TestFormik() {
  return (
    <div>
      <h2>Hello from TestFormik</h2>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <label>Email:</label>
          <Field name="email" type="email" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

export default TestFormik;

