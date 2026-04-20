// src/components/AccessibilityChecker.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { PDFBucket, region } from '../utilities/constants';


function AccessibilityChecker({ originalFileName, updatedFilename, awsCredentials, open, onClose }) {

  // Reports in JSON form
  const [beforeReport, setBeforeReport] = useState(null);
  const [afterReport, setAfterReport] = useState(null);

  // Signed URLs for downloading the JSON reports
  const [beforeReportUrl, setBeforeReportUrl] = useState(null);
  const [afterReportUrl, setAfterReportUrl] = useState(null);

  // Loading states for generating pre-signed URLs
  const [isBeforeUrlLoading, setIsBeforeUrlLoading] = useState(false);
  const [isAfterUrlLoading, setIsAfterUrlLoading] = useState(false);

  // Track which accordion panels are expanded
  const [expandedPanels, setExpandedPanels] = useState({});


  const UpdatedFileKeyWithoutExtension = updatedFilename ? updatedFilename.replace(/\.pdf$/i, '') : '';
  const beforeReportKey = `temp/${UpdatedFileKeyWithoutExtension}/accessability-report/${UpdatedFileKeyWithoutExtension}_accessibility_report_before_remidiation.json`;
  const afterReportKey = `temp/${UpdatedFileKeyWithoutExtension}/accessability-report/COMPLIANT_${UpdatedFileKeyWithoutExtension}_accessibility_report_after_remidiation.json`;

  const OriginalFileKeyWithoutExtension = originalFileName ? originalFileName.replace(/\.pdf$/i, '') : '';
  const desiredFilenameBefore = `COMPLIANT_${OriginalFileKeyWithoutExtension}_before_remediation_accessibility_report.json`;
  const desiredFilenameAfter = `COMPLIANT_${OriginalFileKeyWithoutExtension}_after_remediation_accessibility_report.json`;

  useEffect(() => {
    if(open) {
      setExpandedPanels({});
    }
  }, [open, updatedFilename]);
  
  const s3 = useMemo(() => {
    if (!awsCredentials?.accessKeyId) {
      console.warn('AWS credentials not available yet');
      return null;
    }
    return new S3Client({
      region,
      credentials: {
        accessKeyId: awsCredentials.accessKeyId,
        secretAccessKey: awsCredentials.secretAccessKey,
        sessionToken: awsCredentials.sessionToken,
      },
    });
  }, [awsCredentials]);

  /**
   * Utility to fetch the JSON file from S3 (assuming it exists).
   */
  const fetchJsonFromS3 = useCallback(async (key) => {
    if (!s3) {
      throw new Error('S3 client not initialized - check environment variables and AWS credentials');
    }
    await s3.send(new HeadObjectCommand({ Bucket: PDFBucket, Key: key }));
    const getObjRes = await s3.send(new GetObjectCommand({ Bucket: PDFBucket, Key: key }));
    const bodyString = await getObjRes.Body.transformToString();
    return JSON.parse(bodyString);
  }, [s3]);

  /**
 * Generate a presigned URL to directly download the JSON report from S3 with a specified filename.
 * @param {string} key - The S3 object key.
 * @param {string} filename - The desired filename for the downloaded file.
 * @returns {Promise<string>} - The presigned URL.
 */

const generatePresignedUrl = useCallback(async (key, filename) => {
  if (!s3) {
    throw new Error('S3 client not initialized - check environment variables and AWS credentials');
  }
  const command = new GetObjectCommand({
    Bucket: PDFBucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });
  return await getSignedUrl(s3, command, { expiresIn: 30000 }); // 8.33 hour expiration
}, [s3]);

  /**
   * Fetch the "before" report with retry mechanism
   */
  const fetchBeforeReport = useCallback(async (retries = 3) => {
    // Check if S3 client is available
    if (!s3) {
      console.error('Cannot fetch BEFORE report - S3 client not initialized');
      return;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // First fetch the JSON data
        const data = await fetchJsonFromS3(beforeReportKey);
        setBeforeReport(data);

        // Then generate a presigned URL for that JSON file
        setIsBeforeUrlLoading(true);
        const presignedUrl = await generatePresignedUrl(beforeReportKey, desiredFilenameBefore);
        setBeforeReportUrl(presignedUrl);
        return; // Success, exit the retry loop
      } catch (error) {
        console.log(`Attempt ${attempt}/${retries} failed for BEFORE report:`, error.message);
        if (attempt === retries) {
          console.error('All attempts failed for BEFORE report');
        } else {
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } finally {
        setIsBeforeUrlLoading(false);
      }
    }
  }, [beforeReportKey, desiredFilenameBefore, fetchJsonFromS3, generatePresignedUrl, s3]);

  /**
   * Fetch the "after" report with retry mechanism
   */
  const fetchAfterReport = useCallback(async (retries = 3) => {
    // Check if S3 client is available
    if (!s3) {
      console.error('Cannot fetch AFTER report - S3 client not initialized');
      return;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Fetch the JSON data
        const data = await fetchJsonFromS3(afterReportKey);
        setAfterReport(data);

        // Generate a presigned URL for downloading the AFTER report
        setIsAfterUrlLoading(true);
        const presignedUrl = await generatePresignedUrl(afterReportKey, desiredFilenameAfter);
        setAfterReportUrl(presignedUrl);

        return; // Success, exit the retry loop
      } catch (error) {
        console.log(`Attempt ${attempt}/${retries} failed for AFTER report:`, error.message);
        if (attempt === retries) {
          console.error('All attempts failed for AFTER report');
        } else {
          // Wait 2 seconds before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } finally {
        setIsAfterUrlLoading(false);
      }
    }
  }, [afterReportKey, desiredFilenameAfter, fetchJsonFromS3, generatePresignedUrl, s3]);


  /**
   * Handle dialog close
   */
  const handleClose = () => {
    onClose();
  };


  /**
   * Fetch reports when dialog opens
   */
  useEffect(() => {
    if (open && updatedFilename && s3) {
      console.log('Dialog opened, fetching reports...');
      fetchBeforeReport();
      fetchAfterReport();
    } else if (open && updatedFilename && !s3) {
      console.error('Cannot fetch reports - S3 client not available');
    }
  }, [open, updatedFilename, fetchBeforeReport, fetchAfterReport, s3]);

  /**
   * Renders a summary table (Before/After) if available
   */
  const renderSummary = (report, label) => {
    if (!report) return null;
    const { Summary } = report;
    if (!Summary) return null;

    return (
      <Box sx={{ margin: '1rem 0', flex: 1 }}>
        <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          {`${label} Summary`}
        </Typography>
        <Table size="small" sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Needs Manual Check</TableCell>
              <TableCell>Passed</TableCell>
              <TableCell>Failed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{Summary.Description}</TableCell>
              <TableCell>
                <Chip label={Summary['Needs manual check']} color="warning" />
              </TableCell>
              <TableCell>
                <Chip label={Summary.Passed} color="success" />
              </TableCell>
              <TableCell>
                <Chip label={Summary.Failed} color="error" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  };

  /**
   * Renders the detailed report comparison table
   */
  const renderDetailedReport = () => {
    // If the BEFORE report isn't fetched yet, show a spinner
    if (!beforeReport) return <CircularProgress />;

    const categories = Object.keys(beforeReport['Detailed Report'] || {});

    const allExpanded = categories.length > 0 && categories.every(cat => expandedPanels[cat]);

    const handleToggleAll = () => {
      if (allExpanded) {
        setExpandedPanels({});
      } else {
        const all = {};
        categories.forEach(cat => { all[cat] = true; });
        setExpandedPanels(all);
      }
    };

    const handleAccordionChange = (category) => (_, isExpanded) => {
      setExpandedPanels(prev => ({ ...prev, [category]: isExpanded }));
    };

    return (
      <>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Typography variant="h5" sx={{ color: '#1565c0', fontWeight: 'bold' }}>
            Detailed Report
          </Typography>
          <Button
            variant="text"
            size="small"
            onClick={handleToggleAll}
            sx={{ textTransform: 'none', fontSize: '0.85rem' }}
          >
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </Box>
        {categories.map((category) => {
          const beforeItems = beforeReport['Detailed Report'][category] || [];
          const afterItems = afterReport?.['Detailed Report']?.[category] || [];
          const allRules = new Set([
            ...beforeItems.map((item) => item.Rule),
            ...afterItems.map((item) => item.Rule),
          ]);
          const afterMap = afterItems.reduce((acc, item) => {
            acc[item.Rule] = item;
            return acc;
          }, {});

          return (
            <Accordion
              key={category}
              expanded={!!expandedPanels[category]}
              onChange={handleAccordionChange(category)}
              sx={{ border: '1px solid #ddd', margin: '0.5rem 0' }}
            >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#e3f2fd' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {category}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Table size="small" sx={{ border: '1px solid #ddd' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Rule</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status (Before)</TableCell>
                  <TableCell>Status (After)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from(allRules).map((rule) => {
                  const beforeItem = beforeItems.find((i) => i.Rule === rule);
                  const afterItem = afterMap[rule];

                  return (
                    <TableRow key={rule}>
                      <TableCell>{rule}</TableCell>
                      <TableCell>
                        {afterItem ? afterItem.Description : beforeItem?.Description}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={beforeItem?.Status || '—'}
                          color={
                            beforeItem?.Status === 'Passed'
                              ? 'success'
                              : beforeItem?.Status === 'Failed'
                              ? 'error'
                              : 'warning'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={afterItem?.Status || '—'}
                          color={
                            afterItem?.Status === 'Passed'
                              ? 'success'
                              : afterItem?.Status === 'Failed'
                              ? 'error'
                              : 'warning'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </AccordionDetails>
        </Accordion>
      );
    })}
    </>
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Accessibility Reports (Results By Adobe Accessibility Checker)
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Download BEFORE JSON button */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            disabled={!beforeReportUrl || isBeforeUrlLoading}
            onClick={() => window.open(beforeReportUrl, '_blank', 'noopener,noreferrer')}
            startIcon={isBeforeUrlLoading ? <CircularProgress size={14} /> : <DownloadIcon fontSize="small" />}
            sx={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Before Report
          </Button>

          {/* Download AFTER JSON button */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            disabled={!afterReportUrl || isAfterUrlLoading}
            onClick={() => window.open(afterReportUrl, '_blank', 'noopener,noreferrer')}
            startIcon={isAfterUrlLoading ? <CircularProgress size={14} /> : <DownloadIcon fontSize="small" />}
            sx={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            After Report
          </Button>

          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ marginY: '1rem' }}>
        <Box>
          <Box sx={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {renderSummary(beforeReport, 'Before')}
            {renderSummary(afterReport, 'After')}
          </Box>

          {(!beforeReport || !afterReport) && (
            <Typography variant="body2" color="textSecondary">
              Loading accessibility reports...
            </Typography>
          )}

          <Box sx={{ marginTop: '1rem' }}>{renderDetailedReport()}</Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AccessibilityChecker;
