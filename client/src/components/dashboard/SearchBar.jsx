import React, { useEffect, useState } from "react";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getJson } from "api/APIUtils";


const useDashboardStyles = makeStyles(theme => ({
  userSearch: {
    backgroundColor: "#E9EEF9",
    borderColor: "#E9EEF9",
    borderRadius: 4,
    marginTop: 15
  },
  input: {
    color: '#99A9C4',
    fontWeight: 600
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


export default function SearchBar() {
  const classes = useDashboardStyles();
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query) {
      getJson(`/users?search=${query}`)
      .then(response => {
        console.log(response);
      }).catch(err => {
        setError(err.message);
        console.log(err.message);
      });
    }
  }, [query]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  }

  return (
    <form noValidate autoComplete="off" className={classes.userSearch}>
      <CustomTextField
        id="outlined-basic"
        placeholder="Search"
        variant="outlined"
        fullWidth
        onChange={handleChange}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start" className={classes.adornment}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
}
