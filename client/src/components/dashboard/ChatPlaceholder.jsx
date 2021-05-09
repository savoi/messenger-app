import ChatIcon from '@material-ui/icons/Chat';
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  chatCard: {
    color: "#91A3C0"
  },
  paper: {
    padding: theme.spacing(3),
    margin: "auto",
    backgroundColor: "#F4F6FA",
    borderRadius: 8
  }
}));

export default function ChatPlaceholder() {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.paper}>
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid item>
          <ChatIcon fontSize="large" className={classes.chatCard} />
        </Grid>
        <Grid item>
          <Typography variant="h5" className={classes.chatCard}>Start Chatting Now!</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
