import { useNavigate } from 'react-router-dom';

import { useState } from 'react';

import Joi from 'joi-browser';
import Swal from 'sweetalert2';

function Form({ getUserData, setSignIn }) {
  // State for form handler to receive user data inputs
  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState({});

  // Redirect
  const navigate = useNavigate();

  // Joi Schema
  const schema = {
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string().email().required(),
  };

  // Handler onChange for User Form
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

  // Handler for user agree
  const userAgreement = (e) => {
    setAgree((prev) => !prev);
  };

  // Joi Validation
  const validate = (event) => {
    const { name, value } = event.target;

    const objToCompare = { [name]: value };
    const subSchema = { [name]: schema[name] };

    const result = Joi.validate(objToCompare, subSchema);

    const { error } = result;
    return error ? error.details[0].message : null;
  };

  // Submit Form
  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = Joi.validate(user, schema, { abortEarly: false });
    const { error } = result;

    if (!error && agree) {
      const userInfo = { ...user, agree: agree };
      getUserData(userInfo);
      setSignIn(true);
      navigate('/search');
      return user;
    } else {
      const errorData = {};
      Swal.fire({
        title: 'Error!',
        text: 'Please complete all fields, on check on user agreement',
        icon: 'error',
        confirmButtonText: 'Okay!',
      });
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
    <div className="p-16 px-35 shadow-xl rounded-lg">
      <h2 className="font-bold text-3xl mb-4">HDB Carpark App</h2>
      <form onSubmit={handlerOnSubmit}>
        {/* NAME INPUT */}
        <div className="flex flex-col items-baseline gap-2">
          <label className="font-bold">Name:</label>
          <input
            type="text"
            value={user.name}
            name="name"
            placeholder="Enter name"
            className="input input-bordered input-primary w-[300px] max-w-xs"
            onChange={handlerOnChange}
          />
        </div>
        {/* EMAIL INPUT */}
        <div className="flex flex-col items-baseline gap-2 mt-4">
          <label className="font-bold">Email:</label>
          <input
            type="email"
            value={user.email}
            name="email"
            placeholder="Enter email"
            className="input input-bordered input-primary w-[300px] max-w-xs"
            onChange={handlerOnChange}
          />
        </div>

        <div className="flex items-baseline gap-3 form-group form-check text-center mb-6 w-[300px] mt-6">
          <input
            onChange={userAgreement}
            value={agree}
            checked={agree}
            name="agree"
            type="checkbox"
            className="form-check-input appearance-none h-4 w-8 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain mr-2 cursor-pointer"
            id="exampleCheck96"
          />

          <label
            className="form-check-label inline-block text-gray-800"
            htmlFor="exampleCheck96"
          >
            <p className="text-left font-semibold text-sm">
              I have read and agree to the terms of releasing my current
              location infomation
            </p>
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-info w-[100%] hover:bg-blue-500 hover:text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
