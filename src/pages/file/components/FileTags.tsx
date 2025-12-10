import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Menu, MenuItem, CircularProgress, Chip } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../shared/hooks/hooks";
import { FileDto } from "../../../types/file";
import { assignTagToFile, fetchFileTags, removeTagFromFile } from "../../../store/slices/fileTagSlice";

export const FileTags: React.FC<{ file: FileDto }> = ({ file }) => {
  const dispatch = useAppDispatch();
  const { fileTags } = useAppSelector((s) => s.fileTags);
  const { tags } = useAppSelector((s) => s.tags);
  const [tagAnchorEl, setTagAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchFileTags(file.id));
  }, [dispatch, file.id]);

  const currentFileTags = fileTags[file.id] || [];
  const availableTags = tags.filter((tag) => !currentFileTags.some((fileTag) => fileTag.id === tag.id));

  const handleAddTag = async (tagId: string) => {
    setLoading(true);
    try {
      await dispatch(assignTagToFile({ fileId: file.id, tagId })).unwrap();
      dispatch(fetchFileTags(file.id));
    } finally {
      setLoading(false);
      setTagAnchorEl(null);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    setLoading(true);
    try {
      await dispatch(removeTagFromFile({ fileId: file.id, tagId })).unwrap();
      dispatch(fetchFileTags(file.id));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, alignItems: "center", minHeight: "32px" }}>
        {currentFileTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            size="small"
            color="primary"
            variant="outlined"
            onDelete={!loading ? () => handleRemoveTag(tag.id) : undefined}
            deleteIcon={loading ? <CircularProgress size={16} /> : <Close />}
            disabled={loading}
          />
        ))}

        <Tooltip title="Добавить тег">
          <IconButton
            size="small"
            onClick={(e) => setTagAnchorEl(e.currentTarget)}
            disabled={loading || availableTags.length === 0}
            sx={{ width: 24, height: 24 }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={tagAnchorEl}
        open={Boolean(tagAnchorEl)}
        onClose={() => setTagAnchorEl(null)}
        PaperProps={{
          sx: { maxHeight: 200 },
        }}
      >
        {availableTags.map((tag) => (
          <MenuItem key={tag.id} onClick={() => handleAddTag(tag.id)} disabled={loading}>
            {tag.name}
          </MenuItem>
        ))}
        {availableTags.length === 0 && <MenuItem disabled>Нет доступных тегов</MenuItem>}
      </Menu>
    </>
  );
};
