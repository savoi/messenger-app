import React, { useEffect, useState } from "react";
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getJson, postMessage } from "api/APIUtils";


const useDashboardStyles = makeStyles(theme => ({
  textField: {
    backgroundColor: "#F4F6FA",
    borderColor: "#F4F6FA",
    borderRadius: 8,
    marginTop: 15
  },
  input: {
    color: '#9CADC8',
    fontWeight: 600,
    borderRadius: 8,
    height: 70
  },
  adornment: {
    color: '#B1C3DF'
  }
}));

const CustomTextField = withStyles({
  root: {
    fontWeight: 600,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E9EEF9',
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


export default function MessageField({ activeUser }) {
  const classes = useDashboardStyles();
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message) {
      postMessage(message, activeUser)
      .then(response => {
        console.log(response);
        setMessage("");
      }).catch(err => {
        setError(err.message);
        console.log(err.message);
      });
    }
  }

  return (
    <Container>
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
              <InputAdornment position="start" className={classes.adornment}>
                <SentimentSatisfiedOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Container>
  );
}
