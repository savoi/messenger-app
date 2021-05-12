import ChatIcon from '@material-ui/icons/Chat';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  title: {
    color: "#91A3C0"
  }
}));

export default function ChatPlaceholder() {
  const classes = useStyles();

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item>
        <ChatIcon fontSize="large" className={classes.title} />
      </Grid>
      <Grid item>
        <Typography variant="h5" className={classes.title}>Start Chatting Now!</Typography>
      </Grid>
    </Grid>
  );
}
