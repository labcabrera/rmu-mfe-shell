import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import UploadIcon from '@mui/icons-material/Upload';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Tab, Tabs } from '@mui/material';
import type { MediaImage } from '../../api/media-api-client';
import ImageCategorySelector from './ImageCategorySelector';
import ImageUploadEditor from './ImageUploadEditor';

export type ImageDialogProps = {
  open: boolean;
  onClose: () => void;
  onImageSelected?: (image: MediaImage) => void;
  onImageUploaded?: (image: MediaImage) => void;
};

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ImageDialog({ open, onClose, onImageSelected, onImageUploaded }: ImageDialogProps) {
  const [tab, setTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<MediaImage>();

  const handleUploaded = (image: MediaImage) => {
    setSelectedImage(image);
    onImageUploaded?.(image);
  };

  const handleSelect = () => {
    if (!selectedImage) return;
    onImageSelected?.(selectedImage);
    onClose();
  };

  const handleClose = () => {
    setSelectedImage(undefined);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        Images
        <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto">
          <Tab icon={<UploadIcon />} iconPosition="start" label="Upload image" />
          <Tab icon={<ImageSearchIcon />} iconPosition="start" label="Select image" />
        </Tabs>
        <Divider />
        <TabPanel value={tab} index={0}>
          <ImageUploadEditor onUploaded={handleUploaded} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ImageCategorySelector selectedImageId={selectedImage?.id} onSelect={setSelectedImage} />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Close
        </Button>
        <Button variant="contained" color="success" onClick={handleSelect} disabled={!selectedImage}>
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
}
