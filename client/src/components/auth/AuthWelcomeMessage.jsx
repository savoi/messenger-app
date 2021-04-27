import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import useStyles from "styles/AuthStyles";

const AuthWelcomeMessage = ({page}) => {
  const classes = useStyles();
  const welcomeMessage = {
    "login": "Welcome back!",
    "signup": "Create an account."
  }

  return (
    <Grid container>
      <Grid item xs>
        <Typography className={classes.welcome} component="h1" variant="h5">
          {welcomeMessage[page]}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default AuthWelcomeMessage;
