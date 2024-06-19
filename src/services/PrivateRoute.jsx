import { Outlet } from "react-router-dom";
import useToken from "./AuthProvider";

function PrivateRoute() {
  const { token } = useToken();

  return token ? <Outlet /> : null;
}

export default PrivateRoute;
