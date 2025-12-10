import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, Stack, Alert, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/hooks";
import { clearError, createGroup } from "../../../store/slices/groupSlice";

interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ open, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.groups);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(createGroup(formData)).unwrap();
      setFormData({ name: "", description: "" });
      onSuccess?.();
      onClose();
    } catch (error) {}
  };

  const handleClose = () => {
    setFormData({ name: "", description: "" });
    dispatch(clearError());
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Создать группу
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Название группы"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              multiline
              rows={3}
              fullWidth
              disabled={loading}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleClose} disabled={loading} variant="outlined">
                Отмена
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !formData.name.trim()}
                startIcon={loading ? <CircularProgress size={16} /> : null}
              >
                Создать
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
