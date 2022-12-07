import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { User } from 'src/types/types';
import { WebRequestService } from '../web-request.service';

interface FormObject {
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
}

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  username: string = '';
  constructor(private WebReqService: WebRequestService) {
    this.username = sessionStorage.getItem('username')!;
  }
  ngOnInit(): void {
    this.getUser();
    console.log('hello');
  }

  userObject: any;
  getUser() {
    this.WebReqService.get(
      `users/${sessionStorage.getItem('username')}`
    ).subscribe((res: any) => {
      this.userObject = res.result;
      this.userObject.newUsername = null;
      this.userObject.oldUsername = sessionStorage.getItem(`username`);
      console.log(this.userObject);
    });
  }

  editProfileForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    phoneNumber: new FormControl(null, [Validators.required]),
    bio: new FormControl(null, [Validators.required]),
  });
  profilePicForm = new FormGroup({
    profilePic: new FormControl(null, [Validators.required]),
  });

  onSubmit() {
    //Object.keys will find all the keys in the form group such as Username, Firstname ...
    //for each key we will use that as an index for form.value[key].
    //'keyof formobject' must be specified
    Object.keys(this.editProfileForm.controls).forEach((control: string) => {
      if (this.editProfileForm.value[control as keyof FormObject] != null) {
        console.log('hello');
        switch (control) {
          case 'username':
            this.userObject.username =
              this.editProfileForm.value[control as keyof FormObject]!;
            break;
          case 'firstName':
            this.userObject.firstName =
              this.editProfileForm.value[control as keyof FormObject]!;
            break;
          case 'lastName':
            this.userObject.lastName =
              this.editProfileForm.value[control as keyof FormObject]!;
            break;
          case 'phoneNumber':
            this.userObject.phoneNumber =
              this.editProfileForm.value[control as keyof FormObject]!;
            break;
          case 'bio':
            this.userObject.bio =
              this.editProfileForm.value[control as keyof FormObject]!;
            break;
        }
      }
    });
    this.editUserRequest();
    this.editProfileForm.reset();
  }

  editUserRequest() {
    this.WebReqService.patch('editUser', this.userObject).subscribe(() => {
      (res: any) => {
        console.log(res);
      };
    });
  }
}
