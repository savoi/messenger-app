import React from "react";
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from "clsx";


const useStyles = makeStyles(theme => ({
  online: {
    '& .MuiBadge-badge': {
      backgroundColor: "#1CED84",
      color: "#1CED84"
    }
  },
  offline: {
    '& .MuiBadge-badge': {
      backgroundColor: "#D0DAE9",
      color: "#D0DAE9"
    }
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '1px solid currentColor',
      content: '""',
    },
  },
}))(Badge);

const UserAvatar = ({username, profilePath = "/", isOnline}) => {
  const classes = useStyles();
  const statusClassNames = clsx({
    [classes.online]: isOnline,
    [classes.offline]: !isOnline
  });

  return (
    <StyledBadge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
      className={statusClassNames}
      >
      <Avatar alt={username} src={profilePath} />
    </StyledBadge>
  );
}

export default UserAvatar;
