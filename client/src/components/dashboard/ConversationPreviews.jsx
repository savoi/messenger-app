import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import GridList from '@material-ui/core/GridList';
import { makeStyles } from "@material-ui/core/styles";
import { getJson } from "api/APIUtils";
import ConversationPreview from "components/dashboard/ConversationPreview";

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

const ConversationPreviews = ({ conversationClick, setError }) => {
  const [previews, setPreviews] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    getJson('/conversations')
    .then(response => {
      setPreviews(response);
    }).catch(err => {
      setError(err.message);
    });
  }, [setError]);

  return (
    <Box p={1/2} alignSelf="flex-end" alignItems="center">
      <GridList container alignItems="center" className={classes.list}>
        {previews.map(preview => (
          <ConversationPreview
            key={preview.messages[0].conversation_id['$oid']}
            username={preview.users[1]}
            profilePath="/"
            isOnline={true}
            lastMessage={preview.messages[0].body}
            conversationId={preview.messages[0].conversation_id['$oid']}
            customClickEvent={conversationClick}
          />
        ))}
      </GridList>
    </Box>
  );
}

export default ConversationPreviews;
