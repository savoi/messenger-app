import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import useStyles from "./AuthStyles";

const AuthHeaderButtons = ({page}) => {
  const classes = useStyles();

  const linkTo = {
    "login": "signup",
    "signup": "login"
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
      <Link to={`/${linkTo[page]}`} className={classes.link}>
        <Button className={classes.noAccBtn}>
          {leftButtonMsg[page]}
        </Button>
        <Button
          color="default"
          className={classes.accBtn}
          variant="contained"
        >
          {rightButtonMsg[page]}
        </Button>
      </Link>
    </Box>
  );
}

export default AuthHeaderButtons;
