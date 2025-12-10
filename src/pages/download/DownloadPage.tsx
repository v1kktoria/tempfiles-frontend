import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, Box, Stack, Divider, IconButton } from "@mui/material";
import { Download, InsertDriveFile, Schedule, Delete, Edit } from "@mui/icons-material";
import { LinkDto } from "../../types/link";
import { getLinkDetailsApi, getDownloadUrlApi } from "../../api/linkApi";
import { useAuth } from "../../shared/hooks/useAuth";
import { useAppDispatch } from "../../shared/hooks/hooks";
import { deleteFile, updateFile } from "../../store/slices/fileSlice";
import { FileInfoModal } from "../file/components/FileInfoModal";

export const DownloadPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const dispatch = useAppDispatch();

  const isAdmin = useAuth();

  const [link, setLink] = useState<LinkDto | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || isFetchingRef.current) return;

      isFetchingRef.current = true;

      try {
        const linkData = await getLinkDetailsApi(token);
        const url = await getDownloadUrlApi(token);

        setLink(linkData);
        setDownloadUrl(url);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchData();
  }, [token]);

  const handleDownload = () => {
    if (downloadUrl) window.open(downloadUrl, "_blank");
  };

  const handleUpdateFile = async (id: string, data: { description?: string; filename?: string }) => {
    await dispatch(updateFile({ id, data })).unwrap();

    setLink((prev) =>
      prev
        ? {
            ...prev,
            file: {
              ...prev.file,
              ...data,
            },
          }
        : prev,
    );
  };

  const handleDelete = async () => {
    if (!link) return;
    if (!window.confirm("Удалить файл?")) return;

    try {
      await dispatch(deleteFile(link.file.id)).unwrap();
      alert("Файл удалён");
    } catch {
      alert("Ошибка удаления");
    }
  };

  if (!link) return <div>Загрузка...</div>;

  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 3,
            pb: 4,
            position: "relative",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            {isAdmin && (
              <IconButton size="small" sx={{ color: "white" }} onClick={() => setOpenModal(true)}>
                <Edit fontSize="medium" />
              </IconButton>
            )}

            {isAdmin && (
              <IconButton size="small" sx={{ color: "white" }} onClick={handleDelete}>
                <Delete fontSize="medium" />
              </IconButton>
            )}
          </Box>

          <InsertDriveFile sx={{ fontSize: 48, mb: 2 }} />

          <Typography variant="h4" fontWeight="600">
            {link.file.filename}
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" fontWeight="600">
                Информация о файле
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Тип файла:</Typography>
                  <Typography fontWeight="500">{link.file.mimeType}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Размер:</Typography>
                  <Typography fontWeight="500">{(Number(link.file.size) / 1024 / 1024).toFixed(2)} MB</Typography>
                </Box>

                {link.file.description && (
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Описание:
                    </Typography>
                    <Typography sx={{ fontStyle: "italic" }}>{link.file.description}</Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight="600" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Schedule /> Информация о ссылке
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Создана:</Typography>
                  <Typography fontWeight="500">{new Date(link.createdAt).toLocaleString()}</Typography>
                </Box>

                {link.expiresAt && (
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography color={isExpired ? "error" : "text.secondary"}>Истекает:</Typography>
                    <Typography fontWeight="500" color={isExpired ? "error" : "text.primary"}>
                      {new Date(link.expiresAt).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>

            <Box sx={{ textAlign: "center", pt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleDownload}
                sx={{ px: 4, py: 1.5, fontSize: "1rem", borderRadius: 2 }}
              >
                Скачать файл
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <FileInfoModal
        open={openModal}
        file={link.file}
        onClose={() => setOpenModal(false)}
        onUpdate={handleUpdateFile}
      />
    </Container>
  );
};
