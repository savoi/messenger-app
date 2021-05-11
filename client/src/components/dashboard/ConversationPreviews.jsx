import React, { useContext, useEffect } from "react";
import Box from "@material-ui/core/Box";
import GridList from '@material-ui/core/GridList';
import { makeStyles } from "@material-ui/core/styles";
import { getJson } from "api/APIUtils";
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

const ConversationPreviews = ({ conversationClick, setError, previews, setPreviews, isNewConvo }) => {
  const classes = useStyles();
  const { user } = useContext(UserContext);

  useEffect(() => {
    getJson('/conversations')
    .then(response => {
      setPreviews(response);
    }).catch(err => {
      setError(err.message);
    });
  }, [setError, setPreviews, isNewConvo]);

  return (
    <Box p={1/2} alignSelf="flex-end" alignItems="center">
      <GridList className={classes.list}>
        {previews.map(preview => (
          <ConversationPreview
            key={preview['_id']['$oid']}
            username={preview.users.filter(username => username !== user)[0]}
            profilePath="/"
            isOnline={true}
            lastMessage={preview.messages[0]?.body ?? ""}
            conversationId={preview['_id']['$oid']}
            customClickEvent={conversationClick}
          />
        ))}
      </GridList>
    </Box>
  );
}

export default ConversationPreviews;
