import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email is required")
    .email("Email is not valid"),
  password: Yup.string()
    .required("Password is required")
    .max(100, "Password is too long")
    .min(6, "Password too short")
})

export { loginSchema };
