import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import useStyles from "styles/AuthStyles";

const AuthHeaderButtons = ({page}) => {
  const classes = useStyles();

  const linkTo = {
    "login": "/signup",
    "signup": "/login"
  }

  const leftButtonMsg = {
    "login": "Don't have an account?",
    "signup": "Already have an account?"
  }
  const rightButtonMsg = {
    "login": "Create account",
    "signup": "Login"
  }

  return (
    <Box p={1} alignSelf="flex-end" alignItems="center">
      <Grid container alignItems="center">
        <Typography className={classes.noAccBtn}>
          {leftButtonMsg[page]}
        </Typography>
        <Link to={linkTo[page]} className={classes.link}>
          <Button
            color="default"
            className={classes.accBtn}
            variant="contained"
          >
            {rightButtonMsg[page]}
          </Button>
        </Link>
      </Grid>
    </Box>
  );
}

export default AuthHeaderButtons;
