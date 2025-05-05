import { Suspense, useMemo, useState, useEffect } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
  createRow,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  Typography,
  Chip,
  SelectChangeEvent,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScienceIcon from '@mui/icons-material/Science';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import WordList from '../wordlist/WordList';
import './Caseload.css';

interface TestConfig {
  testName: string;
  speechSound: string;
}

interface TestConfigModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (config: TestConfig) => void;
}

const TestConfigModal: React.FC<TestConfigModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [testConfig, setTestConfig] = useState<TestConfig>({
    testName: '',
    speechSound: '',
  });

  const handleSubmit = () => {
    onSubmit(testConfig);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Assign Test</DialogTitle>
      <DialogContent>
        <Box className="form-container">
          <FormControl fullWidth>
            <InputLabel>Test Name</InputLabel>
            <Select
              value={testConfig.testName}
              label="Test Name"
              onChange={(e) =>
                setTestConfig({ ...testConfig, testName: e.target.value })
              }
            >
              <MenuItem value="initial">Initial Sound Test</MenuItem>
              <MenuItem value="final">Final Sound Test</MenuItem>
              <MenuItem value="medial">Medial Sound Test</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Speech Sound</InputLabel>
            <Select
              value={testConfig.speechSound}
              label="Speech Sound"
              onChange={(e) =>
                setTestConfig({ ...testConfig, speechSound: e.target.value })
              }
            >
              <MenuItem value="s">/s/</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PatientInfoTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [patientInfo] = useState<PatientInfo[]>([]);
  const [wordListOpen, setWordListOpen] = useState(false);
  const [testConfig, setTestConfig] = useState<{
    testName: string;
    speechSound: string;
  } | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(
    null
  );
  const [selectedPatientId, setSelectedPatientId] = useState<string>('all');

  const handlePatientChange = (event: SelectChangeEvent) => {
    setSelectedPatientId(event.target.value);
  };

  const columns = useMemo<MRT_ColumnDef<PatientInfo>[]>(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'iepDate',
        header: 'IEP Date',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'evalDate',
        header: 'Eval Date',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'school',
        header: 'School',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'therapyType',
        header: 'Therapy Type',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'teacher',
        header: 'Teacher',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'roomNumber',
        header: 'Room Number',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'gradeLevel',
        header: 'Grade Level',
        muiEditTextFieldProps: {
          required: true,
        },
      },
      {
        accessorKey: 'dob',
        header: 'DOB',
        muiEditTextFieldProps: {
          required: true,
        },
      },
    ],
    [validationErrors]
  );

  const { mutateAsync: createPatientInfo, isPending: isCreatingPatientInfo } =
    useCreatePatientInfo();
  const {
    data = patientInfo,
    isError: isLoadingPatientInfosError,
    isFetching: isFetchingPatientInfos,
    isLoading: isLoadingPatientInfos,
  } = useGetPatientInfos();
  const { mutateAsync: updatePatientInfo, isPending: isUpdatingPatientInfo } =
    useUpdatePatientInfo();
  const { mutateAsync: deletePatientInfo, isPending: isDeletingPatientInfo } =
    useDeletePatientInfo();

  const handleCreatePatientInfo: MRT_TableOptions<PatientInfo>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validatePatientInfo(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createPatientInfo(values);
      table.setCreatingRow(null);
    };

  const handleSavePatientInfo: MRT_TableOptions<PatientInfo>['onEditingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validatePatientInfo(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updatePatientInfo(values);
      table.setEditingRow(null);
    };

  const openDeleteConfirmModal = (row: MRT_Row<PatientInfo>) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatientInfo(row.original.id);
    }
  };

  const filteredData = useMemo(() => {
    return selectedPatientId === 'all'
      ? data
      : data.filter((patient) => patient.id.toString() === selectedPatientId);
  }, [data, selectedPatientId]);

  const table = useMaterialReactTable({
    columns,
    data: filteredData,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingPatientInfosError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      className: 'table-container',
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreatePatientInfo,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSavePatientInfo,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogContent className="dialog-content">
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit PatientInfo</DialogTitle>
        <DialogContent className="edit-dialog-content">
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box className="row-actions">
        <Tooltip title="Edit Patient">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Patient">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Start Test">
          <IconButton
            onClick={() => {
              setSelectedPatient(row.original);
              setTestModalOpen(true);
            }}
          >
            <ScienceIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="View Test Results for this Patient">
          <IconButton
            onClick={() => handleViewTests(row.original)}
            color="info"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(createRow(table));
        }}
      >
        Add Patient
      </Button>
    ),
    state: {
      isLoading: isLoadingPatientInfos,
      isSaving:
        isCreatingPatientInfo || isUpdatingPatientInfo || isDeletingPatientInfo,
      showAlertBanner: isLoadingPatientInfosError,
      showProgressBars: isFetchingPatientInfos,
    },
  });
  const { getToken } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const highlightPatientId = location.state?.highlightPatientId;

  const [testModalOpen, setTestModalOpen] = useState(false);

  const handleTestConfigSubmit = (config: TestConfig) => {
    setTestConfig(config);
    setTestModalOpen(false);
    setWordListOpen(true);
  };

  const handleViewTests = (patient: PatientInfo) => {
    navigate('/tests', {
      state: {
        patient: patient,
      },
    });
  };

  useEffect(() => {
    if (highlightPatientId && data.length > 0) {
      if (selectedPatientId !== highlightPatientId.toString()) {
        setSelectedPatientId(highlightPatientId.toString());
      }

      requestAnimationFrame(() => {
        const patientRow = document.getElementById(
          `patient-row-${highlightPatientId}`
        );
        if (patientRow) {
          patientRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
          patientRow.classList.add('highlighted-row');
          setTimeout(() => {
            patientRow.classList.remove('highlighted-row');
          }, 3000);
        }
      });
    }
    // Remove data from dependencies to prevent loops when data changes
  }, [highlightPatientId]);

  return getToken() ? (
    <div className="caseload-container">
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
              {data.map((patient) => (
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
            label={`${selectedPatientId === 'all' ? data.length : data.filter((p) => p.id.toString() === selectedPatientId).length} Patients`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Paper>

      <MaterialReactTable table={table} />
      <TestConfigModal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onSubmit={handleTestConfigSubmit}
      />
      <WordList
        open={wordListOpen}
        onClose={() => setWordListOpen(false)}
        patient={selectedPatient}
        testConfig={testConfig}
      />
    </div>
  ) : (
    <p>
      {' '}
      Please <a href="/login">log in</a> to view your patients.
    </p>
  );
};

function useCreatePatientInfo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patient: PatientInfo) => {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found.');
      }
      const response = await fetch(
        'http://localhost:8080/listen/records/createPatient',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: patient.firstName,
            lastName: patient.lastName,
            iepDate: patient.iepDate,
            evalDate: patient.evalDate,
            school: patient.school,
            therapyType: patient.therapyType,
            teacher: patient.teacher,
            roomNumber: patient.roomNumber,
            gradeLevel: patient.gradeLevel,
            dob: patient.dob,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to create patient');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

function useGetPatientInfos() {
  const { getToken } = useAuth();

  return useQuery<PatientInfo[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:8080/listen/records/getMyPatients',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      return data.map(
        (patient: any): PatientInfo => ({
          id: patient.id?.toString() || '',
          firstName: patient.firstName || '',
          lastName: patient.lastName || '',
          iepDate: patient.iepDate
            ? new Date(patient.iepDate).toLocaleDateString()
            : '',
          evalDate: patient.evalDate
            ? new Date(patient.evalDate).toLocaleDateString()
            : '',
          school: patient.school || '',
          therapyType: patient.therapyType || '',
          teacher: patient.teacher || '',
          roomNumber: patient.roomNumber?.toString() || '',
          gradeLevel: patient.gradeLevel?.toString() || '',
          dob: patient.dob ? new Date(patient.dob).toLocaleDateString() : '',
        })
      );
    },
    refetchOnWindowFocus: false,
  });
}

