import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add, ContentCopy, ViewModule, ViewList, InsertLink, Search, Check, Block } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { PageContainer } from "../../shared/components/PageContainer";
import { Layout } from "../../shared/components/Layout";
import { deactivateLink, fetchUserLinks, activateLink } from "../../store/slices/linkSlice";

type ViewMode = "cards" | "list";

export default function LinksPage() {
  const dispatch = useAppDispatch();
  const { links, loading, error } = useAppSelector((s) => s.links);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchUserLinks());
  }, [dispatch]);

  const filteredLinks = useMemo(() => {
    if (!searchQuery.trim()) return links;

    const query = searchQuery.toLowerCase().trim();
    return links.filter(
      (link) => link.file.filename.toLowerCase().includes(query) || link.token.toLowerCase().includes(query),
    );
  }, [links, searchQuery]);

  const handleCopyLink = (token: string) => {
    const downloadUrl = `${window.location.origin}/download/${token}`;
    navigator.clipboard.writeText(downloadUrl);
  };

  const handleDeactivate = async (token: string) => {
    if (window.confirm("Деактивировать ссылку?")) {
      await dispatch(deactivateLink(token));
      dispatch(fetchUserLinks());
    }
  };

  const handleActivate = async (token: string) => {
    if (window.confirm("Активировать ссылку?")) {
      await dispatch(activateLink(token));
      dispatch(fetchUserLinks());
    }
  };

  const getLinkStatus = (link: any) => {
    if (!link.isActive) return { label: "Неактивна", color: "default" as const };
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return { label: "Истекла", color: "error" as const };
    }
    return { label: "Активна", color: "success" as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  return (
    <Layout>
      <PageContainer maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">
            Мои ссылки
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button component={Link} to="/links/create" variant="contained" startIcon={<Add />}>
              Создать ссылку
            </Button>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, newViewMode) => newViewMode && setViewMode(newViewMode)}
              size="small"
            >
              <ToggleButton value="cards">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Поиск по имени файла или токену..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredLinks.length === 0 ? (
          <Card>
            <CardContent>
              <Paper sx={{ py: 8, textAlign: "center" }}>
                <InsertLink sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {searchQuery ? "Ничего не найдено" : "У вас нет созданных ссылок"}
                </Typography>
                {!searchQuery && (
                  <Button component={Link} to="/links/create" variant="contained" startIcon={<Add />}>
                    Создать первую ссылку
                  </Button>
                )}
              </Paper>
            </CardContent>
          </Card>
        ) : viewMode === "cards" ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 2 }}>
            {filteredLinks.map((link) => {
              const status = getLinkStatus(link);
              const downloadUrl = `${window.location.origin}/download/${link.token}`;

              return (
                <Card key={link.id} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" noWrap sx={{ flex: 1, mr: 1 }}>
                        {link.file.filename}
                      </Typography>
                      <Chip label={status.label} color={status.color} size="small" />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, wordBreak: "break-all" }}>
                      {downloadUrl}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
                      <Typography variant="caption">Создана: {formatDate(link.createdAt)}</Typography>
                      {link.expiresAt && (
                        <Typography variant="caption">Истекает: {formatDate(link.expiresAt)}</Typography>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Копировать ссылку">
                        <IconButton size="small" onClick={() => handleCopyLink(link.token)} disabled={!link.isActive}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {link.isActive ? (
                        <Tooltip title="Деактивировать">
                          <IconButton size="small" color="warning" onClick={() => handleDeactivate(link.token)}>
                            <Block fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Активировать">
                          <IconButton size="small" color="success" onClick={() => handleActivate(link.token)}>
                            <Check fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "600", pl: 3 }}>Файл</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Ссылка</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Статус</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Создана</TableCell>
                      <TableCell sx={{ fontWeight: "600" }}>Истекает</TableCell>
                      <TableCell sx={{ fontWeight: "600", pr: 3 }}>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLinks.map((link) => {
                      const status = getLinkStatus(link);
                      const downloadUrl = `${window.location.origin}/download/${link.token}`;

                      return (
                        <TableRow key={link.id} hover>
                          <TableCell sx={{ pl: 3 }}>
                            <Typography fontWeight="500">{link.file.filename}</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                              {downloadUrl}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip label={status.label} color={status.color} size="small" />
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">{formatDate(link.createdAt)}</Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="body2">
                              {link.expiresAt ? formatDate(link.expiresAt) : "Бессрочно"}
                            </Typography>
                          </TableCell>

                          <TableCell sx={{ pr: 3 }}>
                            <Box sx={{ display: "flex", gap: 1 }}>
                              <Tooltip title="Копировать ссылку">
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopyLink(link.token)}
                                  disabled={!link.isActive}
                                >
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {link.isActive ? (
                                <Tooltip title="Деактивировать">
                                  <IconButton size="small" color="warning" onClick={() => handleDeactivate(link.token)}>
                                    <Block fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Активировать">
                                  <IconButton size="small" color="success" onClick={() => handleActivate(link.token)}>
                                    <Check fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </Layout>
  );
}
