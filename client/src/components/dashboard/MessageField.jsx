import React, { useState } from "react";
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { makeStyles, withStyles } from '@material-ui/core/styles';


const useDashboardStyles = makeStyles(theme => ({
  textField: {
    backgroundColor: "#F4F6FA",
    borderColor: "#F4F6FA",
    borderRadius: 8
  },
  input: {
    color: '#9CADC8',
    fontWeight: 600,
    borderRadius: 8,
    height: 70
  },
  adornments: {
    color: '#D1D9E6',
    gap: "10px"
  },
  icons: {
    paddingRight: 10
  }
}));

const CustomTextField = withStyles({
  root: {
    fontWeight: 600,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#F4F6FA',
      },
      '&:hover fieldset': {
        borderColor: '#99A9C4',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#99A9C4',
      },
      '& input::placeholder': {
        color: '#99A9C4'
      }
    }
  }
})(TextField);


export default function MessageField({ setError, sendMessage, activeConversationId }) {
  const classes = useDashboardStyles();
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message) {
      sendMessage(activeConversationId, message);
      setMessage("");
    }
  }

  return (
    <form noValidate autoComplete="off" className={classes.textField} onSubmit={handleSubmit}>
      <CustomTextField
        id="outlined-basic"
        placeholder="Type something..."
        variant="outlined"
        fullWidth
        value={message}
        onInput={ e => setMessage(e.target.value) }
        InputProps={{
          className: classes.input,
          endAdornment: (
            <InputAdornment position="start" className={classes.adornments}>
              <SentimentSatisfiedOutlinedIcon mr={1} />
              <FileCopyOutlinedIcon />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
