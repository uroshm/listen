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
import { useAuth } from '../../auth/AuthContext';

const StudentInfoTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [studentInfo, setStudentInfo] = useState<StudentInfo[]>([]);

  const columns = useMemo<MRT_ColumnDef<StudentInfo>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        size: 80,
      },
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
  const { mutateAsync: createStudentInfo, isPending: isCreatingStudentInfo } =
    useCreateStudentInfo();
  const {
    data = studentInfo,
    isError: isLoadingStudentInfosError,
    isFetching: isFetchingStudentInfos,
    isLoading: isLoadingStudentInfos,
  } = useGetStudentInfos();
  const { mutateAsync: updateStudentInfo, isPending: isUpdatingStudentInfo } =
    useUpdateStudentInfo();
  const { mutateAsync: deleteStudentInfo, isPending: isDeletingStudentInfo } =
    useDeleteStudentInfo();

  const handleCreateStudentInfo: MRT_TableOptions<StudentInfo>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateStudentInfo(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createStudentInfo(values);
      table.setCreatingRow(null); //exit creating mode
    };

  const handleSaveStudentInfo: MRT_TableOptions<StudentInfo>['onEditingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateStudentInfo(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateStudentInfo(values);
      table.setEditingRow(null); //exit editing mode
    };

  const openDeleteConfirmModal = (row: MRT_Row<StudentInfo>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteStudentInfo(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: data as StudentInfo[],
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingStudentInfosError
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
    onCreatingRowSave: handleCreateStudentInfo,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveStudentInfo,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New StudentInfo</DialogTitle>
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
        <DialogTitle variant="h3">Edit StudentInfo</DialogTitle>
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
        <Tooltip title="Test Student">
          <IconButton onClick={() => handleStudentTest(row.original)}>
            <span role="img" aria-label="test">
              🧪
            </span>
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
          table.setCreatingRow(createRow(table), {});
        }}
      >
        Add Student
      </Button>
    ),
    state: {
      isLoading: isLoadingStudentInfos,
      isSaving:
        isCreatingStudentInfo || isUpdatingStudentInfo || isDeletingStudentInfo,
      showAlertBanner: isLoadingStudentInfosError,
      showProgressBars: isFetchingStudentInfos,
    },
  });
  const { getToken } = useAuth();

  // Add a function to handle student testing
  const handleStudentTest = (student: StudentInfo) => {
    console.log('Testing student:', student);
    // Add more logic here, such as navigating to a test page or starting a test for the specific student
  };

  return getToken() ? (
    <MaterialReactTable table={table} />
  ) : (
    <p>Not logged in!</p>
  );
};

//CREATE hook (post new user to api)
function useCreateStudentInfo() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: StudentInfo) => {
      console.log(
        JSON.stringify({
          firstName: student.firstName,
          lastName: student.lastName,
          iepDate: student.iepDate,
          evalDate: student.evalDate,
          school: student.school,
          therapyType: student.therapyType,
          teacher: student.teacher,
          roomNumber: student.roomNumber,
          gradeLevel: student.gradeLevel,
          dob: student.dob,
        })
      );
      const response = await fetch(
        'http://localhost:8080/listen/createPatient',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: student.firstName,
            lastName: student.lastName,
            iepDate: student.iepDate,
            evalDate: student.evalDate,
            school: student.school,
            therapyType: student.therapyType,
            teacher: student.teacher,
            roomNumber: student.roomNumber,
            gradeLevel: student.gradeLevel,
            dob: student.dob,
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

function useGetStudentInfos() {
  const { getToken } = useAuth();

  return useQuery<StudentInfo[]>({
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
        (patient: any): StudentInfo => ({
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

//UPDATE hook (put user in api)
function useUpdateStudentInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user: StudentInfo) => {
      //send api update request here
      console.log('user: ' + user);
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newStudentInfoInfo: StudentInfo) => {
      queryClient.setQueryData(['users'], (prevStudentInfos: any) =>
        prevStudentInfos?.map((prevStudentInfo: StudentInfo) =>
          prevStudentInfo.id === newStudentInfoInfo.id
            ? newStudentInfoInfo
            : prevStudentInfo
        )
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//DELETE hook (delete user in api)
function useDeleteStudentInfo() {
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
      queryClient.setQueryData(['users'], (prevStudentInfos: any) =>
        prevStudentInfos?.filter((user: StudentInfo) => user.id !== userId)
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//react query setup in App.tsx
import { StudentInfo } from '../../utils';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentInfoTable />
      <Suspense fallback={null}></Suspense>
    </QueryClientProvider>
  );
}

const validateRequired = (value: string) => !!value.length;
function validateStudentInfo(user: StudentInfo) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
    // email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}
