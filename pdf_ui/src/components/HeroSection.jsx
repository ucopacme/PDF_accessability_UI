import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

const UC_BLUE = '#003262';
const UC_GOLD = '#FDB515';

const HeroSection = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pt: { xs: 4, sm: 5 },
        pb: { xs: 2, sm: 3 },
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '12px',
          backgroundColor: `${UC_BLUE}0A`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <AccessibilityNewIcon sx={{ fontSize: 28, color: UC_BLUE }} />
      </Box>

      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          color: UC_BLUE,
          mb: 1,
          fontSize: { xs: '1.5rem', sm: '1.75rem' },
        }}
      >
        PDF Accessibility Remediation
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#6C6C6C',
          maxWidth: '520px',
          lineHeight: 1.7,
          mb: 1.5,
          fontSize: { xs: '0.9rem', sm: '1rem' },
        }}
      >
        AI-powered open-source solution designed to improve digital
        accessibility for everyone.
      </Typography>

      <Chip
        label="WCAG 2.1 Level AA · ADA Compliant"
        size="small"
        sx={{
          backgroundColor: `${UC_GOLD}20`,
          color: UC_BLUE,
          fontWeight: 600,
          fontSize: '0.75rem',
          border: `1px solid ${UC_GOLD}40`,
        }}
      />
    </Box>
  );
};

export default HeroSection;
