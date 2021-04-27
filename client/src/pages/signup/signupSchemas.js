import * as Yup from "yup";

const signupSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .max(40, "Username is too long"),
  email: Yup.string()
    .required("Email is required")
    .email("Email is not valid"),
  password: Yup.string()
    .required("Password is required")
    .max(100, "Password is too long")
    .min(6, "Passwords must be at least 6 characters.")
});

export { signupSchema };
