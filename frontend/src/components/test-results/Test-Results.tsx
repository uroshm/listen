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
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../../auth/AuthContext';
import './Test-Results.css';
import { TestResult } from '../../utils';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';

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

          // If patient was passed via location state, set it as selected
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

  // Fetch tests based on selected patient
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

      // Set currently playing track
      setCurrentlyPlayingId(testId);

      const binaryString = atob(audioData);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(blob);

      // Create audio element
      const audio = new Audio(audioUrl);

      // Add cleanup when finished playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        setCurrentlyPlayingId(null);
      };

      // Play the audio
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
        setCurrentlyPlayingId(null);
      });
    } catch (error) {
      console.error('Error processing audio data:', error);
      setCurrentlyPlayingId(null);
    }
  };

  const handleViewRawData = (data: string) => {
    // Implement raw data view logic
    console.log('Viewing raw data:', data);
  };

  const handleViewAnalysis = (analysis: string) => {
    // Implement analysis view logic
    console.log('Viewing analysis:', analysis);
  };

  // Define columns for Material React Table
  const columns = useMemo<MRT_ColumnDef<TestResult>[]>(
    () => [
      {
        accessorFn: (row) => {
          if (row.patient) {
            return `${row.patient.firstName} ${row.patient.lastName}`;
          }
          return selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
            : 'Unknown';
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Raw Data">
              <IconButton
                onClick={() => handleViewRawData(row.original.testData)}
                sx={{ color: '#2196f3' }}
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Play Audio">
              <IconButton
                onClick={() =>
                  handlePlayAudio(row.original.testAudio, row.original.id)
                }
                sx={{
                  color:
                    currentlyPlayingId === row.original.id
                      ? '#4CAF50'
                      : undefined,
                }}
                className={
                  currentlyPlayingId === row.original.id ? 'audio-playing' : ''
                }
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
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="View Analysis">
              <IconButton
                onClick={() => handleViewAnalysis(row.original.testAnalysis)}
                sx={{ color: '#9c27b0' }}
              >
                <AnalyticsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [currentlyPlayingId, selectedPatient]
  );

  // Configure Material React Table
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
      sx: {
        minHeight: '500px',
      },
    },
    renderEmptyRowsFallback: () => (
      <Typography
        align="center"
        sx={{ py: 6, color: '#666', fontSize: '1rem' }}
      >
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
    <Box sx={{ padding: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexGrow: 1,
            minWidth: '250px',
          }}
        >
          <PersonIcon color="primary" />
          <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="patient-select-label">Patient</InputLabel>
            <Select
              labelId="patient-select-label"
              id="patient-select"
              value={selectedPatientId}
              label="Patient"
              onChange={handlePatientChange}
              sx={{ borderRadius: '16px' }}
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

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
    </Box>
  ) : (
    <p>
      Please <a href="/login">log in</a> to view test results.
    </p>
  );
};

export default TestResults;
