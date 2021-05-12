import React from "react";
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import UserAvatar from "components/dashboard/UserAvatar";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  previewCard: {
    padding: 12,
    marginBottom: 15,
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: 8,
    width: "100%",
    '&:hover': {
      background: "rgba(255, 255, 255, 1)"
    },
    '&.Mui-selected': {
      backgroundColor: "#FFF"
    }
  },
  text: {
    color: "#000"
  }
}));

const ConversationPreview = ({username, profilePath, isOnline, lastMessage, conversationId, customClickEvent, activeConversationId}) => {
  const classes = useStyles();

  const handleClick = () => {
    customClickEvent(conversationId);
  };

  return (
    <ListItem
      button
      selected={activeConversationId === conversationId}
      className={classes.previewCard}
      onClick={handleClick}
    >
      <ListItemAvatar>
        <UserAvatar username={username} profilePath={profilePath} isOnline={isOnline} />
      </ListItemAvatar>
      <ListItemText
        primary={username}
        primaryTypographyProps={{
          className: classes.text,
          variant: "subtitle2"
        }}
        secondary={lastMessage}
        secondaryTypographyProps={{
          className: classes.text,
          variant: "subtitle2"
        }}
      />
    </ListItem>
  );
}

export default ConversationPreview;
