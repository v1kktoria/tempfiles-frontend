import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Autocomplete,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, InsertLink, CalendarToday, ContentCopy } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { PageContainer } from "../../shared/components/PageContainer";
import { Layout } from "../../shared/components/Layout";
import { fetchFiles } from "../../store/slices/fileSlice";
import { createLink } from "../../store/slices/linkSlice";

const EXPIRY_OPTIONS = [
  { value: "file", label: "До истечения файла" },
  { value: "1", label: "1 день" },
  { value: "7", label: "7 дней" },
  { value: "30", label: "30 дней" },
  { value: "custom", label: "Указать дату" },
];

const calculateExpiryDate = (expiryOption: string, expiresAt: string, fileExpiresAt?: Date | null): Date | null => {
  if (expiryOption === "file" && fileExpiresAt) {
    return fileExpiresAt;
  }

  if (expiryOption === "custom" && expiresAt) {
    const date = new Date(expiresAt);
    date.setHours(23, 59, 0, 0);
    return date;
  }

  if (expiryOption !== "custom" && expiryOption !== "file") {
    const days = parseInt(expiryOption);
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(23, 59, 0, 0);
    return date;
  }

  return null;
};

export default function CreateLinksPage() {
  const dispatch = useAppDispatch();
  const { files } = useAppSelector((s) => s.files);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [expiryOption, setExpiryOption] = useState("file");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdLink, setCreatedLink] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  const fileOptions = files.map((file) => ({
    id: file.id,
    label: file.filename,
    expiresAt: file.expiresAt,
  }));

  const fileExpiresAt = selectedFile?.expiresAt ? new Date(selectedFile.expiresAt) : null;
  const maxDate = selectedFile?.expiresAt ? new Date(selectedFile.expiresAt).toISOString().split("T")[0] : "";
  const minDate = new Date().toISOString().split("T")[0];

  const expiryDate = calculateExpiryDate(expiryOption, expiresAt, fileExpiresAt);

  const handleCreateLink = async () => {
    if (!selectedFile) {
      setError("Выберите файл");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await dispatch(
        createLink({
          fileId: selectedFile.id,
          expiresAt: expiryDate?.toISOString(),
        }),
      ).unwrap();

      const link = `${window.location.origin}/download/${result.token}`;
      setCreatedLink(link);
      setShowSuccess(true);

      navigator.clipboard.writeText(link);

      setSelectedFile(null);
      setExpiresAt("");
      setExpiryOption("file");
    } catch (err: any) {
      setError(err.message || "Ошибка создания ссылки");
    } finally {
      setLoading(false);
    }
  };

  const handleExpiryChange = (value: string) => {
    setExpiryOption(value);
    setError("");
    if (value !== "custom") {
      setExpiresAt("");
    }
  };

  const getExpiryInfo = () => {
    if (!selectedFile) return null;

    if (!expiryDate) return "Бессрочная ссылка";
    return `Истекает: ${expiryDate.toLocaleDateString()}`;
  };

  const expiryInfo = getExpiryInfo();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdLink);
    setShowSuccess(true);
  };

  return (
    <Layout>
      <PageContainer maxWidth="md">
        <Typography variant="h4" gutterBottom>
          <InsertLink sx={{ mr: 1, verticalAlign: "middle" }} />
          Создание ссылки
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Создайте публичную ссылку для скачивания файла
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setShowSuccess(false)}>
            Ссылка создана и скопирована в буфер обмена
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Autocomplete
            value={selectedFile}
            onChange={(_, newValue) => {
              setSelectedFile(newValue);
              setExpiresAt("");
              setExpiryOption("file");
              setError("");
            }}
            options={fileOptions}
            getOptionLabel={(opt) => opt.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Файл"
                placeholder="Поиск по имени..."
                helperText={
                  selectedFile?.expiresAt
                    ? `Файл хранится до: ${new Date(selectedFile.expiresAt).toLocaleDateString()}`
                    : "Бессрочный файл"
                }
              />
            )}
            renderOption={(props, opt) => (
              <li {...props} key={opt.id}>
                <Box>
                  <Typography>{opt.label}</Typography>
                  {opt.expiresAt && (
                    <Typography variant="caption" color="text.secondary">
                      Истекает: {new Date(opt.expiresAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </li>
            )}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Срок действия</InputLabel>
            <Select
              value={expiryOption}
              onChange={(e) => handleExpiryChange(e.target.value)}
              label="Срок действия"
              disabled={!selectedFile}
            >
              {EXPIRY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {expiryOption === "custom" && (
            <TextField
              label="Дата истечения"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate, max: maxDate }}
              helperText={maxDate ? `Максимум: ${new Date(maxDate).toLocaleDateString()}` : "Бессрочно"}
              sx={{ mb: 2 }}
            />
          )}

          {expiryInfo && (
            <Alert icon={<CalendarToday />} sx={{ mb: 2 }}>
              {expiryInfo}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleCreateLink}
            disabled={!selectedFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Add />}
            fullWidth
            size="large"
          >
            {loading ? "Создание..." : "Создать ссылку"}
          </Button>
        </Paper>

        {createdLink && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InsertLink /> Ссылка создана
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                value={createdLink}
                fullWidth
                size="small"
                InputProps={{
                  readOnly: true,
                  sx: { fontFamily: "monospace" },
                }}
              />
              <Button variant="outlined" startIcon={<ContentCopy />} onClick={copyToClipboard} size="small">
                Копировать
              </Button>
            </Box>
          </Paper>
        )}

        <Alert severity="info" sx={{ mt: 2 }}>
          Ссылка позволяет скачивать файл без авторизации
        </Alert>
      </PageContainer>
    </Layout>
  );
}
