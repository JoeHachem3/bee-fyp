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
import { BeeHiveModel, EmployeeModel } from '../../database/models';
import * as userActions from '../../store/user/actions';
import { updateBeeHive, updateEmployee } from '../../database';
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

  const [ownerBeeHives, setOwnerBeeHives] = useState<BeeHiveModel[]>([]);
  const [deletedBeeHives, setDeletedBeeHives] = useState<BeeHiveModel[]>([]);

  useEffect(() => {
    const beeHives = Object.entries(user?.beeHives || {}).map(
      ([key, beeHive]) => beeHive,
    );

    const ownerBeeHives = beeHives.filter(
      (beeHive) =>
        !beeHive.deletedAt &&
        !Object.entries(user.employees).find(([key, employee]) =>
          employee.worksIn.includes(beeHive.id),
        ),
    );

    const deletedBeeHives = beeHives.filter((beeHive) => beeHive.deletedAt);

    setOwnerBeeHives(ownerBeeHives);
    setDeletedBeeHives(deletedBeeHives);
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
      const beeHive = deletedBeeHives[source.index];
      updateBeeHive(beeHive.ref, { deletedAt: '' });

      if (destination.droppableId !== user.email) {
        const employee = JSON.parse(
          JSON.stringify(user.employees[destination.droppableId]),
        ) as EmployeeModel;
        const currentBeeHive = deletedBeeHives[source.index]?.id;

        if (!currentBeeHive) return;

        const worksIn = [];
        employee.worksIn.forEach((beeHive, index) => {
          if (index === destination.index) {
            worksIn.includes(currentBeeHive) || worksIn.push(currentBeeHive);
          }
          worksIn.includes(beeHive) || worksIn.push(beeHive);
        });
        if (employee.worksIn.length <= destination.index)
          worksIn.includes(currentBeeHive) || worksIn.push(currentBeeHive);

        employee.worksIn = worksIn;

        updateEmployee(employee.ref, { worksIn });
        setEmployees({ ...user.employees, [employee.email]: employee });
      }
    } else if (destination.droppableId === 'deleted') {
      if (source.droppableId === user.email) {
        const currentBeeHive = ownerBeeHives[source.index];
        if (!currentBeeHive) return;

        updateBeeHive(currentBeeHive.ref, {
          deletedAt: moment().format('MM/DD/YYYY'),
        });
      } else {
        const employee = JSON.parse(
          JSON.stringify(user.employees[source.droppableId]),
        ) as EmployeeModel;
        const currentBeeHive = user.beeHives[employee.worksIn[source.index]];

        if (!currentBeeHive) return;

        const worksIn = employee.worksIn.filter(
          (beeHive) => beeHive !== currentBeeHive.id,
        );

        employee.worksIn = worksIn;

        updateEmployee(employee.ref, { worksIn });
        updateBeeHive(currentBeeHive.ref, {
          deletedAt: moment().format('MM/DD/YYYY'),
        });
        setEmployees({ ...user.employees, [employee.email]: employee });
      }
    } else if (source.droppableId === user.email) {
      const employee = JSON.parse(
        JSON.stringify(user.employees[destination.droppableId]),
      ) as EmployeeModel;
      const currentBeeHive = ownerBeeHives[source.index]?.id;

      if (!currentBeeHive) return;

      const worksIn = [];
      employee.worksIn.forEach((beeHive, index) => {
        if (index === destination.index) {
          worksIn.includes(currentBeeHive) || worksIn.push(currentBeeHive);
        }
        worksIn.includes(beeHive) || worksIn.push(beeHive);
      });
      if (employee.worksIn.length <= destination.index)
        worksIn.includes(currentBeeHive) || worksIn.push(currentBeeHive);

      employee.worksIn = worksIn;

      updateEmployee(employee.ref, { worksIn });
      setEmployees({ ...user.employees, [employee.email]: employee });
    } else if (destination.droppableId === user.email) {
      const employee = JSON.parse(
        JSON.stringify(user.employees[source.droppableId]),
      ) as EmployeeModel;

      const worksIn = employee.worksIn.filter(
        (beeHive, index) => index !== source.index,
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
      const currentBeeHive = sourceEmployee.worksIn[source.index];
      sourceEmployee.worksIn = employees[source.droppableId].worksIn.filter(
        (beeHive) => beeHive !== currentBeeHive,
      );

      const destinationBeeHives = [];
      destinationEmployee.worksIn.forEach((beeHive, index) => {
        if (index === destination.index) {
          destinationBeeHives.includes(currentBeeHive) ||
            destinationBeeHives.push(currentBeeHive);
        }
        destinationBeeHives.includes(beeHive) ||
          destinationBeeHives.push(beeHive);
      });

      if (destinationEmployee.worksIn.length <= destination.index)
        destinationBeeHives.includes(currentBeeHive) ||
          destinationBeeHives.push(currentBeeHive);

      destinationEmployee.worksIn = destinationBeeHives;
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
      {user?.beeHives && (
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
                  beeHives={ownerBeeHives}
                />
              </CardContent>
            </Card>
          </div>

          <div className={classes.employeesList}>
            {Object.entries(user.employees || {})?.map(([key, employee]) => (
              <Card
                key={key}
                sx={{
                  backgroundColor: 'var(--color-background-110)',
                }}
              >
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
                    beeHives={employee.worksIn.map((id) => user.beeHives[id])}
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
                  beeHives={deletedBeeHives}
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
