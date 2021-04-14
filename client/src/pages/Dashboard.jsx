import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";

function useLogout() {
  const logout = async () => {
    const response = await fetch('/logout', {method: 'POST'})
    const jsonResponse = await response.json();
    if (!response.ok) {
      throw new Error(jsonResponse.error.message);
    }
    return jsonResponse;
  };
  return logout;
}

export default function Dashboard() {
  const history = useHistory();

  const logout = useLogout();

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) history.push("/signup");
  }, [history]);

  return (
    <Paper>
        <CssBaseline>
        {/* For testing purposes right now, ignore styling */}
        <p>Dashboard</p>
        <p>User: {JSON.stringify(localStorage.getItem("user"))}</p>
        <Button
          onClick={() => {
            logout().then((response) => {
              localStorage.removeItem("user");
              history.push("/login");
            },
            (error) => {}
          );
          }}
        >
          Logout
        </Button>
      </CssBaseline>
    </Paper>
  );
}
