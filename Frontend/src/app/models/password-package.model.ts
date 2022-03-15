export class PasswordPackage {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(id: string, currentPassword: string, newpassword: string, confirmPassword: string) {
    this.id = id;
    this.currentPassword = currentPassword;
    this.newPassword = newpassword;
    this.confirmPassword = confirmPassword;
  }
}
