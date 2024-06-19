import { Routes, Route, useLocation } from "react-router-dom";
import DaftarResepMasakan from "../pages/DaftarResepMasakan";
import DetailResep from "../pages/DetailResep";
import ResepSaya from "../pages/DaftarResepMasakanSaya";
import ResepFavorit from "../pages/ResepFavorit";
import TambahResep from "../pages/TambahResep";
import EditResep from "../pages/EditResep";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "../services/PrivateRoute";

import Navbar from "../components/Navbar";

function Layout() {
  const location = useLocation();
  const path = location.pathname;

  const isLogin = path === "/";
  const isRegister = path === "/signup";

  return (
    <>
      {isLogin || isRegister ? <></> : <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/*" element={<PrivateRoute />}>
          <Route path="tambah-resep" element={<TambahResep />} />
          <Route path="daftar-resep" element={<DaftarResepMasakan />} />
          <Route
            path="daftar-resep/detail-resep/:id"
            element={<DetailResep />}
          />
          <Route path="resep-saya" element={<ResepSaya />} />
          <Route path="resep-saya/detail-resep/:id" element={<DetailResep />} />
          <Route path="resep-saya/edit-resep/:id" element={<EditResep />} />
          <Route path="resep-favorit" element={<ResepFavorit />} />
          <Route
            path="resep-favorit/detail-resep/:id"
            element={<DetailResep />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default Layout;
