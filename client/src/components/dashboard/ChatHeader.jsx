import React from "react";
import Box from "@material-ui/core/Box";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Container from '@material-ui/core/Container';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import clsx from "clsx";


const StatusIcon = withStyles({
  root: {
    fontSize: "0.875rem"
  }
})(FiberManualRecordIcon);

const StatusTypography = withStyles({
  root: {
    color: "#BFC9DB"
  }
})(Typography);

const StyledMoreIcon = withStyles({
  root: {
    color: "#95A7C4",
  }
})(MoreHorizIcon);

const StyledPaper = withStyles({
  root: {
    boxShadow: "0px 2px 20px 0px rgba(88, 133, 196, 0.1)",
  }
})(Paper);

const useStyles = makeStyles(theme => ({
  online: {
    color: "#1CED84"
  },
  offline: {
    color: "#D0DAE9"
  }
}));


export default function ChatHeader({ toUsername, isOnline, handleDrawerClose }) {
  const classes = useStyles();

  return (
    <Box flexGrow="1">
      <StyledPaper square elevation={0}>
        <Container fixed>
          <Box id="user-menu-header" display="flex" flexGrow="1" alignItems="center" p={2} pb={3}>
            <Hidden smUp>
              <Box pr={2}>
                <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
            </Hidden>
            <Box pr={2}>
              <Typography variant="h6">{toUsername}</Typography>
            </Box>
            <Box p={1/2} mt={3/4}>
              <StatusIcon className={clsx({
                  [classes.online]: isOnline,
                  [classes.offline]: !isOnline
                })} />
            </Box>
            <Box flexGrow="1">
              <StatusTypography variant="subtitle2">
                { isOnline ? "Online" : "Offline" }
              </StatusTypography>
            </Box>
            <Box>
              <IconButton
                aria-label="more"
                aria-controls="user-menu"
                aria-haspopup="true"
                >
                <StyledMoreIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </StyledPaper>
    </Box>
  );
}