function useUpdatePatientInfo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patient: PatientInfo) => {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found.');
      }
      const response = await fetch(
        `http://localhost:8080/listen/records/editPatient/${patient.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            iepDate: patient.iepDate,
            evalDate: patient.evalDate,
            school: patient.school,
            therapyType: patient.therapyType,
            teacher: patient.teacher,
            roomNumber: patient.roomNumber,
            gradeLevel: patient.gradeLevel,
            dob: patient.dob,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to edit patient');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onMutate: (newPatientInfoInfo: PatientInfo) => {
      queryClient.setQueryData(['users'], (prevPatientInfos: any) =>
        prevPatientInfos?.map((prevPatientInfo: PatientInfo) =>
          prevPatientInfo.id === newPatientInfoInfo.id
            ? newPatientInfoInfo
            : prevPatientInfo
        )
      );
    },
  });
}

function useDeletePatientInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      console.log('userId: ' + userId);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return Promise.resolve();
    },
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevPatientInfos: any) =>
        prevPatientInfos?.filter((user: PatientInfo) => user.id !== userId)
      );
    },
  });
}

import { PatientInfo } from '../../utils';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PatientInfoTable />
      <Suspense fallback={null}></Suspense>
    </QueryClientProvider>
  );
}

const validateRequired = (value: string) => !!value.length;
function validatePatientInfo(user: PatientInfo) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
  };
}
