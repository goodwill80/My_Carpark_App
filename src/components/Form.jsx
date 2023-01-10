import { useNavigate } from "react-router-dom";

import { useState, useContext } from "react";
import Joi from "joi-browser";
import CarparkContext from "../Context/CarparkContext";

function Form({ getUserData }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState({});

  // Redirect
  const navigate = useNavigate();

  const schema = {
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string().email().required(),
  };

  const handlerOnChange = (event) => {
    const { name, value } = event.target;
    const errorMessage = validate(event);
    let errorData = { ...error };

    if (errorMessage) {
      errorData[name] = errorMessage;
    } else {
      delete errorData[name];
    }

    let userData = { ...user };
    userData[name] = value;

    setUser(userData);
    setError(errorData);
  };

  const validate = (event) => {
    const { name, value } = event.target;

    const objToCompare = { [name]: value };
    const subSchema = { [name]: schema[name] };

    const result = Joi.validate(objToCompare, subSchema);

    const { error } = result;
    return error ? error.details[0].message : null;
  };

  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, { abortEarly: false });
    const { error } = result;
    if (!error) {
      getUserData(user);
      navigate("/search");
      return user;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setError(errorData);
      console.log(errorData);
      return errorData;
    }
  };

  return (
    <div>
      <h2>Form</h2>
      <form onSubmit={handlerOnSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          onChange={handlerOnChange}
        />
        <br />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          onChange={handlerOnChange}
        />
        <br />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Form;
