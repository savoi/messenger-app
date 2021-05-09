import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  welcome: {
    fontSize: 26,
    paddingBottom: 20,
    color: "#000000",
    fontWeight: 600
  }
}));

const AuthWelcomeMessage = ({page}) => {
  const classes = useStyles();
  const welcomeMessage = {
    "login": "Welcome back!",
    "signup": "Create an account."
  }

  return (
    <Typography className={classes.welcome} component="h1" variant="h5">
      {welcomeMessage[page]}
    </Typography>
  );
}

export default AuthWelcomeMessage;
