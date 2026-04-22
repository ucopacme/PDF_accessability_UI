import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

// MUI Components
import {
  Box,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// MUI Icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

// Images
import gradientImg from '../assets/Gradient.svg';
import bottomGradient from '../assets/bottom_gradient.svg';

// Styled Components
import { styled } from '@mui/system';

// ─── UC Brand Colors ─────────────────────────────────────────────────────
const UC_BLUE = '#003262';
const UC_GOLD = '#FDB515';
const UC_BLUE_LIGHT = '#004A8F';
const UC_DARK = '#00213F';

const StyledLink = styled(Link)(() => ({
  color: UC_BLUE,
  textDecoration: 'underline',
  '&:hover': {
    color: UC_BLUE_LIGHT,
  },
}));

const StyledEmailLink = styled(Link)(() => ({
  color: UC_BLUE,
  textDecoration: 'none',
  '&:hover': {
    color: UC_BLUE_LIGHT,
    textDecoration: 'underline',
  },
}));

const SmallFiberManualRecordIcon = styled(FiberManualRecordIcon)(({ size }) => ({
  fontSize: size || '8px',
}));

const GradientBox = styled(Box)(({ theme }) => ({
  backgroundImage: `url(${gradientImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  padding: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.spacing(2),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  flex: 1,
  minWidth: '200px',
}));

const LandingPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (auth.isLoading) return;
    if (auth.isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      auth.signinRedirect();
    }, 1000);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  if (auth.isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={50} thickness={5} sx={{ color: UC_BLUE }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ─── Top Bar with UC Branding ─────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: UC_BLUE,
          py: 1.5,
          px: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: '#fff', fontWeight: 500, letterSpacing: '0.5px' }}
        >
          University of California &nbsp;|&nbsp; Office of the President
        </Typography>
        <Chip
          label="UCOP Digital Accessibility"
          size="small"
          sx={{
            backgroundColor: 'rgba(253, 181, 21, 0.15)',
            color: UC_GOLD,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      </Box>

      {/* ─── Bottom Gradient Background ───────────────────────────────── */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          top: '50%',
          backgroundImage: `url(${bottomGradient})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          zIndex: -1,
          opacity: 0.4,
        }}
      />

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: UC_DARK,
          color: '#fff',
          minHeight: '65vh',
          alignItems: 'center',
          pb: 4,
          flexGrow: 1,
          flexWrap: 'wrap',
        }}
      >
        {/* Left Side: Content */}
        <Box
          sx={{
            flex: 1,
            padding: '0 5%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minWidth: '300px',
          }}
        >
          <Chip
            label="ADA & WCAG 2.1 AA Compliant"
            size="small"
            sx={{
              backgroundColor: 'rgba(253, 181, 21, 0.2)',
              color: UC_GOLD,
              fontWeight: 600,
              mb: 2,
              fontSize: '0.8rem',
            }}
          />

          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 'bold', mb: 2, lineHeight: 1.2 }}
          >
            PDF Accessibility
            <Box component="span" sx={{ color: UC_GOLD }}> Remediation</Box>
          </Typography>

          <Typography
            variant="h6"
            component="h2"
            sx={{ fontWeight: 400, mb: 3, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}
          >
            Ensuring equal access to digital documents across the
            University of California system.
          </Typography>

          <Typography variant="body1" paragraph sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
            The University of California Office of the President (UCOP) is committed
            to making digital content accessible to all. This tool automatically
            remediates PDF documents to meet WCAG 2.1 Level AA standards, supporting
            compliance with the Americans with Disabilities Act (ADA) and California
            state accessibility requirements.
          </Typography>

          <Typography variant="body1" paragraph sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8 }}>
            Upload your PDF and receive a fully tagged, accessible document with
            proper reading order, alt text for images, and structured headings — ready
            for assistive technologies.
          </Typography>

          {/* Provided By */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}
            >
              Powered by UCOP Information Technology Services
            </Typography>
          </Box>
        </Box>

        {/* Right Side: CTA */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minWidth: '300px',
          }}
        >
          <GradientBox>
            <DescriptionOutlinedIcon sx={{ fontSize: 48, color: UC_GOLD, mb: 2 }} />
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: 4,
                color: UC_GOLD,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              READY TO MAKE YOUR PDF ACCESSIBLE?
            </Typography>
            <LoadingButton
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIosIcon />}
              onClick={handleSignIn}
              loading={loading}
              component="button"
              loadingIndicator={
                <CircularProgress size={24} sx={{ color: UC_BLUE }} />
              }
              sx={{
                backgroundColor: UC_GOLD,
                color: UC_BLUE,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                width: 350,
                height: 50,
                borderRadius: '25px',
                transition: 'transform 0.2s, background-color 0.2s',
                '&:hover': {
                  backgroundColor: '#e6a312',
                  transform: 'scale(1.05)',
                },
                '&.MuiLoadingButton-loading': {
                  backgroundColor: UC_GOLD,
                },
              }}
            >
              Log In and Remediate My PDF
            </LoadingButton>
          </GradientBox>

          <Box sx={{ mt: 2 }}>
            <StyledLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleOpenDialog();
              }}
              sx={{ fontSize: '0.9rem', color: UC_GOLD }}
            >
              Learn more about the remediation process
            </StyledLink>
          </Box>
        </Box>
      </Box>

      {/* ─── UC Gold Accent Line ──────────────────────────────────────── */}
      <Box sx={{ height: '4px', backgroundColor: UC_GOLD }} />

      {/* ─── Features Section ─────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          py: 6,
          px: 4,
          backgroundColor: '#FAFAFA',
        }}
      >
        <FeatureCard>
          <AccessibilityNewIcon sx={{ fontSize: 40, color: UC_BLUE, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            WCAG 2.1 AA
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Automated tagging, reading order, and structure to meet
            federal and state accessibility standards.
          </Typography>
        </FeatureCard>
        <FeatureCard>
          <SpeedIcon sx={{ fontSize: 40, color: UC_BLUE, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Fast Processing
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Upload your PDF and receive a remediated, accessible version
            in minutes — not days.
          </Typography>
        </FeatureCard>
        <FeatureCard>
          <DescriptionOutlinedIcon sx={{ fontSize: 40, color: UC_BLUE, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            PDF &amp; HTML Output
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Choose between accessible PDF or HTML output formats
            depending on your needs.
          </Typography>
        </FeatureCard>
        <FeatureCard>
          <SecurityIcon sx={{ fontSize: 40, color: UC_BLUE, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Secure &amp; Private
          </Typography>
          <Typography variant="body2" sx={{ color: '#555' }}>
            Documents are processed securely within the UC cloud
            infrastructure and not retained after processing.
          </Typography>
        </FeatureCard>
      </Box>

      {/* ─── Support Resources ────────────────────────────────────────── */}
      <Box sx={{ p: 4, borderTop: '1px solid #eee', borderBottom: '1px solid #eee' }}>
        <Typography variant="h5" component="h2" sx={{ mb: 2, color: UC_BLUE }}>
          Support &amp; Resources
        </Typography>
        <List>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemIcon sx={{ minWidth: '24px' }}>
              <SmallFiberManualRecordIcon size="10px" sx={{ color: UC_BLUE }} />
            </ListItemIcon>
            <Typography variant="body1">
              Questions or need help? Contact the UCOP IT Accessibility team at{' '}
              <StyledEmailLink href="mailto:accessibility@ucop.edu">
                accessibility@ucop.edu
              </StyledEmailLink>
            </Typography>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemIcon sx={{ minWidth: '24px' }}>
              <SmallFiberManualRecordIcon size="10px" sx={{ color: UC_BLUE }} />
            </ListItemIcon>
            <Typography variant="body1">
              Learn more about UC's digital accessibility policies and guidelines at{' '}
              <StyledLink
                href="https://www.ucop.edu/electronic-accessibility/"
                target="_blank"
                rel="noopener"
              >
                UCOP Electronic Accessibility
              </StyledLink>
            </Typography>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemIcon sx={{ minWidth: '24px' }}>
              <SmallFiberManualRecordIcon size="10px" sx={{ color: UC_BLUE }} />
            </ListItemIcon>
            <Typography variant="body1">
              This tool is built on open-source technology.{' '}
              <StyledLink
                href="https://github.com/ASUCICREPO/PDF_Accessibility"
                target="_blank"
                rel="noopener"
              >
                View the source code on GitHub.
              </StyledLink>
            </Typography>
          </ListItem>
        </List>
      </Box>

      {/* ─── About UCOP Section ───────────────────────────────────────── */}
      <Box
        sx={{
          p: 4,
          backgroundColor: '#FAFAFA',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h5" component="h2" sx={{ mb: 2, color: UC_BLUE }}>
          About UCOP
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#444', lineHeight: 1.8 }}>
          The University of California Office of the President (UCOP) serves as the
          systemwide headquarters of the University of California, managing its fiscal
          and business operations and supporting the academic and research missions
          across all ten UC campuses, five medical centers, and three national
          laboratories.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#444', lineHeight: 1.8 }}>
          UCOP is committed to ensuring that all digital content produced and
          distributed by the University of California is accessible to people with
          disabilities. This PDF remediation tool is part of that ongoing commitment
          to digital inclusion and equal access to information.
        </Typography>
        <Typography variant="body1" paragraph sx={{ color: '#444', lineHeight: 1.8 }}>
          Learn more at{' '}
          <StyledLink href="https://www.ucop.edu" target="_blank" rel="noopener">
            ucop.edu
          </StyledLink>
        </Typography>
      </Box>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: UC_BLUE,
          color: 'rgba(255,255,255,0.7)',
          py: 3,
          px: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Regents of the University of California. All rights reserved.
        </Typography>
        <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
          University of California Office of the President &nbsp;|&nbsp; Information Technology Services
        </Typography>
      </Box>

      {/* ─── Remediation Process Dialog ───────────────────────────────── */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="remediation-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="remediation-dialog-title" sx={{ pr: 4, position: 'relative' }}>
          <strong>How PDF Remediation Works</strong>
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Our automated remediation process makes your PDFs accessible in three steps:
          </Typography>

          <Typography variant="body2" paragraph>
            <strong>1. Upload:</strong> Sign in with your account and select a PDF document
            to upload for remediation.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>2. Remediate:</strong> The system automatically fixes accessibility issues
            including missing tags, reading order, alt text for images, document titles,
            and structural headings.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>3. Download:</strong> Receive your fully accessible PDF along with
            before-and-after accessibility audit reports.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            <strong>Upload guidelines:</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            • Maximum <strong>15</strong> document uploads per user
          </Typography>
          <Typography variant="body2" paragraph>
            • Documents cannot exceed <strong>10</strong> pages
          </Typography>
          <Typography variant="body2" paragraph>
            • Maximum file size: <strong>25 MB</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            • Only PDF format is accepted
          </Typography>
          <Typography variant="body2" paragraph>
            • Do not upload documents containing sensitive or confidential information
          </Typography>
          <Typography variant="body2" paragraph>
            • Fillable forms and color contrast issues are not addressed by this tool
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage;
