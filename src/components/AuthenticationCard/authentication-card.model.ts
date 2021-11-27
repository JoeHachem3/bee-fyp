interface AuthenticationCardModel {
  show?: 'login' | 'register';
  hideErrorMessage?: boolean;
  isLogin?: boolean;
  role?: 'owner' | 'employee' | 'admin';
}

export default AuthenticationCardModel;
