import classes from './employees.module.css';
import SpeedDial from '../../components/SpeedDial';
import { Person, Place, Close } from '@mui/icons-material';
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
import { updateEmployee } from '../../database';

const Employees = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: AppState) => state.userReducer.user);

  const setEmployees = useCallback(
    (employees: { [key: string]: EmployeeModel }) =>
      dispatch(userActions.setEmployees(employees)),
    [dispatch],
  );

  const [isAuthenticationCardOpen, setIsAuthenticationCardOpen] =
    useState<boolean>(false);
  const [isBeeHiveCardOpen, setIsBeeHiveCardOpen] = useState<boolean>(false);

  const [beeHivesArray, setBeeHivesArray] = useState<BeeHiveModel[]>([]);

  useEffect(() => {
    const beeHives = Object.entries(user?.beeHives || {}).map(
      ([key, beeHive]) => beeHive,
    );
    setBeeHivesArray(beeHives);
  }, [user]);

  const actions = [
    {
      icon: <Person />,
      name: 'Add Employee',
      onClick: () => setIsAuthenticationCardOpen(true),
    },
    {
      icon: <Place />,
      name: 'Add Bee Hive',
      onClick: () => setIsBeeHiveCardOpen(true),
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
        destination.droppableId === user.email)
    )
      return;
    else if (source.droppableId === user.email) {
      const employee = JSON.parse(
        JSON.stringify(user.employees[destination.droppableId]),
      ) as EmployeeModel;
      const currentBeeHive = beeHivesArray[source.index].id;

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
    updateEmployee(employee.ref, { worksFor: '' });
  };

  return (
    <div className={classes.employees}>
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
                  beeHives={beeHivesArray.filter(
                    (beeHive) =>
                      !Object.entries(user.employees).find(([key, employee]) =>
                        employee.worksIn.includes(beeHive.id),
                      ),
                  )}
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

export default Employees;
