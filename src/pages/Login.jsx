import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext"; // ✅ Import useAuth

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login function from context

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters required")
      .required("Password is required"),
  });

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await axios.post("/auth/login", values, {
        withCredentials: true,
      });

      // ✅ Use context login so `isLoggedIn` becomes true
      login(res.data.accessToken);

      // ✅ Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setErrors({
        password: "Invalid credentials. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-8">
          Admin Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <FiMail />
                  </span>
                  <Field
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <FiLock />
                  </span>
                  <Field
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
