import React, { useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AvatarEditor, { AvatarEditorRef } from 'react-avatar-editor';
import { IMAGE_CATEGORIES, mediaApiClient } from '../../api/media-api-client';
import type { ImageCategory, MediaImage } from '../../api/media-api-client';

export type ImageUploadEditorProps = {
  defaultCategory?: ImageCategory;
  width?: number;
  height?: number;
  onUploaded?: (image: MediaImage) => void;
};

const toBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error('Could not prepare image for upload'));
    }, type);
  });

const uploadContentType = (type: string): string => (['image/jpeg', 'image/png', 'image/webp'].includes(type) ? type : 'image/png');

export default function ImageUploadEditor({ defaultCategory = 'avatars', width = 240, height = 240, onUploaded }: ImageUploadEditorProps) {
  const auth = useAuth();
  const editorRef = useRef<AvatarEditorRef>(null);
  const [file, setFile] = useState<File>();
  const [category, setCategory] = useState<ImageCategory>(defaultCategory);
  const [altText, setAltText] = useState('');
  const [scale, setScale] = useState(1.2);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<MediaImage>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedImage(undefined);
    setErrorMessage(undefined);
    setFile(event.target.files?.[0]);
  };

  const handleReset = () => {
    setFile(undefined);
    setAltText('');
    setScale(1.2);
    setUploadedImage(undefined);
    setErrorMessage(undefined);
  };

  const handleUpload = async () => {
    if (!file || !editorRef.current) return;
    setUploading(true);
    setErrorMessage(undefined);
    try {
      const contentType = uploadContentType(file.type);
      const blob = await toBlob(editorRef.current.getImageScaledToCanvas(), contentType);
      const image = await mediaApiClient.uploadImage(auth, {
        file: blob,
        filename: file.name,
        category,
        altText: altText.trim() || undefined,
        metadata: { source: 'avatar-editor' },
      });
      setUploadedImage(image);
      onUploaded?.(image);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
          Select image
          <input hidden accept="image/jpeg,image/png,image/webp" type="file" onChange={handleFileChange} />
        </Button>
        <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset} disabled={!file && !altText}>
          Reset
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { xs: 'stretch', md: 'flex-start' } }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: width + 48,
            minHeight: height + 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'action.hover',
            overflow: 'hidden',
          }}
        >
          {file ? (
            <AvatarEditor
              ref={editorRef}
              image={file}
              width={width}
              height={height}
              border={24}
              borderRadius={8}
              scale={scale}
              color={[0, 0, 0, 0.45]}
            />
          ) : (
            <Typography color="text.secondary">No image selected</Typography>
          )}
        </Box>

        <Stack spacing={2} sx={{ flex: 1, minWidth: 220 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="upload-image-category-label">Category</InputLabel>
            <Select
              labelId="upload-image-category-label"
              value={category}
              label="Category"
              onChange={(event: SelectChangeEvent<ImageCategory>) => setCategory(event.target.value as ImageCategory)}
            >
              {IMAGE_CATEGORIES.map((imageCategory) => (
                <MenuItem key={imageCategory} value={imageCategory}>
                  {imageCategory}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Alternative text" size="small" value={altText} onChange={(event) => setAltText(event.target.value)} fullWidth />

          <Box>
            <Typography variant="body2" color="text.secondary">
              Zoom
            </Typography>
            <Slider value={scale} min={1} max={3} step={0.05} onChange={(_, value) => setScale(Array.isArray(value) ? value[0] : value)} />
          </Box>

          <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleUpload} disabled={!file || uploading || !auth.isAuthenticated}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>
      </Stack>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {uploadedImage && <Alert severity="success">Image uploaded</Alert>}
    </Stack>
  );
}
