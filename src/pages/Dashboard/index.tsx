import classes from './dashboard.module.css';
import SpeedDial from '../../components/SpeedDial';
import { Person, Close } from '@mui/icons-material';
import {
  SpeedDialAction,
  Dialog,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import AuthenticationCard from '../../components/AuthenticationCard';
import { DragDropContext } from 'react-beautiful-dnd';
import DragAndDropList from '../../components/DragAndDropList';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../store/state';
import { ApiaryModel, EmployeeModel } from '../../database/models';
import * as userActions from '../../store/user/actions';
import { updateApiary, updateEmployee } from '../../database';
import moment from 'moment';

const Dashboard = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: AppState) => state.userReducer.user);

  const setEmployees = useCallback(
    (employees: { [key: string]: EmployeeModel }) =>
      dispatch(userActions.setEmployees(employees)),
    [dispatch],
  );

  const [isAuthenticationCardOpen, setIsAuthenticationCardOpen] =
    useState<boolean>(false);

  const [ownerApiaries, setOwnerApiaries] = useState<ApiaryModel[]>([]);
  const [deletedApiaries, setDeletedApiaries] = useState<ApiaryModel[]>([]);

  useEffect(() => {
    const apiaries = Object.entries(user?.apiaries || {}).map(
      ([key, apiary]) => apiary,
    );

    const ownerApiaries = apiaries.filter(
      (apiary) =>
        !apiary.deletedAt &&
        !Object.entries(user.employees).find(([key, employee]) =>
          employee.worksIn.includes(apiary.id),
        ),
    );

    const deletedApiaries = apiaries.filter((apiary) => apiary.deletedAt);

    setOwnerApiaries(ownerApiaries);
    setDeletedApiaries(deletedApiaries);
  }, [user]);

  const actions = [
    {
      icon: <Person />,
      name: 'Add Employee',
      onClick: () => setIsAuthenticationCardOpen(true),
    },
  ];

  const onDragEnd = ({
    destination,
    source,
  }: {
    destination: { droppableId: string; index: number };
    source: { droppableId: string; index: number };
  }) => {
    if (
      !destination ||
      (source.droppableId === user.email &&
        destination.droppableId === user.email) ||
      (source.droppableId === 'deleted' &&
        destination.droppableId === 'deleted')
    )
      return;

    if (source.droppableId === 'deleted') {
      const apiary = deletedApiaries[source.index];
      updateApiary(apiary.ref, { deletedAt: '' });

      if (destination.droppableId !== user.email) {
        const employee = JSON.parse(
          JSON.stringify(user.employees[destination.droppableId]),
        ) as EmployeeModel;
        const currentApiary = deletedApiaries[source.index]?.id;

        if (!currentApiary) return;

        const worksIn = [];
        employee.worksIn.forEach((apiary, index) => {
          if (index === destination.index) {
            worksIn.includes(currentApiary) || worksIn.push(currentApiary);
          }
          worksIn.includes(apiary) || worksIn.push(apiary);
        });
        if (employee.worksIn.length <= destination.index)
          worksIn.includes(currentApiary) || worksIn.push(currentApiary);

        employee.worksIn = worksIn;

        updateEmployee(employee.ref, { worksIn });
        setEmployees({ ...user.employees, [employee.email]: employee });
      }
    } else if (destination.droppableId === 'deleted') {
      if (source.droppableId === user.email) {
        const currentApiary = ownerApiaries[source.index];
        if (!currentApiary) return;

        updateApiary(currentApiary.ref, {
          deletedAt: moment().format('MM/DD/YYYY'),
        });
      } else {
        const employee = JSON.parse(
          JSON.stringify(user.employees[source.droppableId]),
        ) as EmployeeModel;
        const currentApiary = user.apiaries[employee.worksIn[source.index]];

        if (!currentApiary) return;

        const worksIn = employee.worksIn.filter(
          (apiary) => apiary !== currentApiary.id,
        );

        employee.worksIn = worksIn;

        updateEmployee(employee.ref, { worksIn });
        updateApiary(currentApiary.ref, {
          deletedAt: moment().format('MM/DD/YYYY'),
        });
        setEmployees({ ...user.employees, [employee.email]: employee });
      }
    } else if (source.droppableId === user.email) {
      const employee = JSON.parse(
        JSON.stringify(user.employees[destination.droppableId]),
      ) as EmployeeModel;
      const currentApiary = ownerApiaries[source.index]?.id;

      if (!currentApiary) return;

      const worksIn = [];
      employee.worksIn.forEach((apiary, index) => {
        if (index === destination.index) {
          worksIn.includes(currentApiary) || worksIn.push(currentApiary);
        }
        worksIn.includes(apiary) || worksIn.push(apiary);
      });
      if (employee.worksIn.length <= destination.index)
        worksIn.includes(currentApiary) || worksIn.push(currentApiary);

      employee.worksIn = worksIn;

      updateEmployee(employee.ref, { worksIn });
      setEmployees({ ...user.employees, [employee.email]: employee });
    } else if (destination.droppableId === user.email) {
      const employee = JSON.parse(
        JSON.stringify(user.employees[source.droppableId]),
      ) as EmployeeModel;

      const worksIn = employee.worksIn.filter(
        (apiary, index) => index !== source.index,
      );

      employee.worksIn = worksIn;

      updateEmployee(employee.ref, { worksIn });
      setEmployees({ ...user.employees, [employee.email]: employee });
    } else {
      const employees = JSON.parse(JSON.stringify(user.employees)) as {
        [key: string]: EmployeeModel;
      };
      const sourceEmployee = employees[source.droppableId];
      const destinationEmployee = employees[destination.droppableId];
      const currentApiary = sourceEmployee.worksIn[source.index];
      sourceEmployee.worksIn = employees[source.droppableId].worksIn.filter(
        (apiary) => apiary !== currentApiary,
      );

      const destinationApiaries = [];
      destinationEmployee.worksIn.forEach((apiary, index) => {
        if (index === destination.index) {
          destinationApiaries.includes(currentApiary) ||
            destinationApiaries.push(currentApiary);
        }
        destinationApiaries.includes(apiary) ||
          destinationApiaries.push(apiary);
      });

      if (destinationEmployee.worksIn.length <= destination.index)
        destinationApiaries.includes(currentApiary) ||
          destinationApiaries.push(currentApiary);

      destinationEmployee.worksIn = destinationApiaries;
      updateEmployee(sourceEmployee.ref, { worksIn: sourceEmployee.worksIn });
      updateEmployee(destinationEmployee.ref, {
        worksIn: destinationEmployee.worksIn,
      });
      setEmployees(employees);
    }
  };

  const removeEmployee = (employee: EmployeeModel) => {
    updateEmployee(employee.ref, { worksFor: '', worksIn: [] });
  };

  return (
    <div className={classes.dashboard}>
      {user?.apiaries && (
        <DragDropContext
          onDragEnd={({ destination, source }) =>
            onDragEnd({ destination, source })
          }
        >
          <div className={classes.owner}>
            <Card
              sx={{
                backgroundColor: 'var(--color-background-110)',
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                }}
              >
                <Chip
                  sx={{ color: 'var(--color-text)' }}
                  label={`${user.firstName} ${user.lastName}`}
                />
                <DragAndDropList
                  direction='horizontal'
                  internalScroll
                  listId={user.email}
                  list={ownerApiaries}
                />
              </CardContent>
            </Card>
          </div>

          <div className={classes.employeesList}>
            {Object.entries(user.employees || {})?.map(([key, employee]) => (
              <Card className={classes.employee} key={key}>
                <CardContent
                  sx={{
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      sx={{ color: 'var(--color-text)' }}
                      label={`${employee.firstName} ${employee.lastName}`}
                    />
                    <IconButton onClick={() => removeEmployee(employee)}>
                      <Close sx={{ fill: 'var(--color-text)' }} />
                    </IconButton>
                  </div>
                  <DragAndDropList
                    internalScroll
                    key={key}
                    listId={key}
                    list={employee.worksIn.map((id) => user.apiaries[id])}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={classes.deleted}>
            <Card
              sx={{
                backgroundColor: 'var(--color-warning-faded)',
                width: '100%',
                border: '1px solid var(--color-warning)',
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                }}
              >
                <Chip sx={{ color: 'var(--color-text)' }} label={`Deleted`} />
                <DragAndDropList
                  direction='horizontal'
                  internalScroll
                  listId={'deleted'}
                  list={deletedApiaries}
                />
              </CardContent>
            </Card>
          </div>
        </DragDropContext>
      )}

      <Dialog
        open={isAuthenticationCardOpen}
        onClose={() => setIsAuthenticationCardOpen(false)}
      >
        <AuthenticationCard show='register' role='employee' />
      </Dialog>
      <SpeedDial>
        {actions.map((action) => (
          <SpeedDialAction
            className={classes['speed-dial-action']}
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default Dashboard;
