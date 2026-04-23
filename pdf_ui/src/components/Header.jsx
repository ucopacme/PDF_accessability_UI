// src/components/Header.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  LinearProgress,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// ─── UC Brand Colors ─────────────────────────────────────────────────────
const UC_BLUE = '#003262';
const UC_CYAN = '#27DAF5';

function Header({ handleSignOut, usageCount, maxFilesAllowed, refreshUsage, usageError, loadingUsage, onMenuClick }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [usageExpanded, setUsageExpanded] = useState(false);

  const usagePercentage = maxFilesAllowed > 0 ? Math.min((usageCount / maxFilesAllowed) * 100, 100) : 0;

  const getProgressBarColor = () => {
    if (usagePercentage < 50) return '#66bb6a';
    if (usagePercentage < 80) return '#ffa726';
    return '#ef5350';
  };

  const formatNumber = (num) => num.toLocaleString();

  return (
    <AppBar
      position="static"
      role="banner"
      aria-label="Application Header"
      elevation={0}
      sx={{
        backgroundColor: UC_CYAN,
        borderBottom: `3px solid ${UC_BLUE}`,
      }}
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
        minHeight: { xs: 56, sm: 64 },
        overflow: 'hidden',
      }}>

        {/* Left Side: Menu Button (mobile) + UCOP Title */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          flex: '0 0 auto',
          minWidth: 0
        }}>
          {isMobile && onMenuClick && (
            <IconButton
              aria-label="open navigation menu"
              onClick={onMenuClick}
              sx={{ mr: 0.5, color: UC_BLUE }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="body1"
            component="h1"
            sx={{
              color: UC_BLUE,
              fontWeight: 700,
              fontSize: { xs: '0.85rem', sm: '1rem' },
              letterSpacing: '0.3px',
              whiteSpace: 'nowrap',
            }}
          >
            UCOP PDF Accessibility Remediation
          </Typography>
        </Box>

        {/* Right Side: Usage Count and Home Button */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 0.5, sm: 2 },
          flexWrap: 'nowrap',
          minWidth: 0,
          flex: '0 0 auto'
        }}>

          {/* Usage display */}
          {isMobile ? (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              minWidth: 0,
              flex: '0 0 auto'
            }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.7rem',
                  color: UC_BLUE,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '60px'
                }}
              >
                {loadingUsage
                  ? '...'
                  : usageError
                    ? 'Error'
                    : `${formatNumber(usageCount)}/${formatNumber(maxFilesAllowed)}`}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setUsageExpanded(!usageExpanded)}
                aria-label={usageExpanded ? 'Hide usage details' : 'Show usage details'}
                sx={{
                  color: UC_BLUE,
                  p: 0.25,
                  minWidth: 24,
                  minHeight: 24,
                  width: 24,
                  height: 24
                }}
              >
                {usageExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            </Box>
          ) : (
            <Box sx={{
              minWidth: 180,
              maxWidth: 220,
              flex: '0 0 auto'
            }}>
              <Typography
                variant="body2"
                sx={{
                  mb: 0.5,
                  fontSize: '0.8rem',
                  color: UC_BLUE,
                  whiteSpace: 'nowrap',
                }}
              >
                {loadingUsage
                  ? 'Checking usage...'
                  : usageError
                    ? `Error: ${usageError}`
                    : `Used: ${formatNumber(usageCount)} / ${formatNumber(maxFilesAllowed)}`}
              </Typography>

              {!usageError && !loadingUsage && (
                <LinearProgress
                  variant="determinate"
                  value={usagePercentage}
                  sx={{
                    height: 5,
                    borderRadius: '3px',
                    backgroundColor: 'rgba(0,50,98,0.12)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getProgressBarColor(),
                    },
                  }}
                  aria-valuenow={usagePercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                  aria-label={`Usage: ${formatNumber(usageCount)} out of ${formatNumber(maxFilesAllowed)} files uploaded`}
                />
              )}
            </Box>
          )}

          {/* Home Button */}
          <Button
            onClick={handleSignOut}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
            sx={{
              borderColor: UC_BLUE,
              color: UC_BLUE,
              padding: isMobile ? '4px 10px' : '6px 16px',
              borderRadius: '6px',
              fontSize: isMobile ? '0.7rem' : '0.85rem',
              fontWeight: 600,
              minHeight: isMobile ? 32 : 38,
              height: isMobile ? 32 : 38,
              flex: '0 0 auto',
              whiteSpace: 'nowrap',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0,50,98,0.08)',
                borderColor: UC_BLUE,
              },
              transition: 'all 0.2s ease',
            }}
            aria-label="Home Button"
          >
            Home
          </Button>
        </Box>
      </Toolbar>

      {/* Mobile Usage Details */}
      {isMobile && (
        <Collapse in={usageExpanded}>
          <Box sx={{ px: 2, py: 1.5, backgroundColor: 'rgba(0,50,98,0.06)' }}>
            <Typography variant="body2" sx={{ mb: 1, color: UC_BLUE, fontSize: '0.8rem' }}>
              {loadingUsage
                ? 'Checking usage...'
                : usageError
                  ? `Error: ${usageError}`
                  : `Used: ${formatNumber(usageCount)} / ${formatNumber(maxFilesAllowed)}`}
            </Typography>

            {!usageError && !loadingUsage && (
              <LinearProgress
                variant="determinate"
                value={usagePercentage}
                sx={{
                  height: 5,
                  borderRadius: '3px',
                  backgroundColor: 'rgba(0,50,98,0.12)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getProgressBarColor(),
                  },
                }}
                aria-valuenow={usagePercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                role="progressbar"
                aria-label={`Usage: ${formatNumber(usageCount)} out of ${formatNumber(maxFilesAllowed)} files uploaded`}
              />
            )}
          </Box>
        </Collapse>
      )}
    </AppBar>
  );
}

Header.propTypes = {
  handleSignOut: PropTypes.func.isRequired,
  usageCount: PropTypes.number.isRequired,
  maxFilesAllowed: PropTypes.number.isRequired,
  refreshUsage: PropTypes.func.isRequired,
  usageError: PropTypes.string,
  loadingUsage: PropTypes.bool,
  onMenuClick: PropTypes.func,
};

export default Header;
