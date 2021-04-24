import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Formik, Form } from "formik";
import Typography from "@material-ui/core/Typography";
import { loginSchema } from "./LoginSchemas";
import useAuth from './../common/useAuth';
import AuthSideBanner from "./../common/AuthSideBanner";
import AuthHeaderButtons from "./../common/AuthHeaderButtons";
import AuthWelcomeMessage from "./../common/AuthWelcomeMessage";
import useStyles from "./../common/AuthStyles";


export default function Login() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { loginUser, error } = useAuth();

  const handleSubmit = async (values) => {
    await loginUser(values)
    setOpen(true);
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={5} className={classes.image}>
        <AuthSideBanner />
      </Grid>
      <Grid item xs={12} sm={8} md={7} elevation={6} component={Paper} square>
        <Box className={classes.buttonHeader}>
          <AuthHeaderButtons page="login" />
          <Box width="100%" maxWidth={450} p={3} alignSelf="center">
            <AuthWelcomeMessage page="login" />
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form className={classes.form}
                >
                  <TextField
                    id="email"
                    label={<p className={classes.label}>E-mail address</p>}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{ classes: { input: classes.inputs } }}
                    name="email"
                    autoComplete="email"
                    autoFocus
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                    value={values.email}
                    onChange={handleChange}
                  />
                  <TextField
                    id="password"
                    label={
                      <Typography className={classes.label}>
                        Password
                      </Typography>
                    }
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      classes: { input: classes.inputs },
                      endAdornment: (
                        <Typography className={classes.forgot}>
                          Forgot?
                        </Typography>
                      )
                    }}
                    type="password"
                    autoComplete="current-password"
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    value={values.password}
                    onChange={handleChange}
                  />

                  <Box textAlign="center">
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Login
                    </Button>
                  </Box>

                  <div style={{ height: 95 }} />
                </Form>
              )}
            </Formik>
          </Box>
          <Box p={1} alignSelf="center" />
        </Box>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center"
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={error}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </Grid>
    </Grid>
  );
}
