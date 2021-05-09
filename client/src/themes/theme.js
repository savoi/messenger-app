import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    subtitle2: {
      fontWeight: 600
    },
    button: {
      fontWeight: 600,
      textTransform: 'none'
    },
    fontFamily: [
      '"Open Sans"',
      'sans-serif'
    ].join(','),
    h6: {
      fontWeight: 600
    },
    fontSize: 14,
    fontWeight: 600
  },
  palette: {
    primary: {
      main: "#3A8DFF"
    },
    online: {
      main: "#1CED84"
    }
  }
});
