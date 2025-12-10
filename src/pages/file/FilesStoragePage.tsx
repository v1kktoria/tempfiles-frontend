import React, { useEffect, useState, useMemo } from "react";
import {
  Alert,
  Box,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import { CloudUpload, ViewModule, ViewList, Search } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/hooks";
import { deleteFile, fetchFiles, fetchFilesByTag, fetchFilesByGroup, updateFile } from "../../store/slices/fileSlice";
import { PageContainer } from "../../shared/components/PageContainer";
import { FileListSection } from "./components/FileListSection";
import { FileInfoModal } from "./components/FileInfoModal";
import { FileDto } from "../../types/file";
import { Link } from "react-router-dom";
import { Layout } from "../../shared/components/Layout";
import { fetchTags } from "../../store/slices/tagSlice";
import { fetchMyGroups } from "../../store/slices/groupSlice";
import { FileTableSection } from "./components/FileTableSection";

type ViewMode = "cards" | "list";

export default function FilesPage() {
  const dispatch = useAppDispatch();
  const { files, filesByTag, filesByGroup, loading, error } = useAppSelector((s) => s.files);
  const { tags } = useAppSelector((s) => s.tags);
  const { groups } = useAppSelector((s) => s.groups);

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [activeFile, setActiveFile] = useState<FileDto | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentGroup = groups.find((g) => g.id === selectedGroupId);
  const isGroupView = !!selectedGroupId;

  useEffect(() => {
    dispatch(fetchFiles());
    dispatch(fetchTags());
    dispatch(fetchMyGroups());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGroupId) {
      dispatch(fetchFilesByGroup(selectedGroupId));
    } else if (activeTag) {
      dispatch(fetchFilesByTag(activeTag));
    }
  }, [selectedGroupId, activeTag, dispatch]);

  const displayFiles = useMemo(() => {
    let result;
    if (selectedGroupId) {
      result = filesByGroup[selectedGroupId] || [];
    } else if (activeTag) {
      result = filesByTag[activeTag] || [];
    } else {
      result = files.filter((file) => !file.groupId);
    }

    if (!searchQuery.trim()) return result;

    const query = searchQuery.toLowerCase().trim();
    return result.filter(
      (file) =>
        file.filename.toLowerCase().includes(query) ||
        (file.description && file.description.toLowerCase().includes(query)),
    );
  }, [selectedGroupId, activeTag, files, filesByGroup, filesByTag, searchQuery]);

  const handleTagClick = (tagId: string) => {
    setActiveTag(activeTag === tagId ? null : tagId);
    setSelectedGroupId(null);
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    setActiveTag(null);
  };

  const handlePersonalView = () => {
    setSelectedGroupId(null);
    setActiveTag(null);
  };

  const handleFileUpdate = async (id: string, data: { description?: string; filename?: string }) => {
    await dispatch(updateFile({ id, data })).unwrap();
    refreshFiles();
    if (activeFile?.id === id) {
      setActiveFile({
        ...activeFile,
        ...(data.description !== undefined && { description: data.description }),
        ...(data.filename !== undefined && { filename: data.filename }),
      });
    }
  };

  const handleFileDelete = async (id: string) => {
    if (window.confirm("Вы уверены, что хотите удалить этот файл?")) {
      await dispatch(deleteFile(id)).unwrap();
      refreshFiles();
      if (activeFile?.id === id) {
        setActiveFile(null);
      }
    }
  };

  const refreshFiles = () => {
    if (selectedGroupId) {
      dispatch(fetchFilesByGroup(selectedGroupId));
    } else if (activeTag) {
      dispatch(fetchFilesByTag(activeTag));
    } else {
      dispatch(fetchFiles());
    }
  };

  const handleShowInfo = (file: FileDto) => setActiveFile(file);
  const handleCloseModal = () => setActiveFile(null);

  return (
    <Layout>
      <PageContainer maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button component={Link} to="/files/upload" variant="contained" startIcon={<CloudUpload />}>
              Загрузить файл
            </Button>

            {groups.length > 0 && (
              <FormControl sx={{ minWidth: 200 }} size="small">
                <InputLabel>Группа</InputLabel>
                <Select
                  value={selectedGroupId || ""}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  label="Группа"
                >
                  <MenuItem value="" onClick={handlePersonalView}>
                    Личные файлы
                  </MenuItem>
                  {groups.map((group) => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newViewMode) => newViewMode && setViewMode(newViewMode)}
          >
            <ToggleButton value="cards">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          fullWidth
          placeholder="Поиск по имени файла или описанию..."
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

        {!isGroupView && (
          <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            <Chip
              label="Все файлы"
              onClick={() => setActiveTag(null)}
              color={!activeTag ? "primary" : "default"}
              variant={!activeTag ? "filled" : "outlined"}
            />
            {tags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                onClick={() => handleTagClick(tag.id)}
                color={activeTag === tag.id ? "primary" : "default"}
                variant={activeTag === tag.id ? "filled" : "outlined"}
              />
            ))}
          </Box>
        )}

        {isGroupView && displayFiles.length === 0 && !loading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {searchQuery ? "Файлы не найдены" : `В группе "${currentGroup?.name}" пока нет файлов`}
          </Alert>
        )}

        {!isGroupView && !activeTag && displayFiles.length === 0 && !loading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {searchQuery ? "Файлы не найдены" : "Личных файлов пока нет"}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : viewMode === "cards" ? (
          <FileListSection
            files={displayFiles}
            loading={false}
            onFileInfo={handleShowInfo}
            onFileDelete={handleFileDelete}
          />
        ) : (
          <FileTableSection
            files={displayFiles}
            loading={false}
            onFileInfo={handleShowInfo}
            onFileDelete={handleFileDelete}
          />
        )}

        <FileInfoModal open={!!activeFile} file={activeFile} onClose={handleCloseModal} onUpdate={handleFileUpdate} />
      </PageContainer>
    </Layout>
  );
}
