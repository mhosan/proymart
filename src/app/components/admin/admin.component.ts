import { Component } from '@angular/core';
import { NgIf } from '@angular/common'; // Importa NgIf


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  users: any[] = [
    { id: 1, name: 'User 1', age: 20 },
    { id: 2, name: 'User 2', age: 21 },
    { id: 3, name: 'User 3', age: 22 },
    { id: 4, name: 'User 4', age: 23 },
    { id: 5, name: 'User 5', age: 24 },
    { id: 6, name: 'User 6', age: 25 },
    { id: 7, name: 'User 7', age: 26 },
    { id: 8, name: 'User 8', age: 27 },
    { id: 9, name: 'User 9', age: 28 },
  ];
  selectedUser: any = null;
  fetchUsers() {
    // fetch users from the server
  }

  selectUser(user: any): void {
    console.log(user);
    this.users.forEach(u => {
      u.selected = false;
    });

    user.selected = true;
    this.selectedUser = user;
  }

}
