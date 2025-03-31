import React, { useEffect, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Snackbar,
  Alert,
  Fade,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../auth/AuthContext';
import './Test-Results.css';
import { TestResult } from '../../utils';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import { TransitionProps } from '@mui/material/transitions';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// Slide transition for the dialog
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
}

const TestResults: React.FC = () => {
  const location = useLocation();
  const locationPatient = location.state?.patient;
  const { getToken } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(
    locationPatient || null
  );
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(
    null
  );

  // State for analysis modal
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [currentTestName, setCurrentTestName] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  // State for raw data modal
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState<string>('');
  const [currentDataTestName, setCurrentDataTestName] = useState<string>('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          'http://localhost:8080/listen/getMyPatients',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPatients(data);

          if (locationPatient) {
            setSelectedPatientId(locationPatient.id.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, [getToken, locationPatient]);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const url =
          selectedPatientId === 'all'
            ? 'http://localhost:8080/listen/getTests'
            : `http://localhost:8080/listen/getTests?patientId=${selectedPatientId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTests(data);
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      }
    };

    fetchTests();
  }, [getToken, selectedPatientId]);

  const handlePatientChange = (event: SelectChangeEvent) => {
    const patientId = event.target.value;
    setSelectedPatientId(patientId);

    if (patientId === 'all') {
      setSelectedPatient(null);
    } else {
      const patient =
        patients.find((p) => p.id.toString() === patientId) || null;
      setSelectedPatient(patient);
    }
  };

  const handlePlayAudio = (audioData: string, testId: string) => {
    try {
      if (!audioData) {
        console.error('Audio data is undefined or null');
        return;
      }

      setCurrentlyPlayingId(testId);

      const binaryString = atob(audioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setCurrentlyPlayingId(null);
      };

      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setCurrentlyPlayingId(null);
      });
    } catch (error) {
      console.error('Error processing audio data:', error);
      setCurrentlyPlayingId(null);
    }
  };

  const handleViewRawData = (data: string, testName: string) => {
    setCurrentData(data);
    setCurrentDataTestName(testName);
    setDataModalOpen(true);
  };

  const handleCloseDataModal = () => {
    setDataModalOpen(false);
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(currentData).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const handleViewAnalysis = (analysis: string, testName: string) => {
    setCurrentAnalysis(analysis);
    setCurrentTestName(testName);
    setAnalysisModalOpen(true);
  };

  const handleCloseAnalysisModal = () => {
    setAnalysisModalOpen(false);
  };

  const handleCopyAnalysis = () => {
    navigator.clipboard.writeText(currentAnalysis).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  const columns = useMemo<MRT_ColumnDef<TestResult>[]>(
    () => [
      {
        accessorFn: (row) => {
          const patient = patients.find((p) => p.id === row.patientId);
          return patient
            ? `${patient.firstName} ${patient.lastName}`
            : 'Unknown Patient';
        },
        id: 'patientName',
        header: 'Patient',
        size: 180,
      },
      {
        accessorKey: 'testName',
        header: 'Name',
        size: 180,
      },
      {
        accessorKey: 'testType',
        header: 'Type',
        size: 150,
      },
      {
        id: 'rawData',
        header: 'Data',
        size: 100,
        Cell: ({ row }) => (
          <Box className="center-content">
            <Tooltip title="View Raw Data">
              <IconButton
                onClick={() =>
                  handleViewRawData(
                    row.original.testData,
                    row.original.testName
                  )
                }
                className="data-button"
              >
                <DataObjectIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
      {
        id: 'rawAudio',
        header: 'Audio',
        size: 100,
        Cell: ({ row }) => (
          <Box className="center-content">
            <Tooltip title="Play Audio">
              <IconButton
                onClick={() =>
                  handlePlayAudio(row.original.testAudio, row.original.id)
                }
                className={`audio-button ${
                  currentlyPlayingId === row.original.id ? 'audio-playing' : ''
                }`}
              >
                <PlayCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
      {
        id: 'aiAnalysis',
        header: 'Analysis',
        size: 100,
        Cell: ({ row }) => (
          <Box className="center-content">
            <Tooltip title="View Analysis">
              <IconButton
                onClick={() =>
                  handleViewAnalysis(
                    row.original.testAnalysis,
                    row.original.testName
                  )
                }
                className="analysis-button"
              >
                <AnalyticsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [currentlyPlayingId, selectedPatient, patients]
  );

  const table = useMaterialReactTable({
    columns,
    data: tests,
    enableColumnResizing: true,
    enableFullScreenToggle: false,
    enableDensityToggle: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableSorting: true,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
      density: 'comfortable',
    },
    muiTableContainerProps: {
      className: 'table-container',
    },
    renderEmptyRowsFallback: () => (
      <Typography className="empty-message">
        No tests found for{' '}
        {selectedPatient
          ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
          : 'any patients'}
        .
      </Typography>
    ),
    state: {
      isLoading: false,
      showProgressBars: false,
    },
  });

  return getToken() ? (
    <Box className="test-results-container">
      <Paper className="header-paper" elevation={2}>
        <Box className="patient-selector-container">
          <PersonIcon color="primary" />
          <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="patient-select-label">Patient</InputLabel>
            <Select
              labelId="patient-select-label"
              id="patient-select"
              value={selectedPatientId}
              label="Patient"
              onChange={handlePatientChange}
              className="rounded-select"
            >
              <MenuItem value="all">All Patients</MenuItem>
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id.toString()}>
                  {patient.firstName} {patient.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box className="records-indicator">
          <CalendarTodayIcon color="secondary" />
          <Typography variant="subtitle1" component="span">
            Records:
          </Typography>
          <Chip
            label={`${tests.length} Tests`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Paper>

      <MaterialReactTable table={table} />

      {/* Analysis Modal */}
      <Dialog
        open={analysisModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAnalysisModal}
        aria-describedby="analysis-description"
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
          className: 'analysis-modal',
        }}
      >
        <DialogTitle className="modal-header">
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            Analysis: {currentTestName}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseAnalysisModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="modal-content">
          <Fade in={analysisModalOpen} timeout={300}>
            <Box>
              <Paper elevation={0} className="analysis-paper">
                <div className="analysis-content">
                  <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                    {currentAnalysis}
                  </ReactMarkdown>
                </div>
              </Paper>
            </Box>
          </Fade>
        </DialogContent>

        <DialogActions className="modal-actions">
          <Button
            onClick={handleCopyAnalysis}
            variant="outlined"
            color="secondary"
            startIcon={<ContentCopyIcon />}
            className="rounded-button"
          >
            Copy to Clipboard
          </Button>
          <Button
            onClick={handleCloseAnalysisModal}
            variant="contained"
            color="secondary"
            className="rounded-button"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Raw Data Modal */}
      <Dialog
        open={dataModalOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDataModal}
        aria-describedby="data-description"
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 5,
          className: 'data-modal',
        }}
      >
        <DialogTitle className="data-modal-header">
          <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
            Raw Data: {currentDataTestName}
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseDataModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers className="modal-content">
          <Fade in={dataModalOpen} timeout={300}>
            <Box>
              <Paper elevation={0} className="data-paper">
                <pre className="data-content">{currentData}</pre>
              </Paper>
            </Box>
          </Fade>
        </DialogContent>

        <DialogActions className="modal-actions">
          <Button
            onClick={handleCopyData}
            variant="outlined"
            color="primary"
            startIcon={<ContentCopyIcon />}
            className="rounded-button"
          >
            Copy to Clipboard
          </Button>
          <Button
            onClick={handleCloseDataModal}
            variant="contained"
            color="primary"
            className="rounded-button"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Success Notification */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
      >
        <Alert
          onClose={() => setCopySuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Analysis copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  ) : (
    <p>
      Please <a href="/login">log in</a> to view test results.
    </p>
  );
};

export default TestResults;
