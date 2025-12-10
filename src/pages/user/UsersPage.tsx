import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, ViewModule, ViewList } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { useAuth } from "../../shared/hooks/useAuth";
import { PageContainer } from "../../shared/components/PageContainer";
import { fetchUsers, updateUser, deleteUser, banUser, unbanUser, clearError } from "../../store/slices/userSlice";
import { UserDto, UpdateUserDto } from "../../types/user";
import { UserModal } from "./components/UserModal";
import { Layout } from "../../shared/components/Layout";
import { UserCard } from "./components/UserCard";

type ViewMode = "cards" | "table";

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((s) => s.users);
  const { isAdmin } = useAuth();
  const initialized = useRef(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role?.toLowerCase().includes(query),
    );
  }, [users, searchQuery]);

  const handleUpdateUser = async (userData: UpdateUserDto) => {
    if (editingUser) {
      await dispatch(updateUser({ id: editingUser.id, data: userData })).unwrap();
      setModalOpen(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      await dispatch(deleteUser(id)).unwrap();
    }
  };

  const handleBanUser = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите забанить этого пользователя?")) {
      await dispatch(banUser(id)).unwrap();
    }
  };

  const handleUnbanUser = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите разбанить этого пользователя?")) {
      await dispatch(unbanUser(id)).unwrap();
    }
  };

  const handleEditUser = (user: UserDto) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <PageContainer maxWidth="lg">
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 2,
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Управление пользователями
              </Typography>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                  size="small"
                  placeholder="Поиск по имени или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 250 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={(e, newViewMode) => newViewMode && setViewMode(newViewMode)}
                  size="small"
                >
                  <ToggleButton value="cards">
                    <ViewModule />
                  </ToggleButton>
                  <ToggleButton value="table">
                    <ViewList />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Box>

            {filteredUsers.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                {searchQuery ? "Пользователи не найдены" : "Пользователи не найдены"}
              </Typography>
            ) : viewMode === "cards" ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    loading={loading}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    onBan={handleBanUser}
                    onUnban={handleUnbanUser}
                    viewMode={viewMode}
                    formatDate={formatDate}
                  />
                ))}
              </Box>
            ) : (
              <Card>
                <CardContent sx={{ p: 0 }}>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "600", pl: 3, width: "35%" }}>Пользователь</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>Роль</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>Статус</TableCell>
                          <TableCell sx={{ fontWeight: "600" }}>Создан</TableCell>
                          <TableCell sx={{ fontWeight: "600", pr: 3, width: "20%" }}>Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <UserCard
                            key={user.id}
                            user={user}
                            loading={loading}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            onBan={handleBanUser}
                            onUnban={handleUnbanUser}
                            viewMode={viewMode}
                            formatDate={formatDate}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <UserModal
          open={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleUpdateUser}
          loading={loading}
          user={editingUser}
          mode="edit"
        />

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => dispatch(clearError())}>
          <Alert severity="error" onClose={() => dispatch(clearError())}>
            {error}
          </Alert>
        </Snackbar>
      </PageContainer>
    </Layout>
  );
};
