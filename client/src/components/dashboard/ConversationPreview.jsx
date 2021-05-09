import React from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import UserAvatar from "components/dashboard/UserAvatar";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  previewCard: {
    padding: 15,
    marginBottom: 15,
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: 8,
    width: "100%",
    '&:hover': {
      background: "rgba(255, 255, 255, 1)"
    }
  },
  avatar: {
    marginRight: 20
  }
}));

const ConversationPreview = ({username, profilePath, isOnline, lastMessage, conversationId, customClickEvent}) => {
  const classes = useStyles();

  const handleClick = () => {
    customClickEvent(conversationId);
    //classes.previewCard.background = "rgba(255, 255, 255, 1)";
  };

  return (
    <Paper elevation={0} className={classes.previewCard} onClick={handleClick}>
      <Box display="flex">
        <Box className={classes.avatar}>
          <UserAvatar username={username} profilePath={profilePath} isOnline={isOnline} />
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Typography variant="subtitle2">{username}</Typography>
          <Typography variant="subtitle2">{lastMessage}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default ConversationPreview;
