import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import * as echarts from 'echarts/types/dist/echarts';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { ListData } from 'src/app/interfaces/ListData';
import { DataService } from 'src/app/services/data.service';

@Component({
    selector: 'app-cmc-list-item',
    templateUrl: './cmc-list-item.component.html',
    styleUrls: ['./cmc-list-item.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, NgxEchartsModule],
    providers: [

        {
            provide: NGX_ECHARTS_CONFIG,
            useFactory: () => ({ echarts: () => import('echarts') })
        }

    ]
})
export class CmcListItemComponent implements OnInit {
    @Input() coin!: ListData;

    private data = inject(DataService);
    
    option: echarts.EChartsOption = {
        grid: {
            left: '72px',
            right: '0px',
            top: '0px',
            bottom: '0px'
         },
        xAxis: {
            show: false,
            axisLabel: {
                show: false
            },
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            boundaryGap: false,

        },
        yAxis: {
            show: false,
            axisLabel: {
                show: false
            },
            min: 27500,
            max: 31800,
            type: 'value',
            boundaryGap: [0, '100%'],

        },
        series: [
            {
                data: [27938, 28323, 29637, 30200, 29888, 30466, 30373],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: 'green',
                    opacity: 0.12
                },
                lineStyle: {
                    color: 'green',
                    width: 1
                },
                itemStyle: {
                    opacity: 0
                },
                animation: false,
            },
            
        ]
    };


    constructor() {

    }

    ngOnInit() { }

    logoLink(id: number): string {
        return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`
    }

    priceColor(price: number): string {
        return price > 0 ? 'success' : 'danger';
    }
}
