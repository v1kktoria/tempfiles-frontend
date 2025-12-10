import React from "react";
import { Card, CardContent, CardActions, Typography, Box, CircularProgress, Paper, Tooltip } from "@mui/material";
import { FileDto } from "../../../types/file";
import { getDaysRemaining } from "../../../shared/utils/dateUtils";
import { FileActions } from "./FileActions";
import { FileTags } from "./FileTags";

interface FileListSectionProps {
  files: FileDto[];
  loading: boolean;
  onFileInfo: (file: FileDto) => void;
  onFileDelete: (id: string) => Promise<void>;
}

export const FileListSection: React.FC<FileListSectionProps> = ({ files, loading, onFileInfo, onFileDelete }) => {
  if (loading)
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );

  if (files.length === 0)
    return (
      <Card>
        <CardContent>
          <Paper sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">Файлы не найдены</Typography>
          </Paper>
        </CardContent>
      </Card>
    );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="600">
          Загруженные файлы
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 }}>
          {files.map((file) => (
            <FileCard key={file.id} file={file} onInfo={onFileInfo} onDelete={onFileDelete} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const FileCard: React.FC<{
  file: FileDto;
  onInfo: (file: FileDto) => void;
  onDelete: (id: string) => Promise<void>;
}> = ({ file, onInfo, onDelete }) => {
  const expiryTooltipText = file.expiresAt
    ? `Истекает: ${new Date(file.expiresAt).toLocaleDateString()}`
    : "Бессрочное хранение";

  return (
    <Card variant="outlined" sx={{ "&:hover": { boxShadow: 2 } }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography fontWeight="600" noWrap gutterBottom>
          {file.filename}
        </Typography>

        <Tooltip title={file.description || ""}>
          <Typography variant="body2" color="text.secondary" noWrap gutterBottom>
            {file.description || "Без описания"}
          </Typography>
        </Tooltip>

        <FileTags file={file} />

        <Tooltip title={expiryTooltipText}>
          <Typography variant="caption" color="text.secondary" sx={{ cursor: "help" }}>
            Срок: {getDaysRemaining(file.expiresAt)}
          </Typography>
        </Tooltip>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0, px: 2, pb: 1 }}>
        <FileActions file={file} onInfo={onInfo} onDelete={onDelete} />
      </CardActions>
    </Card>
  );
};
