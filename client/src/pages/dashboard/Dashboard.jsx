import React, { useContext, useEffect, useRef, useState } from "react";
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

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const { logoutUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeConversationUsers, setActiveConversationUsers] = useState([]);
  const [activeConversationMessages, setActiveConversationMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [error, setError] = useState(null);
  const open = Boolean(anchorEl);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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
      paddingTop: 10
    },
    userSearch: {
      backgroundColor: "#E9EEF9",
      borderColor: "#E9EEF9",
      marginTop: 15
    },
    sidePanel: {
      maxHeight: "100vh"
    },
    chatPanel: {
      backgroundColor: activeConversationId ? "#FFF" : "#F4F6FA",
      maxHeight: "100vh"
    },
    messageContainer: {
      flexGrow: 1,
      overflow: "auto",
      marginBottom: 30,
      scrollbarWidth: "none",
      '&::-webkit-scrollbar': {
        width: 0,
        height: 0
      }
    },
    messages: {
      '& > :first-child': {
        marginTop: 10,
      }
    },
    chatPreviews: {
      overflow: "auto",
      scrollbarWidth: "none",
      '&::-webkit-scrollbar': {
        width: 0,
        height: 0
      }
    }
  }));
  const classes = useDashboardStyles();

  const NarrowContainer = withStyles({
    root: {
      paddingRight: 48,
      paddingLeft: 48
    }
  })(Container);

  useEffect(() => {
    scrollToBottom()
    setNewMessage(false);
  }, [activeConversationMessages]);

  useEffect(() => {
    if (!activeConversationId) {
      return
    }
    getJson(`/conversations/${activeConversationId}`)
    .then(response => {
      setActiveConversationMessages(response.messages);
      setActiveConversationUsers(response.users.filter(otherUser => otherUser !== user));
    }).catch(err => {
      setError(err.message);
    });
  }, [activeConversationId, newMessage, user]);

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
      <Grid container id="user-panel" wrap="nowrap" xl={4} lg={4} md={4} className={classes.sidePanel}>
        <Paper elevation={0} square className={classes.userpanel}>
          <Container fixed>
            <Grid container spacing={3} wrap="nowrap" direction="column" className={classes.sidePanel}>
              <Grid item>
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
              </Grid>
              <Grid item>
                <Typography variant="h6" className={classes.sidebarTitle}>Chats</Typography>
              </Grid>
              <Grid item>
                <SearchBar setError={setError} />
              </Grid>
              <Grid item className={classes.chatPreviews}>
                <ConversationPreviews conversationClick={handleConversationClick} setError={setError} />
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
      {
        activeConversationId
        ? (
            <Grid container id="chat-panel" lg={8} direction="column" justify="space-between" wrap="nowrap" className={classes.chatPanel}>
              <Grid item>
                <ChatHeader toUsername={activeConversationUsers} isOnline={true} />
              </Grid>
              <Grid item className={classes.messageContainer}>
                <NarrowContainer>
                  <Grid container direction="column" justify="space-between" lg={12} className={classes.messages}>
                    {activeConversationMessages.map(message => (
                      <React.Fragment>
                        <Message fromUser={message['from_user']} body={message.body} timestamp={message['created_at']['$date']} />
                        <div ref={messagesEndRef} />
                      </React.Fragment>
                    ))}
                  </Grid>
                </NarrowContainer>
              </Grid>
              <Grid item>
                <Box mb={3}>
                  <NarrowContainer>
                    <MessageField activeUser={activeConversationUsers[0]} setNewMessage={setNewMessage} />
                  </NarrowContainer>
                </Box>
              </Grid>
            </Grid>
          )
        :
          <Grid container id="chat-panel" lg={8} direction="column" justify="center" className={classes.chatPanel}>
            <ChatPlaceholder />
          </Grid>
      }
    </Box>
  );
}
