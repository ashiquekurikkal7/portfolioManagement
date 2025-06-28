import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  BugReport as BugReportIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { auditService } from '../services/auditService';
import { errorHandler } from '../utils/errorHandler';
import { performanceService } from '../services/performanceService';
import { securityService } from '../services/securityService';
import { format } from 'date-fns';

const SystemMonitor = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [errorStats, setErrorStats] = useState({});
  const [performanceStats, setPerformanceStats] = useState({});
  const [securityStats, setSecurityStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedLog, setSelectedLog] = useState(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);

  useEffect(() => {
    loadSystemData();
    const interval = setInterval(loadSystemData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [timeRange, startDate, endDate]);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      
      const [auditData, errorData, performanceData, securityData] = await Promise.all([
        auditService.getAuditLogs({ startDate: startDate.toISOString(), endDate: endDate.toISOString() }),
        errorHandler.getErrorStats(timeRange),
        performanceService.getPerformanceStats(timeRange),
        securityService.getSecurityStats(timeRange)
      ]);

      setAuditLogs(auditData);
      setErrorStats(errorData);
      setPerformanceStats(performanceData);
      setSecurityStats(securityData);
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportLogs = async (format = 'json') => {
    try {
      const data = await auditService.exportAuditLogs(format, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      const blob = new Blob([format === 'json' ? JSON.stringify(data, null, 2) : data], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${format}-${format(new Date(), 'yyyy-MM-dd')}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('AUTH')) return <SecurityIcon />;
    if (action.includes('ERROR')) return <ErrorIcon />;
    if (action.includes('SECURITY')) return <WarningIcon />;
    if (action.includes('SYSTEM')) return <InfoIcon />;
    return <CheckCircleIcon />;
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setLogDialogOpen(true);
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={`${color}.main`}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          System Monitor
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadSystemData}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Statistics Overview */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Actions"
            value={auditLogs.length}
            subtitle="Audit events"
            icon={<AssessmentIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Errors"
            value={errorStats.totalErrors || 0}
            subtitle="System errors"
            icon={<BugReportIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Performance"
            value={`${Math.round(performanceStats.averageResponseTime || 0)}ms`}
            subtitle="Avg response time"
            icon={<SpeedIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Security Events"
            value={securityStats.totalEvents || 0}
            subtitle="Security violations"
            icon={<SecurityIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Performance Metrics"
              action={
                <Tooltip title="Cache hit rate">
                  <Chip 
                    label={`${Math.round(performanceStats.cacheHitRate || 0)}%`}
                    color="primary"
                    size="small"
                  />
                </Tooltip>
              }
            />
            <CardContent>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Cache Hit Rate
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={performanceStats.cacheHitRate || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Average Response Time
                  </Typography>
                  <Typography variant="h6">
                    {Math.round(performanceStats.averageResponseTime || 0)}ms
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Operations
                  </Typography>
                  <Typography variant="h6">
                    {performanceStats.totalOperations || 0}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Security Overview" />
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Blocked IPs</Typography>
                  <Chip label={securityStats.blockedIPs || 0} color="error" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Rate Limit Violations</Typography>
                  <Chip label={securityStats.rateLimitViolations || 0} color="warning" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">Suspicious Inputs</Typography>
                  <Chip label={securityStats.suspiciousInputs || 0} color="info" size="small" />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2">SQL Injection Attempts</Typography>
                  <Chip label={securityStats.sqlInjectionAttempts || 0} color="error" size="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader
          title="Audit Logs"
          action={
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportLogs('json')}
              >
                Export JSON
              </Button>
              <Button
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportLogs('csv')}
              >
                Export CSV
              </Button>
            </Stack>
          }
        />
        <CardContent>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.slice(0, 50).map((log) => (
                  <TableRow 
                    key={log.id} 
                    hover
                    onClick={() => handleLogClick(log)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {getActionIcon(log.action)}
                        <Typography variant="body2">{log.action}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.severity}
                        color={getSeverityColor(log.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        color={log.status === 'success' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {JSON.stringify(log.details).substring(0, 50)}...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog
        open={logDialogOpen}
        onClose={() => setLogDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Log Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedLog.action}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formatTimestamp(selectedLog.timestamp)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Details:
              </Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography
                  variant="body2"
                  component="pre"
                  sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                >
                  {JSON.stringify(selectedLog.details, null, 2)}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SystemMonitor; 