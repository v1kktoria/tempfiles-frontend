import React from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from "@mui/material";
import { UpdateUserDto, UserDto } from "../../../types/user";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserDto) => void;
  loading: boolean;
  user?: UserDto | null;
  mode: "edit";
}

export const UserModal: React.FC<UserModalProps> = ({ open, onClose, onSubmit, loading, user, mode }) => {
  const [formData, setFormData] = React.useState({
    name: user?.name || "",
    role: user?.role || "USER",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        role: user.role || "USER",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      const updateData: UpdateUserDto = {
        name: formData.name,
        role: formData.role,
      };
      onSubmit(updateData);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 1,
          p: 3,
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="600">
          Редактировать пользователя
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Имя"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Роль</InputLabel>
              <Select
                value={formData.role}
                label="Роль"
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <MenuItem value="USER">Пользователь</MenuItem>
                <MenuItem value="ADMIN">Администратор</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={onClose} disabled={loading}>
                Отмена
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Сохранение..." : "Обновить"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};
