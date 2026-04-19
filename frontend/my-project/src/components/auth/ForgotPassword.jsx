import React, { useEffect, useState } from "react";
import { useForgotPasswordMutation } from "../../redux/userApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MetaData from "../layout/MetaData";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Email sent. Please check your inbox");
    }
  }, [error, isAuthenticated, isSuccess]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    forgotPassword({ email });
  };
  return (
    <>
      <MetaData title={"forgot password"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={handleOnSubmit}>
            <fieldset>
              <legend className="mb-4">Forgot Password</legend>
              <div className="mt-3">
                <label htmlFor="email_field" className="form-label">
                  Enter Email
                </label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                id="forgot_password_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Email"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
