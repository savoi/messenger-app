import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    button: {
      fontWeight: 600,
      textTransform: 'none'
    },
    fontFamily: [
      '"Open Sans"',
      'sans-serif'
    ].join(','),
    fontSize: 14,
    fontWeight: 600
  },
  palette: {
    primary: {
      main: "#3A8DFF"
    }
  }
});
