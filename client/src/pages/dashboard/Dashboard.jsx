import React, { useContext, useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { UserContext } from 'contexts/UserContext';
import useAuth from 'hooks/useAuth';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import UserAvatar from "components/dashboard/UserAvatar";
import ConversationPreviews from "components/dashboard/ConversationPreviews";
import SearchBar from "components/dashboard/SearchBar";
import ChatHeader from "components/dashboard/ChatHeader";
import Message from "components/dashboard/Message";
import MessageField from "components/dashboard/MessageField";
import ChatPlaceholder from "components/dashboard/ChatPlaceholder";
import { getJson } from "api/APIUtils";

const ITEM_HEIGHT = 48;

const useDashboardStyles = makeStyles(theme => ({
  userpanel: {
    backgroundColor: "#F5F7FB"
  },
  usermenu: {
    color: "#95A7C4"
  },
  username: {
    fontWeight: 600
  },
  userMenuHeader: {
    paddingTop: 15
  },
  avatar: {
    paddingRight: 15
  },
  sidebarTitle: {
    paddingTop: 25
  },
  userSearch: {
    backgroundColor: "#E9EEF9",
    borderColor: "#E9EEF9",
    marginTop: 15
  },
  sidePanel: {
    minHeight: "100vh"
  }
}));


export default function Dashboard() {
  const classes = useDashboardStyles();
  const { user } = useContext(UserContext);
  const { logoutUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeConversationUsers, setActiveConversationUsers] = useState([]);
  const [activeConversationMessages, setActiveConversationMessages] = useState([]);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl);

  const StyledChatContainer = withStyles({
    root: {
      paddingTop: 32,
      paddingRight: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      maxHeight: "70vh",
      overflow: "auto"
    }
  })(Container);

  useEffect(() => {
    if (!activeConversationId) {
      return
    }
    getJson(`/conversations/${activeConversationId}`)
    .then(response => {
      setActiveConversationMessages(response.messages);
      console.log(response.messages);
      setActiveConversationUsers(response.users.filter(otherUser => otherUser !== user));
    }).catch(err => {
      setError(err.message);
    });
  }, [activeConversationId, user]);

  const handleLogout = async () => {
    await logoutUser();
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleConversationClick = (conversationId) => {
    setActiveConversationId(conversationId);
  }

  return (
    <Box display="flex">
      <Grid container id="user-panel" lg={4} className={classes.sidePanel}>
      <Paper elevation={0} square className={classes.userpanel}>
        <Container fixed>
          <Box id="user-menu-header" display="flex" alignItems="center" className={classes.userMenuHeader}>
            <Box className={classes.avatar}>
              <UserAvatar
                username={user}
                profilePath="/"
                isOnline={user}
              />
            </Box>
            <Box flexGrow="1">
              <Typography className={classes.username}>{user}</Typography>
            </Box>
            <Box alignSelf="flex-end">
              <IconButton
                aria-label="more"
                aria-controls="user-menu"
                aria-haspopup="true"
                onClick={handleClick}
                >
                <MoreHorizIcon className={classes.usermenu} />
              </IconButton>
              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: '20ch',
                  },
                }}
                >
                <MenuItem key="logout" onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Typography variant="h6" className={classes.sidebarTitle}>Chats</Typography>
          <SearchBar />
          <ConversationPreviews conversationClick={handleConversationClick} />
        </Container>
      </Paper>
    </Grid>
      <Grid container id="chat-panel" lg={8} justify="center">
        {
          activeConversationId
          ? (
              <Box flexGrow="1">
                <ChatHeader toUsername={activeConversationUsers} isOnline={true} />
                <StyledChatContainer>
                <Box lg={12}>
                  {activeConversationMessages.map(message => (
                    <Message fromUser={message['from_user']} body={message.body} timestamp={message['created_at']['$date']} />
                  ))}
                </Box>
              </StyledChatContainer>
                <MessageField activeUser={activeConversationUsers[0]} />
              </Box>
            )
          :
            <ChatPlaceholder />
        }
      </Grid>
    </Box>
  );
}
