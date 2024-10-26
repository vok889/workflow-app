// login.component.ts
import { JsonPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule, AlertModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @Input()
  code = '';

  // router
  route = inject(ActivatedRoute); // add
  router = inject(Router);

  /// auth.service
  authService = inject(AuthService);

  // init form
  fb = inject(NonNullableFormBuilder);
  username = this.fb.control('u1001');
  password = this.fb.control('changeit');

  fg = this.fb.group({
    username: this.username,
    password: this.password
  });

  // error
  error?: any;

  ngOnInit() {
    if (this.code) {
      this.authService
        .loginOauth2(this.code)
        .subscribe(() => this.router.navigate(['/']));
    }
  }

  onLogin() {
    this.authService.login(this.fg.getRawValue()).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'; // add
        this.router.navigate([returnUrl]); // add
      },
      error: (error) => (this.error = error)
    });
  }
}
