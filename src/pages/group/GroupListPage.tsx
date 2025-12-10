import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import { CloudUpload, Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { fetchMyGroups, leaveGroup, updateGroup, deleteGroup, createGroup } from "../../store/slices/groupSlice";
import { Layout } from "../../shared/components/Layout";
import { PageContainer } from "../../shared/components/PageContainer";
import { useNavigate } from "react-router-dom";
import { GroupCard } from "./components/GroupCard";

export default function GroupsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { groups, loading } = useAppSelector((state) => state.groups);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [newGroupData, setNewGroupData] = useState({ name: "", description: "" });

  useEffect(() => {
    dispatch(fetchMyGroups());
  }, [dispatch]);

  const handleUploadFile = () => navigate("/files/upload");
  const handleViewGroupFiles = (groupId: string) => navigate(`/files?group=${groupId}`);
  const handleManageMembers = (groupId: string) => navigate(`/groups/${groupId}/settings`);

  const handleCreateGroup = async () => {
    try {
      await dispatch(createGroup(newGroupData)).unwrap();
      setNewGroupData({ name: "", description: "" });
      setCreateModalOpen(false);
    } catch (error) {}
  };

  const handleStartEdit = (group: any) => {
    setEditingGroup(group.id);
    setEditData({ name: group.name, description: group.description || "" });
  };

  const handleSaveEdit = async (groupId: string) => {
    try {
      await dispatch(updateGroup({ id: groupId, dto: editData })).unwrap();
      setEditingGroup(null);
    } catch (error) {}
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditData({ name: "", description: "" });
  };

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить группу "${groupName}"?`)) {
      try {
        await dispatch(deleteGroup(groupId)).unwrap();
      } catch (error) {}
    }
  };

  const handleLeaveGroup = async (groupId: string, groupName: string) => {
    if (window.confirm(`Вы уверены, что хотите покинуть группу "${groupName}"?`)) {
      try {
        await dispatch(leaveGroup(groupId)).unwrap();
      } catch (error: any) {
        alert(error.message || "Не удалось покинуть группу");
      }
    }
  };

  return (
    <Layout>
      <PageContainer maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="600">
            Мои группы
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)}>
              Создать группу
            </Button>
            <Button variant="outlined" startIcon={<CloudUpload />} onClick={handleUploadFile}>
              Загрузить файл
            </Button>
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && groups.length === 0 && (
          <Paper sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary" gutterBottom>
              У вас пока нет групп
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Создайте свою первую группу для совместной работы
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)}>
              Создать группу
            </Button>
          </Paper>
        )}

        {!loading && groups.length > 0 && (
          <Box sx={{ display: "grid", gap: 2 }}>
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                isEditing={editingGroup === group.id}
                editData={editData}
                onEditDataChange={setEditData}
                onStartEdit={() => handleStartEdit(group)}
                onSaveEdit={() => handleSaveEdit(group.id)}
                onCancelEdit={handleCancelEdit}
                onDelete={() => handleDeleteGroup(group.id, group.name)}
                onLeaveGroup={() => handleLeaveGroup(group.id, group.name)}
                onViewFiles={() => handleViewGroupFiles(group.id)}
                onManageMembers={() => handleManageMembers(group.id)}
              />
            ))}
          </Box>
        )}

        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Создать группу</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Название группы *"
                value={newGroupData.name}
                onChange={(e) => setNewGroupData({ ...newGroupData, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Описание"
                value={newGroupData.description}
                onChange={(e) => setNewGroupData({ ...newGroupData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)}>Отмена</Button>
            <Button onClick={handleCreateGroup} variant="contained" disabled={!newGroupData.name.trim()}>
              Создать
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </Layout>
  );
}
