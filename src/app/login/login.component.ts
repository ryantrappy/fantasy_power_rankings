import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IUser} from './IUser';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: 'login.component.html',
})
export class LoginDialogComponent {
  username = '';
  password = '';
  errorText = '';

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  setErrorText(text: string): void {
    this.errorText = text;
  }

  login(): void {
    console.log('now')
    this.authService.login(this.username, this.password).subscribe((response) => {
      this.authService.setAuth(response);
      this.setErrorText('');
      this.dialogRef.close();
      },
      (err: any) => {
      console.error(err);
        this.setErrorText('Invalid password or username');
      });
  }

}
