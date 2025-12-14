import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Paper,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { CloudUpload, Close, CalendarToday, CheckCircle } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { uploadFile } from "../../store/slices/fileSlice";
import { PageContainer } from "../../shared/components/PageContainer";
import { Layout } from "../../shared/components/Layout";
import { fetchMyGroups } from "../../store/slices/groupSlice";

const EXPIRY_OPTIONS = [
  { value: "", label: "Бессрочно" },
  { value: "1", label: "1 день", days: 1 },
  { value: "7", label: "7 дней", days: 7 },
  { value: "30", label: "30 дней", days: 30 },
  { value: "custom", label: "Указать дату" },
];

export default function CreateFilePage() {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((s) => s.files);
  const { groups } = useAppSelector((s) => s.groups);
  const [file, setFile] = useState<File | null>(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [uploadToGroup, setUploadToGroup] = useState(false);
  const [expiryOption, setExpiryOption] = useState("");

  useEffect(() => {
    dispatch(fetchMyGroups());
  }, [dispatch]);

  const handleExpiryChange = (value: string) => {
    setExpiryOption(value);
    if (!value || value === "custom") setExpiresAt("");
    else if (value !== "custom") {
      const days = parseInt(value);
      const date = new Date();
      date.setDate(date.getDate() + days);
      date.setHours(23, 59, 0, 0);
      setExpiresAt(date.toISOString());
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const uploadData = {
        description: description || undefined,
        expiresAt: expiresAt || undefined,
        groupId: uploadToGroup && selectedGroupId ? selectedGroupId : undefined,
      };
      await dispatch(uploadFile({ file, data: uploadData })).unwrap();
      setFile(null);
      setDescription("");
      setExpiresAt("");
      setExpiryOption("");
      setSelectedGroupId("");
      setUploadToGroup(false);
      setSuccess(true);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setDescription("");
    setExpiresAt("");
    setExpiryOption("");
    setSelectedGroupId("");
    setUploadToGroup(false);
  };

  return (
    <Layout>
      <PageContainer maxWidth="md">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Загрузка файла
        </Typography>

        <Snackbar open={!!error} autoHideDuration={6000}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
          <Alert severity="success" icon={<CheckCircle />}>
            Файл успешно загружен!
          </Alert>
        </Snackbar>

        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                border: dragOver ? "2px dashed #1976d2" : "2px dashed #ccc",
                bgcolor: dragOver ? "rgba(25, 118, 210, 0.04)" : "transparent",
                "&:hover": { borderColor: "#1976d2", bgcolor: "rgba(25, 118, 210, 0.04)" },
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
              }}
            >
              <input type="file" hidden id="file-input" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              {!file ? (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, color: dragOver ? "#1976d2" : "#ccc", mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    {dragOver ? "Отпустите файл" : "Перетащите файл"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    или
                  </Typography>
                  <Button component="label" variant="contained" htmlFor="file-input">
                    Выберите файл
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Файл: {file.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Размер: {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <Button
                    startIcon={<Close />}
                    onClick={() => setFile(null)}
                    color="error"
                    variant="outlined"
                    size="small"
                  >
                    Удалить
                  </Button>
                </Box>
              )}
            </Paper>

            <TextField
              label="Описание (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              maxRows={10}
              slotProps={{ input: { sx: { "& textarea": { resize: "vertical" } } } }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={uploadToGroup}
                  onChange={(e) => {
                    setUploadToGroup(e.target.checked);
                    if (!e.target.checked) setSelectedGroupId("");
                  }}
                />
              }
              label="Загрузить в группу"
            />

            {uploadToGroup && (
              <FormControl fullWidth>
                <InputLabel>Выберите группу</InputLabel>
                <Select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  label="Выберите группу"
                >
                  <MenuItem value="">
                    <em>Не выбрано</em>
                  </MenuItem>
                  {groups.map((g) => (
                    <MenuItem key={g.id} value={g.id}>
                      {g.name}
                      {g.description && ` - ${g.description}`}
                    </MenuItem>
                  ))}
                </Select>
                {groups.length === 0 && (
                  <Typography variant="caption" color="text.secondary">
                    Вы не состоите в группах
                  </Typography>
                )}
              </FormControl>
            )}

            <FormControl fullWidth>
              <InputLabel>Срок хранения</InputLabel>
              <Select value={expiryOption} onChange={(e) => handleExpiryChange(e.target.value)} label="Срок хранения">
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
                value={expiresAt.split("T")[0]}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  d.setHours(0, 0, 0, 0);
                  setExpiresAt(d.toISOString());
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
                slotProps={{ input: { startAdornment: <CalendarToday sx={{ mr: 1, color: "action.active" }} /> } }}
              />
            )}

            {expiresAt && expiryOption !== "custom" && expiryOption !== "" && (
              <Alert severity="info" icon={<CalendarToday />}>
                Хранится до: {new Date(expiresAt).toLocaleDateString()}
              </Alert>
            )}
            {expiryOption === "" && <Alert severity="info">Бессрочное хранение</Alert>}

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!file || loading || (uploadToGroup && !selectedGroupId)}
                sx={{ py: 1.5, fontWeight: 600, flex: 1 }}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading ? "Загрузка..." : uploadToGroup ? "Загрузить в группу" : "Загрузить файл"}
              </Button>
              <Button variant="outlined" onClick={resetForm} disabled={loading} sx={{ py: 1.5 }}>
                Очистить
              </Button>
            </Box>

            {uploadToGroup && selectedGroupId && (
              <Alert severity="info">Файл будет доступен всем участникам группы</Alert>
            )}
          </Box>
        </Paper>
      </PageContainer>
    </Layout>
  );
}
