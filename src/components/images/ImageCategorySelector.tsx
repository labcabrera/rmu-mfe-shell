import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { IMAGE_CATEGORIES, mediaApiClient } from '../../api/media-api-client';
import type { ImageCategory, MediaImage } from '../../api/media-api-client';

export type ImageCategorySelectorProps = {
  defaultCategory?: ImageCategory;
  selectedImageId?: string;
  categories?: string[];
  onSelect?: (image: MediaImage) => void;
};

export default function ImageCategorySelector({
  defaultCategory = 'avatars',
  selectedImageId,
  categories = ['actions', 'avatars', 'generic', 'items', 'npcs', 'photos', 'professions', 'races', 'user-data'],
  onSelect,
}: ImageCategorySelectorProps) {
  const auth = useAuth();
  const [category, setCategory] = useState<ImageCategory>(defaultCategory);
  const [images, setImages] = useState<MediaImage[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (!auth.isAuthenticated) return;
    let cancelled = false;
    setLoading(true);
    setErrorMessage(undefined);
    mediaApiClient
      .fetchImages(auth, category, page)
      .then((response) => {
        if (cancelled) return;
        setImages(response.content);
        setTotalPages(response.pagination.totalPages);
      })
      .catch((err) => {
        if (!cancelled) setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch images');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, category, page]);

  const handleCategoryChange = (event: SelectChangeEvent<ImageCategory>) => {
    setCategory(event.target.value as ImageCategory);
    setPage(0);
  };

  return (
    <Stack spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel id="select-image-category-label">Category</InputLabel>
        <Select labelId="select-image-category-label" value={category} label="Category" onChange={handleCategoryChange}>
          {categories.map((imageCategory) => (
            <MenuItem key={imageCategory} value={imageCategory}>
              {imageCategory}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : errorMessage ? (
        <Alert severity="error">{errorMessage}</Alert>
      ) : images.length === 0 ? (
        <Typography color="text.secondary">No images found</Typography>
      ) : (
        <ImageList cols={3} gap={12} sx={{ m: 0 }}>
          {images.map((image) => {
            const selected = selectedImageId === image.id;
            return (
              <ImageListItem
                key={image.id}
                onClick={() => onSelect?.(image)}
                sx={{
                  cursor: 'pointer',
                  border: 2,
                  borderColor: selected ? 'primary.main' : 'transparent',
                  borderRadius: 1,
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  '& img': {
                    height: '100%',
                    objectFit: 'cover',
                  },
                }}
              >
                <img src={image.url} alt={image.altText || image.originalFilename || image.category} loading="lazy" />
                <ImageListItemBar title={image.altText || image.originalFilename || image.category} subtitle={image.category} />
              </ImageListItem>
            );
          })}
        </ImageList>
      )}

      {totalPages > 1 && <Pagination count={totalPages} page={page + 1} onChange={(_, value) => setPage(value - 1)} sx={{ alignSelf: 'center' }} />}
    </Stack>
  );
}
