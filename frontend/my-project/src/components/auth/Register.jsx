import { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/authApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

const Register = () => {
  const [register, { data, isLoading, error }] = useRegisterMutation();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { name, email, password } = user;
  console.log("register", data);
  useEffect(() => {
    if (isAuthenticated) {
      console.log("route checking", isAuthenticated);

      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error, isAuthenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const signupData = {
      name,
      email,
      password,
    };
    register(signupData);
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <MetaData title={"Register"} />
      <div class="row wrapper">
        <div class="col-10 col-lg-5">
          <form
            class="shadow rounded bg-body"
            action="your_submit_url_here"
            onSubmit={handleSubmit}
          >
            <h2 class="mb-4">Register</h2>

            <div class="mb-3">
              <label htmlFor="name_field" class="form-label">
                Name
              </label>
              <input
                type="text"
                id="name_field"
                class="form-control"
                name="name"
                value={name}
                onChange={handleOnchange}
              />
            </div>

            <div class="mb-3">
              <label htmlFor="email_field" class="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                class="form-control"
                name="email"
                value={email}
                onChange={handleOnchange}
              />
            </div>

            <div class="mb-3">
              <label htmlFor="password_field" class="form-label">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                class="form-control"
                name="password"
                value={password}
                onChange={handleOnchange}
              />
            </div>

            <button
              id="register_button"
              type="submit"
              class="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
