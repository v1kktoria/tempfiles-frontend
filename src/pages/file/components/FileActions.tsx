import React, { useState } from "react";
import { Box, IconButton, Tooltip, CircularProgress } from "@mui/material";
import { Delete, Info, Download } from "@mui/icons-material";
import { FileDto } from "../../../types/file";
import { getFileDownloadUrlApi } from "../../../api/fileApi";

export const FileActions: React.FC<{
  file: FileDto;
  onInfo: (file: FileDto) => void;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}> = ({ file, onInfo, onDelete, loading = false }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const downloadUrl = await getFileDownloadUrlApi(file.id);
      window.open(downloadUrl, "_blank");
    } catch (error) {
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    await onDelete(file.id);
  };

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      <Tooltip title="Скачать">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          disabled={loading || downloading}
          color="primary"
        >
          {downloading ? <CircularProgress size={16} /> : <Download fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Подробнее">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onInfo(file);
          }}
          disabled={loading}
        >
          <Info fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Удалить">
        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={loading}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
