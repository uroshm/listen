import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../../auth/AuthContext';
import './Test-Results.css';
import { TestResult } from '../../utils';

const TestResults: React.FC = () => {
  const location = useLocation();
  const { patient } = location.state || {};
  const { getToken } = useAuth();
  const [tests, setTests] = React.useState<TestResult[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/listen/getTests', {
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

    fetchData();
  }, [getToken]);

  const handlePlayAudio = (audioData: string) => {
    try {
      if (!audioData) {
        console.error('Audio data is undefined or null');
        return;
      }

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
      };

      // Play the audio
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } catch (error) {
      console.error('Error processing audio data:', error);
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

  return (
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
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <PersonIcon color="primary" />
          <Typography variant="subtitle1" component="span">
            Patient:
          </Typography>
          <Chip
            label={
              patient
                ? `${patient.firstName} ${patient.lastName}`
                : 'All Patients'
            }
            color="primary"
            variant="outlined"
          />
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

      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: '#333', fontWeight: 500, mb: 3 }}
      >
        Test Results
        {patient && (
          <span>
            {' '}
            for {patient.firstName} {patient.lastName}
          </span>
        )}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Test Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Test Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Raw Data
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Raw Audio
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                AI Analysis
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow
                key={test.id}
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>{test.testName}</TableCell>
                <TableCell>{test.testType}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Raw Data">
                    <IconButton
                      onClick={() => handleViewRawData(test.testData)}
                      sx={{ color: '#2196f3' }}
                    >
                      <DataObjectIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Play Audio">
                    <IconButton
                      onClick={() => handlePlayAudio(test.testAudio)}
                      sx={{ color: '#4CAF50' }}
                    >
                      <PlayCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Analysis">
                    <IconButton
                      onClick={() => handleViewAnalysis(test.testAnalysis)}
                      sx={{ color: '#9c27b0' }}
                    >
                      <AnalyticsIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {tests.length === 0 && (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: '#f8f8f8',
            borderRadius: '8px',
          }}
        >
          <Typography variant="body1" sx={{ color: '#666' }}>
            No tests found for this patient.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default TestResults;
