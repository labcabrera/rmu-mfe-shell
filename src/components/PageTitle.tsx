import React, { ElementType, FC, ReactNode } from 'react';
import { SxProps, Theme, Typography, TypographyProps } from '@mui/material';

/**
 * A heading in the display font of the theme, weight 600 (spec 066): page and section titles of the shell pages and
 * the big figures of the administration. Candidate for the shared library (a theme typography variant or a lib
 * component), since only h1-h4 take the display font from the theme.
 */
const PageTitle: FC<{
  children: ReactNode;
  variant?: TypographyProps['variant'];
  component?: ElementType;
  noWrap?: boolean;
  sx?: SxProps<Theme>;
}> = ({ children, variant = 'h4', component = 'h1', noWrap, sx }) => (
  <Typography
    variant={variant}
    component={component}
    noWrap={noWrap}
    sx={[{ fontFamily: (theme) => theme.fonts.display, fontWeight: 600 }, ...(Array.isArray(sx) ? sx : [sx])]}
  >
    {children}
  </Typography>
);

export default PageTitle;
