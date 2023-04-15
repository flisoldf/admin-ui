import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public readonly siteKey = environment.captcha.siteKey;

  public form!: FormGroup;
  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'pt-BR'; // 'en'
  public type!: 'image' | 'audio';
  public useGlobalDomain: boolean = false;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  public captchaTouched: boolean = false;

  public loading: boolean = false;

  validationMessages = {
    'username': [
      {type: 'required', message: 'O email é obrigatório'},
      {type: 'minlength', message: 'O email precisa ter ao menos 10 caracteres'},
      {type: 'maxlength', message: 'O email não pode ter mais que 121 caracteres'},
      // { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      // { type: 'validUsername', message: 'Your username has already been taken' }
      {type: 'email', message: 'Forneça um email válido'}
    ],
    // 'email': [
    //   { type: 'required', message: 'Email is required' },
    //   { type: 'pattern', message: 'Enter a valid email' }
    // ],
    // 'confirm_password': [
    //   { type: 'required', message: 'Confirm password is required' },
    //   { type: 'areEqual', message: 'Password mismatch' }
    // ],
    'password': [
      {type: 'required', message: 'A senha é obrigatória'},
      {type: 'minlength', message: 'A senha precisa ter ao menos 3 caracteres'},
      // {type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number'}
    ],
    'recaptcha': [
      {type: 'required', message: 'Responda o captcha acima'}
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private router: Router,
    private http: HttpClient) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(121), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(121)]], // Validators.pattern("^[a-zA-Z]+$")
      recaptcha: ['', [Validators.required]]
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.form!.get(fieldName)!;
    return field.invalid && (field.dirty || field.touched);
  }

  handleReset(): void {
    // console.log('LoginComponent.handleReset');
    this.captchaSuccess = false;
    this.captchaResponse = undefined;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleExpire(): void {
    // console.log('LoginComponent.handleExpire');
    this.captchaSuccess = false;
    this.captchaIsExpired = true;
    this.cdr.detectChanges();
  }

  handleLoad(): void {
    // console.log('LoginComponent.handleLoad');
    this.captchaIsLoaded = true;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  handleSuccess(captchaResponse: string): void {
    // console.log('LoginComponent.handleSuccess', captchaResponse);
    this.captchaSuccess = true;
    this.captchaResponse = captchaResponse;
    this.captchaIsExpired = false;
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.captchaTouched = true;
    // console.log(this.form.value);
    // console.log(this.form.get('username')!.errors);
    // console.log(this.form.get('password')!.errors);
    // console.log(this.form.get('recaptcha')!.errors);
    // console.log(this.form.valid);

    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Falha',
        detail: 'Preencha corretamente o formulário.'
      });
    } else {
      this.loading = true;

      // TODO: Add on service
      this.http.post(environment.apiUrl + '/users/authenticate', {
        'username': this.form.get('username')?.value,
        'password': this.form.get('password')?.value
      }).subscribe({
        next: (r) => {
          // console.log(r);
          localStorage.setItem('user', JSON.stringify(r));

          this.router.navigate(['/', 'main']);
          // .then(nav => {
          //   console.log(nav); // true if navigation is successful
          // }, err => {
          //   console.log(err) // when there's an error
          // });
        },
        error: (e) => {
          // console.log(e);
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Falha',
            detail: 'Verifique seus dados e tente novamente.'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

}
