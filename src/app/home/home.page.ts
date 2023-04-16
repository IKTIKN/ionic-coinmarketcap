import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';
import { CmcListItemComponent } from '../components/cmc-list-item/cmc-list-item.component';
import { ListData } from '../interfaces/ListData';
import { CoinData } from '../interfaces/ListingsResponse';
import { MessageComponent } from '../message/message.component';

import { DataService, Message } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, MessageComponent, CmcListItemComponent],
  providers: [HttpClient]
})
export class HomePage {
  public data = inject(DataService);
    
  constructor() {}

  ngOnInit() {
    this.data.fetchData();
  }
  
  getCoinData(): ListData[] {
    return this.data.listData;
  }

  getMessages(): Message[] {
    return this.data.getMessages();
  }




}
