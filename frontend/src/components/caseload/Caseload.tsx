import { Suspense, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
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

const fakeData = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    iepDate: new Date('2022-01-01').toLocaleDateString(),
    evalDate: new Date('2022-01-01').toLocaleDateString(),
    school: 'School',
    therapyType: 'Speech',
    teacher: 'Teacher',
    roomNumber: 101,
    gradeLevel: 1,
    dob: new Date('2012-01-01').toLocaleDateString(),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    iepDate: new Date('2022-01-01').toLocaleDateString(),
    evalDate: new Date('2022-01-01').toLocaleDateString(),
    school: 'School',
    therapyType: 'Speech',
    teacher: 'Teacher',
    roomNumber: 101,
    gradeLevel: 1,
    dob: new Date('2012-01-01').toLocaleDateString(),
  },
  {
    id: '3',
    firstName: 'Alice',
    lastName: 'Johnson',
    iepDate: new Date('2022-01-01').toLocaleDateString(),
    evalDate: new Date('2022-01-01').toLocaleDateString(),
    school: 'School',
    therapyType: 'Speech',
    teacher: 'Teacher',
    roomNumber: 101,
    gradeLevel: 1,
    dob: new Date('2012-01-01').toLocaleDateString(),
  },
  {
    id: '4',
    firstName: 'Bob',
    lastName: 'Brown',
    iepDate: new Date('2022-01-01').toLocaleDateString(),
    evalDate: new Date('2022-01-01').toLocaleDateString(),
    school: 'School',
    therapyType: 'Speech',
    teacher: 'Teacher',
    roomNumber: 101,
    gradeLevel: 1,
    dob: new Date('2012-01-01').toLocaleDateString(),
  },
  {
    id: '5',
    firstName: 'Eve',
    lastName: 'White',
    iepDate: new Date('2022-01-01').toLocaleDateString(),
    evalDate: new Date('2022-01-01').toLocaleDateString(),
    school: 'School',
    therapyType: 'Speech',
    teacher: 'Teacher',
    roomNumber: 101,
    gradeLevel: 1,
    dob: new Date('2012-01-01').toLocaleDateString(),
  },
  {
    id: '6',
    firstName: 'Charlie',
    lastName: 'Green',
    iepDate: new Date('2022-01-01').toLocaleDateString(),
    evalDate: new Date('2022-01-01').toLocaleDateString(),
    school: 'School',
    therapyType: 'Speech',
    teacher: 'Teacher',
    roomNumber: 101,
    gradeLevel: 1,
    dob: new Date('2012-01-01').toLocaleDateString(),
  },
];

const StudentInfoTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

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
  //call READ hook
  const {
    data = fakeData,
    isError: isLoadingStudentInfosError,
    isFetching: isFetchingStudentInfos,
    isLoading: isLoadingStudentInfos,
  } = useGetStudentInfos();
  //call UPDATE hook
  const { mutateAsync: updateStudentInfo, isPending: isUpdatingStudentInfo } =
    useUpdateStudentInfo();
  //call DELETE hook
  const { mutateAsync: deleteStudentInfo, isPending: isDeletingStudentInfo } =
    useDeleteStudentInfo();

  //CREATE action
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

  //UPDATE action
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

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<StudentInfo>) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteStudentInfo(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: data as StudentInfo[],
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal', //default ('row', 'cell', 'table', and 'custom' are also available)
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
    //optionally customize modal content
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
    //optionally customize modal content
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
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
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
  const { token } = useAuth();
  return token ? <MaterialReactTable table={table} /> : <p>Not logged in!</p>;
};

//CREATE hook (post new user to api)
function useCreateStudentInfo() {
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
      queryClient.setQueryData(
        ['users'],
        (prevStudentInfos: any) =>
          [
            ...prevStudentInfos,
            {
              ...newStudentInfoInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as StudentInfo[]
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//READ hook (get users from api)
function useGetStudentInfos() {
  return useQuery<StudentInfo[]>({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
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
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StudentInfo } from '../../assets/utils';

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentInfoTable />
      <Suspense fallback={null}>
        <ReactQueryDevtools />
      </Suspense>
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
