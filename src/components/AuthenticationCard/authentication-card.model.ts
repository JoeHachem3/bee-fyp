interface AuthenticationCardModel {
  show?: 'login' | 'register';
  hideErrorMessage?: boolean;
  isLogin?: boolean;
  role?: 'owner' | 'employee' | 'admin';
  afterSubmit?: () => any;
}

export default AuthenticationCardModel;
