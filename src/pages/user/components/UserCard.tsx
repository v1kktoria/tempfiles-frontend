import React from "react";
import { Box, Typography, Chip, IconButton, Tooltip, alpha } from "@mui/material";
import { Edit, Delete, Person, Block, CheckCircle } from "@mui/icons-material";
import { UserDto } from "../../../types/user";

interface UserCardProps {
  user: UserDto;
  loading: boolean;
  onEdit: (user: UserDto) => void;
  onDelete: (id: string) => void;
  onBan: (id: string) => void;
  onUnban: (id: string) => void;
  viewMode: "cards" | "table";
  formatDate: (dateString: string) => string;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  loading,
  onEdit,
  onDelete,
  onBan,
  onUnban,
  viewMode,
  formatDate,
}) => {
  const isTableView = viewMode === "table";

  if (isTableView) {
    return (
      <tr
        style={{
          backgroundColor: user.isBanned ? alpha("#f5f5f5", 0.5) : "inherit",
        }}
      >
        <td style={{ padding: "16px", paddingLeft: "24px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Person color={user.isBanned ? "disabled" : "action"} />
            <Box>
              <Typography fontWeight="500">{user.name || "Без имени"}</Typography>
              <Typography variant="body2" color={user.isBanned ? "text.disabled" : "text.secondary"}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </td>

        <td style={{ padding: "16px" }}>
          <Chip
            label={user.role === "ADMIN" ? "Администратор" : "Пользователь"}
            color={user.role === "ADMIN" ? "primary" : "default"}
            size="small"
            variant="outlined"
          />
        </td>

        <td style={{ padding: "16px" }}>
          <Chip
            label={user.isBanned ? "Заблокирован" : "Активный"}
            color={user.isBanned ? "default" : "success"}
            size="small"
            variant="outlined"
          />
        </td>

        <td style={{ padding: "16px" }}>
          <Typography variant="body2">{formatDate(user.createdAt)}</Typography>
        </td>

        <td style={{ padding: "16px", paddingRight: "24px" }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            {user.isBanned ? (
              <Tooltip title="Разблокировать">
                <IconButton size="small" color="success" onClick={() => onUnban(user.id)} disabled={loading}>
                  <CheckCircle fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Заблокировать">
                <IconButton size="small" color="warning" onClick={() => onBan(user.id)} disabled={loading}>
                  <Block fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="Редактировать">
              <IconButton size="small" onClick={() => onEdit(user)} disabled={loading}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Удалить">
              <IconButton size="small" color="error" onClick={() => onDelete(user.id)} disabled={loading}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </td>
      </tr>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: user.isBanned ? "grey.300" : "divider",
        borderRadius: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: user.isBanned ? "grey.50" : "background.paper",
        position: "relative",
        "&::before": user.isBanned
          ? {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              backgroundColor: "error.main",
            }
          : {},
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <Person color={user.isBanned ? "disabled" : "action"} />
          <Typography fontWeight="600" color={user.isBanned ? "text.disabled" : "text.primary"}>
            {user.name || "Без имени"}
          </Typography>

          <Chip
            label={user.isBanned ? "Заблокирован" : "Активный"}
            color={user.isBanned ? "default" : "success"}
            size="small"
            variant="outlined"
          />

          <Chip
            label={user.role === "ADMIN" ? "Администратор" : "Пользователь"}
            color={user.role === "ADMIN" ? "primary" : "default"}
            size="small"
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color={user.isBanned ? "text.disabled" : "text.secondary"} gutterBottom>
          Email: {user.email}
        </Typography>

        <Typography variant="caption" display="block" color="text.secondary">
          Создан: {formatDate(user.createdAt)}
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          Обновлен: {formatDate(user.updatedAt)}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {user.isBanned ? (
          <Tooltip title="Разблокировать пользователя">
            <IconButton size="small" color="success" onClick={() => onUnban(user.id)} disabled={loading}>
              <CheckCircle />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Заблокировать пользователя">
            <IconButton size="small" color="warning" onClick={() => onBan(user.id)} disabled={loading}>
              <Block />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Редактировать">
          <IconButton size="small" onClick={() => onEdit(user)} disabled={loading}>
            <Edit />
          </IconButton>
        </Tooltip>

        <Tooltip title="Удалить">
          <IconButton size="small" color="error" onClick={() => onDelete(user.id)} disabled={loading}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
