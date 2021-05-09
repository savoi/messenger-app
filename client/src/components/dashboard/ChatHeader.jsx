import React from "react";
import Box from "@material-ui/core/Box";
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from '@material-ui/core/styles';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';


export default function ChatHeader({toUsername, isOnline}) {
  const statusColor = isOnline ? '#1CED84' : '#D0DAE9';

  const StatusTypography = withStyles({
    root: {
      color: "#BFC9DB"
    }
  })(Typography);

  const StatusIcon = withStyles({
    root: {
      color: statusColor,
      fontSize: "0.875rem"
    }
  })(FiberManualRecordIcon);

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

  return (
    <Box flexGrow="1">
      <StyledPaper square elevation={0}>
        <Container fixed>
          <Box id="user-menu-header" display="flex" flexGrow="1" alignItems="center" p={2} pb={3}>
            <Box pr={2}>
              <Typography variant="h6">{toUsername}</Typography>
            </Box>
            <Box p={1/2} mt={3/4}>
              <StatusIcon />
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
