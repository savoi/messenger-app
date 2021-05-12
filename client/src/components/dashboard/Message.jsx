import React, { useContext } from "react";
import Avatar from '@material-ui/core/Avatar';
import Box from "@material-ui/core/Box";
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { UserContext } from 'contexts/UserContext';
import clsx from "clsx";


const useStyles = makeStyles(theme => ({
  bodySelf: {
    color: "#91A3C0"
  },
  bodyCardSelf: {
    backgroundColor: "#F4F6FA",
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 0
  },
  bodyOther: {
    color: "#FFF"
  },
  bodyCardOther: {
    backgroundImage: "linear-gradient(to bottom left, #6CC1FF, #3A8DFF)",
    borderTopLeftRadius: 0,
    borderBottomRightRadius: 10
  },
  meta: {
    color: "#BECCE2",
    fontSize: "0.7rem"
  },
  message: {
    width: "auto"
  },
  messageContainer: {
    marginBottom: 3
  }
}));

const StyledPaper = withStyles({
  root: {
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    width: "fit-content",
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10
  }
})(Paper);

const Message = ({fromUser, body, timestamp}) => {
  const msgDate = new Date(timestamp);
  const minutes = `${msgDate.getMinutes()}`.padStart(2, "0");
  const time = `${msgDate.getHours()}:${minutes}`;
  const { user } = useContext(UserContext);
  const fromSelf = (fromUser === user);
  const alignment = fromSelf ? "flex-end" : "flex-start";
  const messageMeta = fromSelf ? time : `${fromUser} ${time}`;
  const classes = useStyles();

  const bodyClassNames = clsx({
      [classes.bodySelf]: fromSelf,
      [classes.bodyOther]: !fromSelf
  });

  const bodyCardClassNames = clsx({
    [classes.bodyCardSelf]: fromSelf,
    [classes.bodyCardOther]: !fromSelf
  });

  return (
    <Grid container alignItems="flex-start" wrap="nowrap" justify={alignment} spacing={2} className={classes.messageContainer}>
      {!fromSelf &&
        <Grid item>
          <Box mt={1}>
            <Avatar alt={fromUser} src="/" />
          </Box>
        </Grid>
      }
      <Grid container item p={1} direction="column" alignItems={alignment} className={classes.message}>
        <Typography variant="subtitle2" className={classes.meta}>{messageMeta}</Typography>
        <StyledPaper elevation={0} p={3} className={bodyCardClassNames}>
          <Typography variant="subtitle2" className={bodyClassNames}>{body}</Typography>
        </StyledPaper>
      </Grid>
    </Grid>
  );
}

export default Message;
