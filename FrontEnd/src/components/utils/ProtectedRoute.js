import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem("mern-task-management/user"))?.accessToken;
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      console.log("Empty localStorage, redirecting to login");
      navigate("/entry");
    }
  }, []);

  if (isAuthenticated) {
    return <Layout loggedIn={isAuthenticated}>{children}</Layout>;
  } else {
    // If not authenticated, you might want to render something else, like a loading spinner or a message
    return null;
  }
};

export default ProtectedRoute;
