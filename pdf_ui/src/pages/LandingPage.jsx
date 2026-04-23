import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';

// MUI Components
import {
  Box,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Container,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

// MUI Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// ─── UC Brand Colors (matching digitalaccessibility.ucop.edu) ────────────
const UC_BLUE = '#003262';
const UC_GOLD = '#FDB515';
const UC_LIGHT_BLUE = '#3B7EA1';
const UC_DARK = '#00213F';
const UC_WARM_GRAY = '#6C6C6C';
const UC_BG_LIGHT = '#F7F7F7';

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

  if (auth.isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}
      >
        <CircularProgress size={50} thickness={4} sx={{ color: UC_BLUE }} />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ─── Top Navigation Bar ───────────────────────────────────────── */}
      <Box
        component="header"
        sx={{
          backgroundColor: UC_BLUE,
          borderBottom: `4px solid ${UC_GOLD}`,
        }}
      >
        <Container maxWidth="lg" sx={{ py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography
              variant="body1"
              component="a"
              href="https://digitalaccessibility.ucop.edu"
              target="_blank"
              rel="noopener"
              sx={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.3px',
                '&:hover': { color: UC_GOLD },
              }}
            >
              University of California
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>|</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 400 }}>
              Digital Accessibility
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: UC_DARK,
          color: '#fff',
          py: { xs: 6, md: 10 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: `linear-gradient(135deg, transparent 0%, rgba(0,50,98,0.3) 100%)`,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="overline"
                sx={{
                  color: UC_GOLD,
                  fontWeight: 700,
                  letterSpacing: '2px',
                  fontSize: '0.8rem',
                  mb: 2,
                  display: 'block',
                }}
              >
                UCOP INFORMATION TECHNOLOGY SERVICES
              </Typography>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.15,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                PDF Accessibility{' '}
                <Box component="span" sx={{ color: UC_GOLD }}>
                  Remediation
                </Box>
              </Typography>

              <Typography
                variant="h6"
                component="p"
                sx={{
                  fontWeight: 400,
                  mb: 3,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.7,
                  maxWidth: '560px',
                  fontSize: { xs: '1rem', md: '1.15rem' },
                }}
              >
                AI-powered open-source solution designed to improve digital
                accessibility for everyone. Automatically remediate PDF documents
                to meet WCAG 2.1 Level AA standards.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <LoadingButton
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleSignIn}
                  loading={loading}
                  loadingIndicator={<CircularProgress size={22} sx={{ color: UC_BLUE }} />}
                  sx={{
                    backgroundColor: UC_GOLD,
                    color: UC_BLUE,
                    fontWeight: 700,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: '6px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#e6a312',
                    },
                    '&.MuiLoadingButton-loading': {
                      backgroundColor: UC_GOLD,
                    },
                  }}
                >
                  Sign In &amp; Remediate
                </LoadingButton>

                <Link
                  href="#"
                  onClick={(e) => { e.preventDefault(); setOpenDialog(true); }}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: UC_GOLD },
                  }}
                >
                  How it works →
                </Link>
              </Box>
            </Grid>

            {/* Right side — key stats */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  p: 4,
                }}
              >
                <Typography variant="overline" sx={{ color: UC_GOLD, letterSpacing: '1.5px', fontWeight: 600 }}>
                  WHAT THIS TOOL DOES
                </Typography>
                {[
                  { icon: <AutoFixHighIcon />, text: 'Automatic PDF tagging & reading order' },
                  { icon: <AccessibilityNewIcon />, text: 'AI-generated alt text for images' },
                  { icon: <DescriptionOutlinedIcon />, text: 'Structured headings & document titles' },
                  { icon: <SecurityIcon />, text: 'Before & after accessibility audit reports' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2.5 }}>
                    <Box sx={{ color: UC_GOLD, display: 'flex' }}>{item.icon}</Box>
                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                      {item.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ─── How It Works Section ─────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ fontWeight: 700, color: UC_BLUE, mb: 1, textAlign: 'center' }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: UC_WARM_GRAY, mb: 5, textAlign: 'center', maxWidth: '600px', mx: 'auto' }}
          >
            Three simple steps to make your PDF documents accessible and compliant.
          </Typography>

          <Grid container spacing={4}>
            {[
              {
                step: '1',
                icon: <CloudUploadOutlinedIcon sx={{ fontSize: 36 }} />,
                title: 'Upload',
                desc: 'Sign in with your account and upload a PDF document for remediation.',
              },
              {
                step: '2',
                icon: <AutoFixHighIcon sx={{ fontSize: 36 }} />,
                title: 'Remediate',
                desc: 'The system automatically fixes tags, reading order, alt text, titles, and headings.',
              },
              {
                step: '3',
                icon: <DownloadOutlinedIcon sx={{ fontSize: 36 }} />,
                title: 'Download',
                desc: 'Receive your accessible PDF along with before-and-after audit reports.',
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    height: '100%',
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 4px 20px rgba(0,50,98,0.08)' },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        backgroundColor: `${UC_BLUE}0A`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: UC_BLUE,
                        mb: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography variant="overline" sx={{ color: UC_LIGHT_BLUE, fontWeight: 700 }}>
                      STEP {item.step}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: UC_BLUE, mt: 0.5, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: UC_WARM_GRAY, lineHeight: 1.7 }}>
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Features Section ─────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: UC_BG_LIGHT }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {[
              {
                icon: <AccessibilityNewIcon sx={{ fontSize: 32 }} />,
                title: 'WCAG 2.1 AA Compliant',
                desc: 'Automated tagging, reading order, and structure to meet federal and state accessibility standards.',
              },
              {
                icon: <SpeedIcon sx={{ fontSize: 32 }} />,
                title: 'Fast Processing',
                desc: 'Upload your PDF and receive a remediated, accessible version in minutes — not days.',
              },
              {
                icon: <DescriptionOutlinedIcon sx={{ fontSize: 32 }} />,
                title: 'PDF & HTML Output',
                desc: 'Choose between accessible PDF or HTML output formats depending on your needs.',
              },
              {
                icon: <SecurityIcon sx={{ fontSize: 32 }} />,
                title: 'Secure & Private',
                desc: 'Documents are processed securely within the UC cloud infrastructure and not retained after processing.',
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Box sx={{ color: UC_BLUE, mb: 1.5 }}>{item.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: UC_BLUE, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: UC_WARM_GRAY, lineHeight: 1.7 }}>
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Upload Guidelines ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fff' }}>
        <Container maxWidth="md">
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: UC_BLUE, mb: 3, textAlign: 'center' }}>
            Upload Guidelines
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Max uploads per user', value: '15 documents' },
              { label: 'Max pages per document', value: '10 pages' },
              { label: 'Max file size', value: '25 MB' },
              { label: 'Accepted format', value: 'PDF only' },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    borderRadius: '8px',
                    backgroundColor: UC_BG_LIGHT,
                  }}
                >
                  <Typography variant="body2" sx={{ color: UC_WARM_GRAY }}>{item.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: UC_BLUE }}>{item.value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Typography variant="body2" sx={{ color: '#999', mt: 2, textAlign: 'center', fontStyle: 'italic' }}>
            Do not upload documents containing sensitive or confidential information.
            Fillable forms and color contrast issues are not addressed by this tool.
          </Typography>
        </Container>
      </Box>

      <Divider />

      {/* ─── Resources Section ────────────────────────────────────────── */}
      <Box sx={{ py: { xs: 5, md: 6 }, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: UC_BLUE, mb: 3 }}>
            Resources
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: 'UCOP Digital Accessibility',
                desc: 'Tools, guidance, and resources to help UC align with federal digital accessibility regulations.',
                href: 'https://digitalaccessibility.ucop.edu',
              },
              {
                title: 'UC IT Accessibility Policy',
                desc: 'Read the current UC IT Accessibility Policy (ITAP), updated in 2026.',
                href: 'https://policy.ucop.edu/doc/7000611',
              },
              {
                title: 'Source Code on GitHub',
                desc: 'This tool is built on open-source technology. View and contribute to the project.',
                href: 'https://github.com/ASUCICREPO/PDF_Accessibility',
              },
            ].map((item, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                  sx={{ display: 'block', height: '100%' }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '10px',
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: UC_BLUE,
                        boxShadow: '0 2px 12px rgba(0,50,98,0.08)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: UC_BLUE }}>
                          {item.title}
                        </Typography>
                        <OpenInNewIcon sx={{ fontSize: 16, color: UC_LIGHT_BLUE }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: UC_WARM_GRAY, lineHeight: 1.6 }}>
                        {item.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ─── Contact Banner ───────────────────────────────────────────── */}
      <Box sx={{ backgroundColor: UC_BG_LIGHT, py: 4 }}>
        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: UC_WARM_GRAY }}>
            Questions or need help? Contact the UCOP IT Accessibility team at{' '}
            <Link
              href="mailto:accessibility@ucop.edu"
              sx={{ color: UC_BLUE, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              accessibility@ucop.edu
            </Link>
          </Typography>
        </Container>
      </Box>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          backgroundColor: UC_BLUE,
          color: 'rgba(255,255,255,0.7)',
          py: 3,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg" sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
              University of California
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              Office of the President &nbsp;·&nbsp; Information Technology Services
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {[
              { label: 'Accessibility', href: 'https://www.ucop.edu/accessibility/index.html' },
              { label: 'Privacy', href: 'https://www.ucop.edu/privacy-statement/index.html' },
              { label: 'Terms of Use', href: 'https://www.ucop.edu/terms/index.html' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  '&:hover': { color: UC_GOLD },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', width: '100%', textAlign: 'center', mt: 1 }}>
            © {new Date().getFullYear()} Regents of the University of California. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* ─── How It Works Dialog ──────────────────────────────────────── */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="remediation-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="remediation-dialog-title" sx={{ pr: 5 }}>
          <strong>How PDF Remediation Works</strong>
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#999' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Our automated remediation process makes your PDFs accessible in three steps:
          </Typography>
          {[
            { step: '1. Upload', desc: 'Sign in with your account and select a PDF document to upload for remediation.' },
            { step: '2. Remediate', desc: 'The system automatically fixes accessibility issues including missing tags, reading order, alt text for images, document titles, and structural headings.' },
            { step: '3. Download', desc: 'Receive your fully accessible PDF along with before-and-after accessibility audit reports.' },
          ].map((item) => (
            <Typography key={item.step} variant="body2" paragraph>
              <strong>{item.step}:</strong> {item.desc}
            </Typography>
          ))}
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Upload guidelines:</Typography>
          {[
            'Maximum 15 document uploads per user',
            'Documents cannot exceed 10 pages',
            'Maximum file size: 25 MB',
            'Only PDF format is accepted',
            'Do not upload documents containing sensitive or confidential information',
            'Fillable forms and color contrast issues are not addressed by this tool',
          ].map((text, i) => (
            <Typography key={i} variant="body2" sx={{ pl: 2, mb: 0.5 }}>• {text}</Typography>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LandingPage;
