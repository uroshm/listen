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
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';
import { useAuth } from '../../auth/AuthContext';

interface Test {
  id: string;
  testName: string;
  testType: string;
  rawData?: string;
  testData: string;
  testAudio: string;
  aiAnalysis?: string;
  createdAt?: string;
  testAnalysis: string;
}

const Tests: React.FC = () => {
  const location = useLocation();
  const { patient } = location.state || {};
  const { getToken } = useAuth();
  const [tests, setTests] = React.useState<Test[]>([]);

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
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Test Results for {patient?.firstName} {patient?.lastName}
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Test Type</TableCell>
              <TableCell align="center">Raw Data</TableCell>
              <TableCell align="center">Raw Audio</TableCell>
              <TableCell align="center">AI Analysis</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test.id}>
                <TableCell>{test.testName}</TableCell>
                <TableCell>{test.testType}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Raw Data">
                    <IconButton
                      onClick={() => handleViewRawData(test.testData)}
                    >
                      <DataObjectIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Play Audio">
                    <IconButton onClick={() => handlePlayAudio(test.testAudio)}>
                      <PlayCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Analysis">
                    <IconButton
                      onClick={() => handleViewAnalysis(test.testAnalysis)}
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
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
          No tests found for this patient.
        </Typography>
      )}
    </Box>
  );
};

export default Tests;
