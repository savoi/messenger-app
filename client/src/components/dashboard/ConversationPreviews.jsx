import React, { useContext } from "react";
import Box from "@material-ui/core/Box";
import List from '@material-ui/core/List';
import { makeStyles } from "@material-ui/core/styles";
import ConversationPreview from "components/dashboard/ConversationPreview";
import { UserContext } from 'contexts/UserContext';

const useStyles = makeStyles(theme => ({
  list: {
    maxHeight: "60vh",
    scrollbarWidth: "none",
    '&::-webkit-scrollbar': {
      width: 0,
      height: 0
    },
  }
}));

const ConversationPreviews = ({ conversationClick, previews, activeConversationId, onlineUsers }) => {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  return (
    <Box p={1/2} alignSelf="flex-end" alignItems="center">
      <List className={classes.list}>
        {previews.map(preview => (
          <ConversationPreview
            key={preview.id}
            username={preview.users.filter(username => username !== user)[0]}
            profilePath="/"
            isOnline={preview.users.filter(username => username !== user)[0] in onlineUsers}
            lastMessage={preview.messages[0]?.body ?? ""}
            conversationId={preview.id}
            customClickEvent={conversationClick}
            activeConversationId={activeConversationId}
          />
        ))}
      </List>
    </Box>
  );
}

export default ConversationPreviews;
