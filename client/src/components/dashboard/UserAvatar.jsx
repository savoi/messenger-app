import React from "react";
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';


const UserAvatar = ({username, profilePath = "/", isOnline}) => {
  const statusColor = isOnline ? '#1CED84' : '#D0DAE9';
  const StyledBadge = withStyles((theme) => ({
    badge: {
      backgroundColor: statusColor,
      color: statusColor,
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

  return (
    <StyledBadge
      overlap="circle"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      variant="dot"
      >
      <Avatar alt={username} src={profilePath} />
    </StyledBadge>
  );
}

export default UserAvatar;
