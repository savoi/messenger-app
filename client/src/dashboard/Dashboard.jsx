import React, { useContext } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { UserContext } from '../common/UserContext';
import useAuth from './../common/useAuth';


export default function Dashboard() {
  const { user } = useContext(UserContext);
  const { logoutUser } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  }

  return (
    <Paper>
        <p>Dashboard</p>
        <p>User: {user}</p>
        <Button onClick={handleLogout}>
          Logout
        </Button>
    </Paper>
  );
}
