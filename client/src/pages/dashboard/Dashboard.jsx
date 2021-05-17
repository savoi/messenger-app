import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { UserContext } from 'contexts/UserContext';
import useAuth from 'hooks/useAuth';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import UserAvatar from "components/dashboard/UserAvatar";
import ConversationPreviews from "components/dashboard/ConversationPreviews";
import SearchBar from "components/dashboard/SearchBar";
import ChatHeader from "components/dashboard/ChatHeader";
import Message from "components/dashboard/Message";
import MessageField from "components/dashboard/MessageField";
import ChatPlaceholder from "components/dashboard/ChatPlaceholder";
import DashboardSnackbar from "components/dashboard/DashboardSnackbar";
import { getConversation, getJson } from "api/APIUtils";
import clsx from "clsx";
import useChat from "hooks/useChat";

const ITEM_HEIGHT = 48;

const NarrowContainer = withStyles({
  root: {
    paddingRight: 48,
    paddingLeft: 48
  }
})(Container);

const useDashboardStyles = makeStyles(theme => ({
  avatar: {
    paddingRight: 15
  },
  dashboard: {
    height: "100vh",
    maxHeight: "100vh",
  },
  usermenu: {
    color: "#95A7C4"
  },
  userMenuHeader: {
    paddingTop: 15
  },
  username: {
    fontWeight: 600
  },
  userpanel: {
    backgroundColor: "#F5F7FB",
    width: "100%"
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
    maxHeight: "100vh",
    height: "100vh"
  },
  chatPanel: {
    maxHeight: "100%",
    height: "100%",
  },
  chatPanelActive: {
    backgroundColor: "#FFF"
  },
  chatPanelInactive: {
    backgroundColor: "#F4F6FA"
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
  },
  drawer: {
    width: "100%"
  }
}));

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const { logoutUser } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [activeConversationUsers, setActiveConversationUsers] = useState([]);
  const [activeConversationMessages, setActiveConversationMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [isNewConvo, setIsNewConvo] = useState(false);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const messagesEndRef = useRef(null);
  const classes = useDashboardStyles();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const { messages, sendMessage } = useChat(activeConversationId);

  const chatPanelClassNames = clsx(classes.chatPanel, {
    [classes.chatPanelActive]: activeConversationId,
    [classes.chatPanelInactive]: !activeConversationId
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    setNewMessage(false);
  }, [activeConversationMessages, messages]);

  useEffect(() => {
    if (!activeConversationId || activeConversationId === -1) {
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
    setDrawerOpen(true);
  }

  const handleSelectUser = useCallback((username) => {
    if (username) {
      const preview = previews.find((preview) => {
        return preview.users.includes(username);
      });
      if (preview) {
        setActiveConversationId(preview.id);
      } else {
        getConversation([user, username])
        .then((response) => {
          setIsNewConvo(prev => (!prev));
          setActiveConversationId(response['conversationId']);
        })
        .catch((err) => {
          setError(err.message);
        });
      }
    }
  }, [previews, user]);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  let chatPanel = (
    <Grid container item id="chat-panel" lg={8} direction="column" justify="space-between" wrap="nowrap" className={chatPanelClassNames}>
      <Grid item>
        <ChatHeader toUsername={activeConversationUsers} isOnline={true} handleDrawerClose={handleDrawerClose} />
      </Grid>
      <Grid item className={classes.messageContainer}>
        <NarrowContainer>
          <Grid container item direction="column" justify="space-between" lg={12} className={classes.messages}>
            {activeConversationMessages.map(message => (
              <Message
                key={message['created_at']}
                fromUser={message['from_user']}
                body={message.body}
                timestamp={message['created_at']}
              />
            ))}
            {messages.map(message => (
              <Message
                key={message['createdAt']}
                fromUser={message['fromUser']}
                body={message.body}
                timestamp={message['createdAt']}
              />
            ))}
            <div key={-1} ref={messagesEndRef} />
          </Grid>
        </NarrowContainer>
      </Grid>
      <Grid item>
        <Box mb={3}>
          <NarrowContainer>
            <MessageField
              sendMessage={sendMessage}
              setError={setError}
            />
          </NarrowContainer>
        </Box>
      </Grid>
    </Grid>
  );

  let drawerWithChatPanel = (
    <Drawer
      variant="persistent"
      anchor="right"
      open={drawerOpen}
      PaperProps={{
        className: classes.drawer
      }}
    >
      {chatPanel}
    </Drawer>
  );

  return (
    <Box display="flex" className={classes.dashboard}>
      <Grid container item id="user-panel" wrap="nowrap" xl={4} lg={4} md={4} className={classes.sidePanel}>
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
                <SearchBar setError={setError} handleSelectUser={handleSelectUser} />
              </Grid>
              <Grid item className={classes.chatPreviews}>
                <ConversationPreviews
                  conversationClick={handleConversationClick}
                  setError={setError}
                  previews={previews}
                  setPreviews={setPreviews}
                  isNewConvo={isNewConvo}
                  activeConversationId={activeConversationId}
                />
              </Grid>
            </Grid>
          </Container>
        </Paper>
      </Grid>
      {
        activeConversationId
        ? (
            smallScreen ? drawerWithChatPanel : chatPanel
          )
        : (
            smallScreen
            ? drawerWithChatPanel
            : <Grid
                container
                item
                id="chat-panel"
                lg={8}
                direction="column"
                justify="center"
                className={classes.chatPanel}
              >
                <ChatPlaceholder />
              </Grid>
          )
      }
      <DashboardSnackbar error={error} />
    </Box>
  );
}
