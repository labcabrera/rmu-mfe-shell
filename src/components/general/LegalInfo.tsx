import React, { FC } from 'react';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import { Box, Container, Grid, Typography, Link, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

const LegalInfoList: FC<{ items: any[] }> = ({ items }) => {
  return (
    <List>
      {items.map((item, index) => (
        <ListItem
          key={index}
          alignItems="flex-start"
          sx={{
            mb: 2,
            borderRadius: 2,
          }}
        >
          <ListItemIcon sx={{ mt: 0.5 }}>
            <PrivacyTipIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography sx={{ fontSize: '1.5rem', fontWeight: 600 }}>{item.title}</Typography>}
            secondary={
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.5rem' }}>
                {item.description}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default LegalInfoList;
