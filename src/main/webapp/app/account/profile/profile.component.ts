import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'jhi-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  // Add a non-null assertion operator (!) to profileForm
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.loadUserProfile();
  }

  loadUserProfile() {
    // Load the user data from the server and update the form
    this.userService.getUserProfile().subscribe(data => {
      this.profileForm.patchValue(data);
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.userService.updateUserProfile(this.profileForm.value).subscribe(
        response => {
          console.log('Profile updated successfully');
          // Handle response
        },
        error => {
          console.error('Error updating profile', error);
          // Handle error
        }
      );
    }
  }
}
