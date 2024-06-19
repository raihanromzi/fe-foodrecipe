import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import { Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Button, Drawer, Hidden, Link } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../public/svg/logo.svg";
import daftarResepMakananIcon from "../public/svg/DaftarResepMakanan.svg";
import resepSayaIcon from "../public/svg/ResepSaya.svg";
import resepFavoritIcon from "../public/svg/ResepFavorit.svg";
import signOutIcon from "../public/svg/SignOut.svg";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const [anchorElUser, setAnchorElUser] = useState(null);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    toast.success("Sign out berhasil");
    setTimeout(() => {
      navigate("/");
      localStorage.clear();
    }, 100);
  };

  const location = useLocation();
  const path = location.pathname;

  const isOnDaftarResep = path.startsWith("/daftar-resep");
  const isOnResepSaya = path.startsWith("/resep-saya");
  const isOnResepFavorit = path.startsWith("/resep-favorit");

  return (
    <AppBar
      position="static"
      style={{ background: "#F49881", boxShadow: "none" }}>
      <Toolbar>
        <Box
          display="flex"
          justifyContent="space-between"
          width={{ xs: "100%", md: "80%" }}
          marginX="auto">
          <Link
            href="/daftar-resep"
            sx={{
              color: "inherit",
              textDecoration: "none",
            }}>
            <Box display="flex" gap={1}>
              <Hidden mdUp>
                <img src={logo} alt="logo" style={{ width: "35px" }} />
              </Hidden>
              <Hidden mdDown>
                <img src={logo} alt="logo" style={{ width: "48px" }} />
              </Hidden>
              <Typography
                sx={{
                  marginY: "auto",
                  fontSize: { xs: "16px", md: "24px" },
                  fontWeight: 700,
                }}>
                Buku Resep 79
              </Typography>
            </Box>
          </Link>
          {/* Drawer Navbar Mobile */}
          <Box component="div" display={{ xs: "flex", md: "none" }}>
            <IconButton onClick={toggleDrawer} color="inherit">
              <Box sx={{ display: "flex", gap: "5px" }}>
                <MenuIcon />
              </Box>
            </IconButton>
            <Drawer
              anchor="right"
              open={isOpen}
              onClose={toggleDrawer}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "75%",
                },
                display: { xs: "block", md: "none" },
              }}>
              <Box
                sx={{
                  backgroundColor: "#F49881",
                  padding: "10px",
                  height: "100vh",
                }}>
                <Box
                  sx={{
                    display: { xs: "flex", md: "none" },
                    justifyContent: "flex-end",
                  }}>
                  <IconButton open={isOpen} onClick={toggleDrawer}>
                    <CloseIcon sx={{ color: "white" }} />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    marginTop: 3,
                  }}>
                  <Button
                    href="/daftar-resep"
                    sx={{
                      textTransform: "none",
                      color: isOnDaftarResep ? "#01BFBF" : "white",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}>
                    <img
                      src={daftarResepMakananIcon}
                      alt="Daftar Resep Makanan"
                      style={{ marginRight: 5 }}
                    />
                    Daftar Resep Makanan
                  </Button>
                  <Button
                    href="/resep-saya"
                    sx={{
                      textTransform: "none",
                      color: isOnResepSaya ? "#01BFBF" : "white",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}>
                    <img
                      src={resepSayaIcon}
                      alt="Resep Saya"
                      style={{ marginRight: 5 }}
                    />
                    Resep Saya
                  </Button>
                  <Button
                    href="/resep-favorit"
                    sx={{
                      textTransform: "none",
                      color: isOnResepFavorit ? "#01BFBF" : "white",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}>
                    <img
                      src={resepFavoritIcon}
                      alt="Resep Favorit"
                      style={{ marginRight: 5 }}
                    />
                    Resep Favorit
                  </Button>
                  <Button
                    onClick={handleLogout}
                    sx={{
                      textTransform: "none",
                      color: "white",
                      fontSize: "14px",
                      fontWeight: "700",
                    }}>
                    <img
                      src={signOutIcon}
                      alt="Sign Out"
                      style={{ marginRight: 5 }}
                    />
                    Sign Out
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </Box>
          {/* End of Drawer Navbar Mobile */}

          {/* List Menu Desktop */}
          <Box display={{ xs: "none", md: "flex" }} gap={{ xs: 0, md: 5 }}>
            <Link
              href="/daftar-resep"
              sx={{
                color: "inherit",
                textDecoration: "none",
                marginY: "auto",
              }}>
              <Typography
                sx={{
                  fontWeight: "700",
                  color: isOnDaftarResep ? "#01BFBF" : "white",
                }}>
                Daftar Resep Masakan
              </Typography>
            </Link>
            <Link
              href="/resep-saya"
              sx={{
                color: isOnResepSaya ? "#01BFBF" : "white",
                textDecoration: "none",
                marginY: "auto",
              }}>
              <Typography sx={{ fontWeight: "700" }}>Resep Saya</Typography>
            </Link>
            <Link
              href="/resep-favorit"
              sx={{
                color: isOnResepFavorit ? "#01BFBF" : "white",
                textDecoration: "none",
                marginY: "auto",
              }}>
              <Typography sx={{ fontWeight: "700" }}>Resep Favorit</Typography>
            </Link>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu}>
                  <AccountCircleIcon
                    sx={{ fontSize: "40px", color: "white" }}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}>
                <MenuItem onClick={handleLogout}>
                  <Box display="flex" gap={1}>
                    <ExitToAppIcon />
                    <Typography textAlign="center">Sign Out</Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          {/* End of List Menu Desktop */}
        </Box>
      </Toolbar>
      <Toaster />
    </AppBar>
  );
};

export default Navbar;
