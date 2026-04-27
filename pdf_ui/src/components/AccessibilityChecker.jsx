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

/**
 * Converts an accessibility report JSON to a styled HTML document string.
 */
function reportToHtml(report, label, fileName) {
  if (!report) return '';

  const summary = report.Summary || {};
  const detailed = report['Detailed Report'] || {};
  const categories = Object.keys(detailed);
  const timestamp = new Date().toLocaleString();

  const statusColor = (status) => {
    if (status === 'Passed') return '#059669';
    if (status === 'Failed') return '#dc2626';
    return '#d97706';
  };

  const statusBg = (status) => {
    if (status === 'Passed') return '#ecfdf5';
    if (status === 'Failed') return '#fef2f2';
    return '#fffbeb';
  };

  let detailedRows = '';
  categories.forEach((category) => {
    const items = detailed[category] || [];
    detailedRows += `
      <tr><td colspan="3" style="background:#f0f4f8;font-weight:700;padding:10px 12px;font-size:14px;color:#003262;">${category}</td></tr>`;
    items.forEach((item) => {
      detailedRows += `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${item.Rule || ''}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${item.Description || ''}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">
          <span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;color:${statusColor(item.Status)};background:${statusBg(item.Status)};">${item.Status || '—'}</span>
        </td>
      </tr>`;
    });
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${label} Accessibility Report - ${fileName}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #fff; }
  .header { background: #003262; color: #fff; padding: 24px 32px; }
  .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; }
  .header p { margin: 0; font-size: 13px; opacity: 0.7; }
  .content { max-width: 900px; margin: 0 auto; padding: 24px 32px; }
  .summary { display: flex; gap: 16px; margin-bottom: 32px; }
  .summary-card { flex: 1; border-radius: 8px; padding: 16px; text-align: center; border: 1px solid #e5e7eb; }
  .summary-card .value { font-size: 28px; font-weight: 700; }
  .summary-card .label { font-size: 12px; color: #6b7280; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
  th { background: #003262; color: #fff; padding: 10px 12px; text-align: left; font-size: 13px; font-weight: 600; }
  .footer { text-align: center; padding: 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; margin-top: 32px; }
  @media print { body { font-size: 11px; } .header { padding: 16px; } .content { padding: 16px; } }
</style>
</head>
<body>
<div class="header">
  <h1>${label} Accessibility Report</h1>
  <p>${fileName} &nbsp;·&nbsp; Generated ${timestamp} &nbsp;·&nbsp; Adobe Accessibility Checker</p>
</div>
<div class="content">
  <h2 style="font-size:16px;color:#003262;margin-bottom:12px;">Summary</h2>
  <div class="summary">
    <div class="summary-card" style="border-color:#059669;">
      <div class="value" style="color:#059669;">${summary.Passed ?? '—'}</div>
      <div class="label">Passed</div>
    </div>
    <div class="summary-card" style="border-color:#dc2626;">
      <div class="value" style="color:#dc2626;">${summary.Failed ?? '—'}</div>
      <div class="label">Failed</div>
    </div>
    <div class="summary-card" style="border-color:#d97706;">
      <div class="value" style="color:#d97706;">${summary['Needs manual check'] ?? '—'}</div>
      <div class="label">Needs Manual Check</div>
    </div>
  </div>
  ${summary.Description ? `<p style="font-size:13px;color:#6b7280;margin-bottom:24px;">${summary.Description}</p>` : ''}
  <h2 style="font-size:16px;color:#003262;margin-bottom:12px;">Detailed Report</h2>
  <table>
    <thead><tr><th>Rule</th><th>Description</th><th style="text-align:center;">Status</th></tr></thead>
    <tbody>${detailedRows}</tbody>
  </table>
</div>
<div class="footer">
  University of California Office of the President &nbsp;·&nbsp; PDF Accessibility Remediation Tool
</div>
</body>
</html>`;
}

/**
 * Triggers a download of an HTML string as a file.
 */
function downloadHtmlReport(report, label, fileName) {
  const html = reportToHtml(report, label, fileName);
  if (!html) return;
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = fileName.replace(/\.pdf$/i, '');
  link.href = url;
  link.download = `${safeName}_${label.toLowerCase()}_remediation_accessibility_report.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates a combined Before vs After comparison HTML report.
 */
function downloadCombinedHtmlReport(beforeReport, afterReport, fileName) {
  if (!beforeReport || !afterReport) return;

  const beforeSummary = beforeReport.Summary || {};
  const afterSummary = afterReport.Summary || {};
  const beforeDetailed = beforeReport['Detailed Report'] || {};
  const afterDetailed = afterReport['Detailed Report'] || {};
  const timestamp = new Date().toLocaleString();

  const statusColor = (status) => {
    if (status === 'Passed') return '#059669';
    if (status === 'Failed') return '#dc2626';
    return '#d97706';
  };
  const statusBg = (status) => {
    if (status === 'Passed') return '#ecfdf5';
    if (status === 'Failed') return '#fef2f2';
    return '#fffbeb';
  };
  const badge = (status) =>
    `<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;color:${statusColor(status)};background:${statusBg(status)};">${status || '—'}</span>`;

  // Build detailed comparison rows
  const allCategories = new Set([...Object.keys(beforeDetailed), ...Object.keys(afterDetailed)]);
  let detailedRows = '';
  allCategories.forEach((category) => {
    detailedRows += `<tr><td colspan="4" style="background:#f0f4f8;font-weight:700;padding:10px 12px;font-size:14px;color:#003262;">${category}</td></tr>`;
    const beforeItems = beforeDetailed[category] || [];
    const afterItems = afterDetailed[category] || [];
    const afterMap = {};
    afterItems.forEach((item) => { afterMap[item.Rule] = item; });
    const allRules = new Set([...beforeItems.map(i => i.Rule), ...afterItems.map(i => i.Rule)]);

    allRules.forEach((rule) => {
      const b = beforeItems.find(i => i.Rule === rule);
      const a = afterMap[rule];
      const changed = b && a && b.Status !== a.Status;
      const rowBg = changed ? 'background:#f0fdf4;' : '';
      detailedRows += `
      <tr style="${rowBg}">
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${rule}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;">${a ? a.Description : (b ? b.Description : '')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${badge(b ? b.Status : '—')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${badge(a ? a.Status : '—')}</td>
      </tr>`;
    });
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Accessibility Comparison Report - ${fileName}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; color: #1e293b; background: #fff; }
  .header { background: #003262; color: #fff; padding: 24px 32px; }
  .header h1 { margin: 0 0 4px 0; font-size: 20px; font-weight: 700; }
  .header p { margin: 0; font-size: 13px; opacity: 0.7; }
  .content { max-width: 1100px; margin: 0 auto; padding: 24px 32px; }
  .summary-grid { display: flex; gap: 24px; margin-bottom: 32px; }
  .summary-box { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
  .summary-box h3 { margin: 0 0 12px 0; font-size: 15px; color: #003262; }
  .summary-row { display: flex; gap: 12px; }
  .summary-card { flex: 1; border-radius: 8px; padding: 12px; text-align: center; border: 1px solid #e5e7eb; }
  .summary-card .value { font-size: 24px; font-weight: 700; }
  .summary-card .label { font-size: 11px; color: #6b7280; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
  th { background: #003262; color: #fff; padding: 10px 12px; text-align: left; font-size: 13px; font-weight: 600; }
  .improved { background: #f0fdf4; }
  .legend { display: flex; gap: 16px; margin-bottom: 16px; font-size: 12px; color: #6b7280; }
  .legend-item { display: flex; align-items: center; gap: 4px; }
  .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
  .footer { text-align: center; padding: 24px; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; margin-top: 32px; }
  @media print { body { font-size: 11px; } .header { padding: 16px; } .content { padding: 16px; } }
</style>
</head>
<body>
<div class="header">
  <h1>Accessibility Comparison Report</h1>
  <p>${fileName} &nbsp;·&nbsp; Generated ${timestamp} &nbsp;·&nbsp; Before vs After Remediation</p>
</div>
<div class="content">
  <h2 style="font-size:16px;color:#003262;margin-bottom:12px;">Summary Comparison</h2>
  <div class="summary-grid">
    <div class="summary-box">
      <h3>Before Remediation</h3>
      <div class="summary-row">
        <div class="summary-card" style="border-color:#059669;"><div class="value" style="color:#059669;">${beforeSummary.Passed ?? '—'}</div><div class="label">Passed</div></div>
        <div class="summary-card" style="border-color:#dc2626;"><div class="value" style="color:#dc2626;">${beforeSummary.Failed ?? '—'}</div><div class="label">Failed</div></div>
        <div class="summary-card" style="border-color:#d97706;"><div class="value" style="color:#d97706;">${beforeSummary['Needs manual check'] ?? '—'}</div><div class="label">Manual Check</div></div>
      </div>
    </div>
    <div class="summary-box">
      <h3>After Remediation</h3>
      <div class="summary-row">
        <div class="summary-card" style="border-color:#059669;"><div class="value" style="color:#059669;">${afterSummary.Passed ?? '—'}</div><div class="label">Passed</div></div>
        <div class="summary-card" style="border-color:#dc2626;"><div class="value" style="color:#dc2626;">${afterSummary.Failed ?? '—'}</div><div class="label">Failed</div></div>
        <div class="summary-card" style="border-color:#d97706;"><div class="value" style="color:#d97706;">${afterSummary['Needs manual check'] ?? '—'}</div><div class="label">Manual Check</div></div>
      </div>
    </div>
  </div>

  <h2 style="font-size:16px;color:#003262;margin-bottom:8px;">Detailed Comparison</h2>
  <div class="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#f0fdf4;border:1px solid #bbf7d0;"></div> Status improved</div>
  </div>
  <table>
    <thead><tr><th>Rule</th><th>Description</th><th style="text-align:center;">Before</th><th style="text-align:center;">After</th></tr></thead>
    <tbody>${detailedRows}</tbody>
  </table>
</div>
<div class="footer">
  University of California Office of the President &nbsp;·&nbsp; PDF Accessibility Remediation Tool
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = fileName.replace(/\.pdf$/i, '');
  link.href = url;
  link.download = `${safeName}_accessibility_comparison_report.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


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

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
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
            Before (JSON)
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
            After (JSON)
          </Button>

          {/* Download Combined Before/After HTML button */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            disabled={!beforeReport || !afterReport}
            onClick={() => downloadCombinedHtmlReport(beforeReport, afterReport, originalFileName)}
            startIcon={<DownloadIcon fontSize="small" />}
            sx={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Before/After (HTML)
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
