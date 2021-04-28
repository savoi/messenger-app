import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  link: { textDecoration: "none", display: "flex", flexWrap: "nowrap" },
  noAccBtn: {
    fontSize: 14,
    color: "#b0b0b0",
    fontWeight: 400,
    textAlign: "center",
    marginRight: 21,
    whiteSpace: "nowrap"
  },
  accBtn: {
    fontSize: 14,
    fontWeight: 600,
    width: 170,
    height: 54,
    borderRadius: 5,
    filter: "drop-shadow(0px 2px 6px rgba(74,106,149,0.2))",
    backgroundColor: "#ffffff",
    color: "#3a8dff",
    boxShadow: "none",
    marginRight: 35
  }
}));

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
