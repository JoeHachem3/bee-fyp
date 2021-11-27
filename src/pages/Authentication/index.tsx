import AuthenticationCard from '../../components/AuthenticationCard';
import classes from './authentication.module.css';

const Authentication = () => {
  return (
    <div className={classes.authentication}>
      <AuthenticationCard show='login' role='owner' />
    </div>
  );
};

export default Authentication;
