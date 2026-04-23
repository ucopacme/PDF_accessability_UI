import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedIcon from '@mui/icons-material/Verified';
import BoltIcon from '@mui/icons-material/Bolt';
import SecurityIcon from '@mui/icons-material/Security';

const UC_BLUE = '#003262';
const UC_GOLD = '#FDB515';

const features = [
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 24 }} />,
    title: 'Cost Effective',
    description: 'Significant cost reduction from traditional remediation methods',
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 24 }} />,
    title: 'WCAG 2.1 Level AA',
    description: 'Supports international accessibility standards and ADA compliance',
  },
  {
    icon: <BoltIcon sx={{ fontSize: 24 }} />,
    title: 'Fast Processing',
    description: 'Automated PDF remediation in minutes, not days',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 24 }} />,
    title: 'Secure & Private',
    description: 'Documents processed within UC cloud infrastructure',
  },
];

const InformationBlurb = () => {
  return (
    <Box
      sx={{
        py: { xs: 3, sm: 4 },
        px: { xs: 2, sm: 3 },
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: UC_BLUE,
          fontWeight: 700,
          letterSpacing: '1.5px',
          fontSize: '0.7rem',
          display: 'block',
          textAlign: 'center',
          mb: 3,
        }}
      >
        WHY USE THIS TOOL
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  backgroundColor: UC_GOLD,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: UC_BLUE,
                  mb: 1.5,
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: UC_BLUE,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  mb: 0.5,
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#6C6C6C',
                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InformationBlurb;
