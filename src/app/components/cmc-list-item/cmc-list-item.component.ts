import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ListData } from 'src/app/interfaces/ListData';

@Component({
    selector: 'app-cmc-list-item',
    templateUrl: './cmc-list-item.component.html',
    styleUrls: ['./cmc-list-item.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class CmcListItemComponent implements OnInit {
    @Input() coin!: ListData;

    constructor() { }

    ngOnInit() { }

    logoLink(id: number): string {
        return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`
    }

    priceColor(price: number): string {
        return price > 0 ? 'success' : 'danger';
    }
}
