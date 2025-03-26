import { Suspense, useMemo, useState } from 'react';
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
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 300,
            mt: 2,
          }}
        >
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
              <MenuItem value="r">/r/</MenuItem>
              <MenuItem value="s">/s/</MenuItem>
              <MenuItem value="l">/l/</MenuItem>
              <MenuItem value="th">/th/</MenuItem>
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

  const columns = useMemo<MRT_ColumnDef<PatientInfo>[]>(
    () => [
      // {
      //   accessorKey: 'id',
      //   header: 'Id',
      //   enableEditing: false,
      //   size: 80,
      // },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when user focuses on the input
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

  //call CREATE hook
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
      table.setCreatingRow(null); //exit creating mode
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
      table.setEditingRow(null); //exit editing mode
    };

  const openDeleteConfirmModal = (row: MRT_Row<PatientInfo>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deletePatientInfo(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: data as PatientInfo[],
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
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreatePatientInfo,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSavePatientInfo,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit PatientInfo</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Assign Patient a Test">
          <IconButton onClick={() => handlePatientTest(row.original)}>
            <span role="img" aria-label="test">
              🧪
            </span>
          </IconButton>
        </Tooltip>
        <Tooltip title="View Tests">
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
          // table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
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
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(
    null
  );

  const handlePatientTest = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setTestModalOpen(true);
  };

  const handleTestConfigSubmit = (config: TestConfig) => {
    if (selectedPatient) {
      navigate('/wordlist', {
        state: {
          patient: selectedPatient,
          testConfig: config,
        },
      });
    }
  };

  const handleViewTests = (patient: PatientInfo) => {
    navigate('/tests', {
      state: {
        patient: patient,
      },
    });
  };

  return getToken() ? (
    <>
      <MaterialReactTable table={table} />
      <TestConfigModal
        open={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        onSubmit={handleTestConfigSubmit}
      />
    </>
  ) : (
    <p>
      {' '}
      Please <a href="/login">log in</a> to view your patients.
    </p>
  );
};

//CREATE hook (post new user to api)
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
        'http://localhost:8080/listen/createPatient',
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
      // Invalidate and refetch the patients list
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
        'http://localhost:8080/listen/getMyPatients',
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
        `http://localhost:8080/listen/editPatient/${patient.id}`,
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
      // Invalidate and refetch the patients list after successful update
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    //client side optimistic update
    onMutate: (newPatientInfoInfo: PatientInfo) => {
      queryClient.setQueryData(['users'], (prevPatientInfos: any) =>
        prevPatientInfos?.map((prevPatientInfo: PatientInfo) =>
          prevPatientInfo.id === newPatientInfoInfo.id
            ? newPatientInfoInfo
            : prevPatientInfo
        )
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeletePatientInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      //send api update request here
      console.log('userId: ' + userId);
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevPatientInfos: any) =>
        prevPatientInfos?.filter((user: PatientInfo) => user.id !== userId)
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//react query setup in App.tsx
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
    // email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}
