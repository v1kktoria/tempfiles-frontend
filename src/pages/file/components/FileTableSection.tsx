import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { FileDto } from "../../../types/file";
import { getDaysRemaining } from "../../../shared/utils/dateUtils";
import { FileActions } from "./FileActions";
import { FileTags } from "./FileTags";

interface FileTableSectionProps {
  files: FileDto[];
  loading: boolean;
  onFileInfo: (file: FileDto) => void;
  onFileDelete: (id: string) => Promise<void>;
}

export const FileTableSection: React.FC<FileTableSectionProps> = ({ files, loading, onFileInfo, onFileDelete }) => {
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
      <CardContent sx={{ p: 0 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", pl: 3 }}>Имя файла</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Описание</TableCell>
                <TableCell sx={{ fontWeight: "600", width: "200px" }}>Теги</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Срок хранения</TableCell>
                <TableCell sx={{ fontWeight: "600", pr: 3 }}>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.id}
                  hover
                  sx={{ cursor: "pointer", "&:last-child td, &:last-child th": { border: 0 } }}
                  onClick={() => onFileInfo(file)}
                >
                  <TableCell component="th" scope="row" sx={{ pl: 3 }}>
                    <Typography fontWeight="500">{file.filename}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.mimeType}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Tooltip title={file.description || ""}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "200px",
                        }}
                      >
                        {file.description || "—"}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <FileTags file={file} />
                  </TableCell>

                  <TableCell>
                    <Tooltip
                      title={
                        file.expiresAt ? `Истекает: ${new Date(file.expiresAt).toLocaleDateString()}` : "Бессрочно"
                      }
                    >
                      <Typography variant="body2">{getDaysRemaining(file.expiresAt)}</Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell sx={{ pr: 3 }} onClick={(e) => e.stopPropagation()}>
                    <FileActions file={file} onInfo={onFileInfo} onDelete={onFileDelete} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
