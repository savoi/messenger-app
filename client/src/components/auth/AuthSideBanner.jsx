import React from "react";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  overlay: {
    backgroundImage:
      "linear-gradient(180deg, rgb(58,141,255, 0.75) 0%, rgb(134,185,255, 0.75) 100%)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flexDirection: "column",
    minHeight: "100vh",
    paddingBottom: 145,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  heroText: {
    fontSize: 26,
    fontFamily: "'Open Sans'",
    textAlign: "center",
    color: "white",
    marginTop: 30,
    maxWidth: 300
  }
}));

const AuthSideBanner = () => {
  const classes = useStyles();

  return (
    <Box className={classes.overlay}>
      <Hidden xsDown>
        <img width={67} src="/images/bubble.svg" alt="Chat bubble" />
        <Hidden smDown>
          <Typography className={classes.heroText}>
            Converse with anyone with any language
          </Typography>
        </Hidden>
      </Hidden>
    </Box>
  );
}

export default AuthSideBanner;
