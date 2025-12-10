import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  Snackbar,
} from "@mui/material";
import { Add, Label } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { createTag, deleteTag, fetchTags } from "../../store/slices/tagSlice";
import { useAuth } from "../../shared/hooks/useAuth";
import { PageContainer } from "../../shared/components/PageContainer";
import { useEffect } from "react";
import { Layout } from "../../shared/components/Layout";

export default function TagsPage() {
  const dispatch = useAppDispatch();
  const { tags, loading, error } = useAppSelector((s) => s.tags);
  const { isAdmin } = useAuth();

  const [newTagName, setNewTagName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  if (!isAdmin) {
    return null;
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await dispatch(createTag({ name: newTagName.trim() })).unwrap();
      setNewTagName("");
      setDialogOpen(false);
      setSuccessMessage("Тег успешно создан");
    } catch (error) {}
  };

  const handleDeleteTag = async (tagId: string, tagName: string) => {
    if (window.confirm(`Удалить тег "${tagName}"?`)) {
      try {
        await dispatch(deleteTag(tagId)).unwrap();
        setSuccessMessage("Тег успешно удален");
      } catch (error) {}
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMessage("");
  };

  return (
    <Layout>
      <PageContainer maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Управление тегами
          </Typography>
          <Button startIcon={<Add />} variant="contained" onClick={() => setDialogOpen(true)}>
            Добавить тег
          </Button>
        </Box>

        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>

        <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={handleCloseSuccess}>
          <Alert severity="success" onClose={handleCloseSuccess}>
            {successMessage}
          </Alert>
        </Snackbar>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Все теги ({tags.length})
            </Typography>

            {tags.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Label sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Тегов пока нет
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Создайте первый тег для организации файлов
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    label={tag.name}
                    onDelete={() => handleDeleteTag(tag.id, tag.name)}
                    color={(tag.color as any) || "primary"}
                    variant="outlined"
                    size="medium"
                    sx={{
                      fontSize: "1rem",
                      py: 2,
                      "& .MuiChip-label": {
                        px: 2,
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Создать новый тег</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="Название тега"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              fullWidth
              sx={{ mt: 1 }}
              placeholder="например: work, important, temp"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleCreateTag();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleCreateTag} variant="contained" disabled={!newTagName.trim() || loading}>
              Создать
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </Layout>
  );
}
