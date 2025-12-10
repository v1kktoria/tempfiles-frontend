import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Autocomplete,
  Paper,
} from "@mui/material";
import { PersonRemove, ArrowBack, Add } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import {
  fetchGroupById,
  fetchGroupMembers,
  addUserToGroup,
  removeUserFromGroup,
  clearCurrentGroup,
} from "../../store/slices/groupSlice";
import { Layout } from "../../shared/components/Layout";
import { PageContainer } from "../../shared/components/PageContainer";
import { fetchUsers } from "../../store/slices/userSlice";

export default function GroupSettingsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentGroup, members, loading } = useAppSelector((state) => state.groups);
  const { users } = useAppSelector((state) => state.users);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupById(groupId));
      dispatch(fetchGroupMembers(groupId));
      dispatch(fetchUsers());
    }

    return () => {
      dispatch(clearCurrentGroup());
    };
  }, [dispatch, groupId]);

  const handleAddUser = async () => {
    if (!groupId || !selectedUser) return;

    setAddingUser(true);
    try {
      await dispatch(
        addUserToGroup({
          groupId,
          dto: { email: selectedUser.email },
        }),
      ).unwrap();

      setSelectedUser(null);
      dispatch(fetchGroupMembers(groupId));
    } catch (error) {
    } finally {
      setAddingUser(false);
    }
  };

  const handleRemoveUser = async (userId: string, userEmail: string) => {
    if (!groupId) return;

    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${userEmail} из группы?`)) {
      try {
        await dispatch(removeUserFromGroup({ groupId, userId })).unwrap();
        dispatch(fetchGroupMembers(groupId));
      } catch (error) {}
    }
  };

  if (!groupId || (!loading && !currentGroup)) {
    return (
      <Layout>
        <PageContainer>
          <Alert severity="error">Группа не найдена</Alert>
        </PageContainer>
      </Layout>
    );
  }

  const groupMembers = members[groupId] || [];
  const existingUserIds = new Set(groupMembers.map((member: any) => member.userId));
  const availableUsers = users.filter((user) => !existingUserIds.has(user.id));

  return (
    <Layout>
      <PageContainer maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigate("/groups")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="600">
            Участники группы: {currentGroup?.name}
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Добавить участника
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 4 }}>
              <Autocomplete
                options={availableUsers}
                getOptionLabel={(option) => option.email}
                value={selectedUser}
                onChange={(event, newValue) => setSelectedUser(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Выберите пользователя"
                    placeholder="Начните вводить email..."
                    sx={{ minWidth: 300 }}
                  />
                )}
                noOptionsText="Пользователи не найдены"
                disabled={addingUser}
              />

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddUser}
                disabled={!selectedUser || addingUser}
              >
                {addingUser ? <CircularProgress size={16} /> : "Добавить"}
              </Button>
            </Box>

            {availableUsers.length === 0 && groupMembers.length > 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Все пользователи системы уже добавлены в группу
              </Alert>
            )}

            <Typography variant="h6" fontWeight="600" gutterBottom>
              Участники группы ({groupMembers.length})
            </Typography>

            <Stack spacing={2}>
              {groupMembers.map((member: any) => (
                <Paper
                  key={member.userId}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography fontWeight="500">{member.user.email}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                      <Chip
                        label={member.role === "GROUP_ADMIN" ? "Администратор" : "Участник"}
                        color={member.role === "GROUP_ADMIN" ? "primary" : "default"}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Добавлен: {new Date(member.createdAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Box>

                  {member.role !== "GROUP_ADMIN" && (
                    <Tooltip title="Удалить из группы">
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveUser(member.userId, member.user.email)}
                        disabled={loading}
                      >
                        <PersonRemove />
                      </IconButton>
                    </Tooltip>
                  )}
                </Paper>
              ))}

              {groupMembers.length === 0 && (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  В группе пока нет участников
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>
      </PageContainer>
    </Layout>
  );
}
