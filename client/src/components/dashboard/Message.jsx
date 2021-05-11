import React, { useContext } from "react";
import Avatar from '@material-ui/core/Avatar';
import Box from "@material-ui/core/Box";
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { UserContext } from 'contexts/UserContext';


const Message = ({fromUser, body, timestamp}) => {
  const msgDate = new Date(timestamp);
  const minutes = `${msgDate.getMinutes()}`.padStart(2, "0");
  const time = `${msgDate.getHours()}:${minutes}`;
  const { user } = useContext(UserContext);

  const fromSelf = (fromUser === user);
  const alignment = fromSelf ? "flex-end" : "flex-start";
  const messageMeta = fromSelf ? time : `${fromUser} ${time}`;

  const useStyles = makeStyles(theme => ({
    body: {
      color: fromSelf ? "#91A3C0" : "#FFF"
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
  const classes = useStyles();

  const StyledPaper = withStyles({
    root: {
      padding: 8,
      paddingLeft: 16,
      paddingRight: 16,
      ...(fromSelf && {backgroundColor: "#F4F6FA"}),
      ...(!fromSelf && {backgroundImage: "linear-gradient(to bottom left, #6CC1FF, #3A8DFF)"}),
      width: "fit-content",
      borderTopLeftRadius: fromSelf ? 10 : 0,
      borderTopRightRadius: 10,
      borderBottomRightRadius: fromSelf ? 0 : 10,
      borderBottomLeftRadius: 10
    }
  })(Paper);

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
        <StyledPaper elevation={0} p={3}>
          <Typography variant="subtitle2" className={classes.body}>{body}</Typography>
        </StyledPaper>
      </Grid>
    </Grid>
  );
}

export default Message;
