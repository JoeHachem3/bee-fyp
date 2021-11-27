import classes from './employees.module.css';
import SpeedDial from '../../components/SpeedDial';
import { Person, Place } from '@mui/icons-material';
import {
  SpeedDialAction,
  Dialog,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import AuthenticationCard from '../../components/AuthenticationCard';
import { DragDropContext } from 'react-beautiful-dnd';
import DragAndDropList from '../../components/DragAndDropList';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/state';

const Employees = () => {
  const user = useSelector((state: AppState) => state.userReducer.user);

  const [isAuthenticationCardOpen, setIsAuthenticationCardOpen] =
    useState<boolean>(false);

  const actions = [
    {
      icon: <Person />,
      name: 'Add Employee',
      onClick: () => setIsAuthenticationCardOpen(true),
    },
    {
      icon: <Place />,
      name: 'Add Bee Hive',
      onClick: () => setIsAuthenticationCardOpen(true),
    },
  ];
  console.log(user.employees);
  return (
    <div className={classes.employees}>
      {user.employees?.map((employee) => (
        <Card
          key={employee.email}
          sx={{ backgroundColor: 'var(--color-background-110)' }}
        >
          <CardContent>
            <Typography
              sx={{ color: 'var(--color-text)' }}
            >{`${employee.firstName} ${employee.lastName}`}</Typography>
          </CardContent>
        </Card>
      ))}
      {/* <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) {
            return;
          }
        }}
      >
        <div>
          {user.employees?.map((employee) => (
            <DragAndDropList
              internalScroll
              key={employee.email}
              listId={employee.email}
              listType='CARD'
              beeHives={employee.beeHives}
            />
          ))}
        </div>
      </DragDropContext> */}

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
