import React from "react";
import { Box, Card, CardContent, Typography, Stack, Chip, IconButton, Tooltip, TextField } from "@mui/material";
import { Folder, ExitToApp, Edit, Save, Cancel, Delete, People } from "@mui/icons-material";
import { useGroupRole } from "../../../shared/hooks/useGroupRole";

interface GroupCardProps {
  group: any;
  isEditing: boolean;
  editData: { name: string; description: string };
  onEditDataChange: (data: { name: string; description: string }) => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onLeaveGroup: () => void;
  onViewFiles: () => void;
  onManageMembers: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  isEditing,
  editData,
  onEditDataChange,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onLeaveGroup,
  onViewFiles,
  onManageMembers,
}) => {
  const { isAdmin } = useGroupRole(group.id);

  return (
    <Card variant="outlined" sx={{ "&:hover": { boxShadow: 2 } }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            {isEditing ? (
              <TextField
                value={editData.name}
                onChange={(e) => onEditDataChange({ ...editData, name: e.target.value })}
                fullWidth
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {group.name}
              </Typography>
            )}

            {isEditing ? (
              <TextField
                value={editData.description}
                onChange={(e) => onEditDataChange({ ...editData, description: e.target.value })}
                multiline
                rows={2}
                fullWidth
                placeholder="Описание группы..."
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {group.description || "Описание отсутствует"}
              </Typography>
            )}

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={isAdmin ? "Администратор" : "Участник"}
                color={isAdmin ? "primary" : "default"}
                size="small"
              />
              <Typography variant="caption" color="text.secondary">
                Создана: {new Date(group.createdAt).toLocaleDateString()}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Просмотреть файлы группы">
              <IconButton size="small" onClick={onViewFiles} color="primary">
                <Folder />
              </IconButton>
            </Tooltip>

            {isAdmin && (
              <>
                <Tooltip title="Участники">
                  <IconButton size="small" onClick={onManageMembers} color="primary">
                    <People />
                  </IconButton>
                </Tooltip>

                {isEditing ? (
                  <>
                    <Tooltip title="Сохранить">
                      <IconButton size="small" color="primary" onClick={onSaveEdit} disabled={!editData.name.trim()}>
                        <Save />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Отмена">
                      <IconButton size="small" onClick={onCancelEdit}>
                        <Cancel />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Редактировать">
                      <IconButton size="small" onClick={onStartEdit}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить группу">
                      <IconButton size="small" color="error" onClick={onDelete}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </>
            )}

            {!isAdmin && (
              <Tooltip title="Покинуть группу">
                <IconButton size="small" color="error" onClick={onLeaveGroup}>
                  <ExitToApp />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
