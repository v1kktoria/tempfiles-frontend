import React, { useState, useMemo, useCallback } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  ListItem,
} from "@mui/material";
import { CloudUpload, Link, Storage, People, ChevronLeft, ChevronRight, Label, Groups } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const menuItems = useMemo(
    () => [
      { text: "Файлы", icon: <Storage />, path: "/files" },
      { text: "Загрузить файл", icon: <CloudUpload />, path: "/files/upload" },
      { text: "Ссылки", icon: <Link />, path: "/links" },
      { text: "Создать ссылку", icon: <Link />, path: "/links/create" },
      { text: "Группы", icon: <Groups />, path: "/groups" },
      ...(isAdmin
        ? [
            { text: "Пользователи", icon: <People />, path: "/users" },
            { text: "Теги", icon: <Label />, path: "/tags" },
          ]
        : []),
    ],
    [isAdmin],
  );

  const handleMenuClick = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const currentDrawerWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${currentDrawerWidth}px)`,
          ml: `${currentDrawerWidth}px`,
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            TempFiles Service
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: currentDrawerWidth,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
          },
        }}
        open
      >
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: collapsed ? "center" : "space-between",
              alignItems: "center",
              minHeight: "64px !important",
            }}
          >
            {!collapsed && (
              <Typography variant="h6" noWrap component="div">
                TempFiles
              </Typography>
            )}
            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                color: "inherit",
                ...(collapsed && { mx: "auto" }),
              }}
            >
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Toolbar>

          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => {
              const isSelected = location.pathname === item.path;
              return (
                <ListItem
                  key={item.text}
                  onClick={() => handleMenuClick(item.path)}
                  sx={{
                    cursor: "pointer",
                    color: "inherit",
                    backgroundColor: isSelected ? theme.palette.action.selected : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 1 : 2,
                    minHeight: 48,
                  }}
                  title={collapsed ? item.text : ""}
                >
                  <ListItemIcon
                    sx={{
                      color: isSelected ? theme.palette.primary.main : "inherit",
                      minWidth: collapsed ? "auto" : 56,
                      justifyContent: "center",
                      mr: collapsed ? 0 : 2,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: isSelected ? 600 : 400,
                        },
                        opacity: collapsed ? 0 : 1,
                        transition: "opacity 0.2s",
                      }}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${currentDrawerWidth}px)`,
          ml: `${currentDrawerWidth}px`,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
