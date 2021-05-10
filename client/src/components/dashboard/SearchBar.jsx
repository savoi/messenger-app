import React, { useEffect, useState } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { getJson } from "api/APIUtils";
import useDebounce from "hooks/useDebounce";


const useStyles = makeStyles(theme => ({
  userSearch: {
    backgroundColor: "#E9EEF9",
    borderColor: "#E9EEF9",
    borderRadius: 4
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


export default function SearchBar({ setError }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    let active = true;

    if (!loading) {
      return "";
    }

    if (debouncedQuery && active) {
      getJson(`/users?search=${debouncedQuery}`)
      .then(response => {
        setOptions(response.map((user) => user.username));
      }).catch(err => {
        setError(err.message);
      });
    }

    return () => {
      active = false;
    };
  }, [loading, debouncedQuery, setError]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  }

  return (
    <form noValidate autoComplete="off" className={classes.userSearch}>
    <Autocomplete
      id="autocomplete-bar"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      getOptionSelected={(option, value) => option === value}
      options={options}
      filterOptions={(x) => x}
      loading={loading}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          variant="outlined"
          placeholder="Search"
          fullWidth
          onChange={handleChange}
          InputProps={{
            className: classes.input,
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start" className={classes.adornment}>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    </form>
  );
}
