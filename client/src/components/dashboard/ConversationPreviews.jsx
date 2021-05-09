import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import GridList from '@material-ui/core/GridList';
import { makeStyles } from "@material-ui/core/styles";
import { getJson } from "api/APIUtils";
import ConversationPreview from "components/dashboard/ConversationPreview";

const useStyles = makeStyles(theme => ({
  previews: {
    marginTop: 20
  },
  list: {
    maxHeight: "60vh"
  }
}));

const ConversationPreviews = (props) => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    getJson('/conversations')
    .then(response => {
      setPreviews(response);
    }).catch(err => {
      setError(err.message);
    });
  }, []);

  return (
    <Box p={1} alignSelf="flex-end" alignItems="center" className={classes.previews}>
      <GridList container alignItems="center" className={classes.list}>
        {previews.map(preview => (
          <ConversationPreview
            key={preview.messages[0].conversation_id['$oid']}
            username={preview.users[1]}
            profilePath="/"
            isOnline={true}
            lastMessage={preview.messages[0].body}
            conversationId={preview.messages[0].conversation_id['$oid']}
            customClickEvent={props.conversationClick}
          />
        ))}
      </GridList>
    </Box>
  );
}

export default ConversationPreviews;
