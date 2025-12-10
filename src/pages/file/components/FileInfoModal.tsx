import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Edit, Save, Close, DriveFileRenameOutline } from "@mui/icons-material";
import { FileDto } from "../../../types/file";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/hooks";
import { fetchFileTags } from "../../../store/slices/fileTagSlice";
import { getDaysRemaining } from "../../../shared/utils/dateUtils";

interface FileInfoModalProps {
  open: boolean;
  file: FileDto | null;
  onClose: () => void;
  onUpdate: (id: string, data: { description?: string; filename?: string }) => Promise<void>;
}

type EditMode = "none" | "filename" | "description";

export const FileInfoModal: React.FC<FileInfoModalProps> = ({ open, file, onClose, onUpdate }) => {
  const dispatch = useAppDispatch();
  const { fileTags } = useAppSelector((s) => s.fileTags);
  const [editMode, setEditMode] = useState<EditMode>("none");
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setEditMode("none");
      setEditValue("");
      setLoading(false);
      setError("");
    } else if (file) {
      dispatch(fetchFileTags(file.id));
    }
  }, [open, file, dispatch]);

  if (!file) return null;

  const currentFileTags = fileTags[file.id] || [];

  const handleSave = async () => {
    const currentValue = editMode === "filename" ? file.filename : file.description || "";
    if (!editValue.trim() || editValue === currentValue) {
      setEditMode("none");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = editMode === "filename" ? { filename: editValue } : { description: editValue };
      await onUpdate(file.id, data);
      setEditMode("none");
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode("none");
    setEditValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (editMode === "filename" || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === "Escape") handleCancel();
  };

  const startEditing = (mode: EditMode, value: string) => {
    setEditMode(mode);
    setEditValue(value);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          maxWidth: "90vw",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 3,
            pb: 2,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ flex: 1 }}>
            {editMode === "filename" ? (
              <Box>
                <TextField
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Новое имя файла"
                  fullWidth
                  autoFocus
                  disabled={loading}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading || !editValue.trim() || editValue === file.filename}
                    startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                  >
                    Сохранить
                  </Button>
                  <Button size="small" variant="outlined" onClick={handleCancel} disabled={loading}>
                    Отмена
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" fontWeight="600">
                  {file.filename}
                </Typography>
                <IconButton size="small" onClick={() => startEditing("filename", file.filename)} disabled={loading}>
                  <DriveFileRenameOutline fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Typography variant="body2" color="text.secondary">
              {file.mimeType} • {(Number(file.size) / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mx: 3, mt: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Box sx={{ p: 3, flex: 1, overflow: "auto" }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="600">
                Описание
              </Typography>
              {editMode !== "description" && (
                <IconButton
                  size="small"
                  onClick={() => startEditing("description", file.description || "")}
                  disabled={loading}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Box>

            {editMode === "description" ? (
              <Box>
                <TextField
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Введите описание файла"
                  fullWidth
                  multiline
                  rows={3}
                  disabled={loading}
                  autoFocus
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading || !editValue.trim() || editValue === (file.description || "")}
                    startIcon={loading ? <CircularProgress size={16} /> : <Save />}
                  >
                    Сохранить
                  </Button>
                  <Button size="small" variant="outlined" onClick={handleCancel} disabled={loading}>
                    Отмена
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minHeight: "4.5em",
                }}
              >
                {file.description || "Описание отсутствует"}
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Теги
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {currentFileTags.map((tag) => (
                <Chip key={tag.id} label={tag.name} size="small" color="primary" variant="outlined" />
              ))}
              {currentFileTags.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Теги не добавлены
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Информация о файле
            </Typography>
            <Box sx={{ display: "grid", gap: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Срок хранения:
                </Typography>
                <Typography variant="body2" fontWeight="500">
                  {getDaysRemaining(file.expiresAt)}
                  {file.expiresAt && (
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      (до {new Date(file.expiresAt).toLocaleDateString()})
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Создан:
                </Typography>
                <Typography variant="body2">{new Date(file.createdAt).toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Изменен:
                </Typography>
                <Typography variant="body2">{new Date(file.updatedAt).toLocaleString()}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" onClick={onClose}>
            Закрыть
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
