import React, { useContext } from "react";
import Avatar from '@material-ui/core/Avatar';
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { UserContext } from 'contexts/UserContext';


const Message = ({fromUser, body, timestamp}) => {
  const date = new Date(timestamp);
  const time = `${date.getHours()}:${date.getMinutes()}`;
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
    chatWindow: {
      maxHeight: "70vh"
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
    <Box display="flex" alignItems="flex-start" justifyContent={alignment} className={classes.chatWindow}>
      {!fromSelf &&
      <Box mt={2}>
        <Avatar alt={fromUser} src="/" />
      </Box>
      }
      <Box p={1} display="flex" flexDirection="column" alignItems={alignment}>
        <Typography variant="subtitle2" className={classes.meta}>{messageMeta}</Typography>
        <StyledPaper elevation={0} p={3}>
          <Typography variant="subtitle2" className={classes.body}>{body}</Typography>
        </StyledPaper>
      </Box>
    </Box>
  );
}

export default Message;
