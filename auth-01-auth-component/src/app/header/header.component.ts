import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit{
  constructor(private dataStorageService: DataStorageService, private authService: AuthService) {}

  ngOnInit(){
    this.authService.user.subscribe();
  }
  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }
}
