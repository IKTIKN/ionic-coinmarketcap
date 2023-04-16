import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, pipe, retry } from 'rxjs';
import { CoinData, ListingsResponse } from '../interfaces/ListingsResponse';
import { KlinesResponse } from '../interfaces/KlinesResponse';
import { ListData } from '../interfaces/ListData';
import { of } from 'rxjs';
import { HttpOptions } from '@capacitor/core';
export interface Message {
    fromName: string;
    subject: string;
    date: string;
    id: number;
    read: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private http: HttpClient = inject(HttpClient);
    private cmcBaseUrl: string = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/';
    private cmcApiKey = '&CMC_PRO_API_KEY=3bcf4e2f-891b-4afe-8f7c-eed05516919f';

    private limit: number = 100;
    public dataLoaded: boolean = false;
    
    public messages: Message[] = [
        {
            fromName: 'Matt Chorsey',
            subject: 'New event: Trip to Vegas',
            date: '9:32 AM',
            id: 0,
            read: false
        },
        {
            fromName: 'Lauren Ruthford',
            subject: 'Long time no chat',
            date: '6:12 AM',
            id: 1,
            read: false
        },
        {
            fromName: 'Jordan Firth',
            subject: 'Report Results',
            date: '4:55 AM',
            id: 2,
            read: false
        },
        {
            fromName: 'Bill Thomas',
            subject: 'The situation',
            date: 'Yesterday',
            id: 3,
            read: false
        },
        {
            fromName: 'Joanne Pollan',
            subject: 'Updated invitation: Swim lessons',
            date: 'Yesterday',
            id: 4,
            read: false
        },
        {
            fromName: 'Andrea Cornerston',
            subject: 'Last minute ask',
            date: 'Yesterday',
            id: 5,
            read: false
        },
        {
            fromName: 'Moe Chamont',
            subject: 'Family Calendar - Version 1',
            date: 'Last Week',
            id: 6,
            read: false
        },
        {
            fromName: 'Kelly Richardson',
            subject: 'Placeholder Headhots',
            date: 'Last Week',
            id: 7,
            read: false
        }
    ];

    public coindata!: CoinData[];
    public klines!: KlinesResponse[];

    public listData: ListData[] = [];
    // public sortedListData: ListData[] = [];

    skipSymbols: string[] = [];
    // unavailable: string[] = [];

    constructor() {}

    public fetchData() {
        this.getUnavailableSymbols()
            .subscribe((symbols) => {
                this.skipSymbols = symbols;
                // console.log(this.limit)

                if (!this.coindata) {
                    this.getListings()
                        .subscribe((listings) => {
                            this.coindata = listings.data.slice(0, this.limit);
                            // console.log(this.coindata)
                            this.setKlines(this.coindata);
                        });
                }
            });
    }

    private setKlines(coinData: CoinData[]) {
        coinData.forEach((symbol) => {
            if (!this.skipSymbols.includes(symbol.symbol)) {
                this.getKlines(symbol.symbol)
                    .subscribe((klines) => {
                        if (klines.length) {
                            this.listData.push({
                                listing: symbol,
                                klines: klines
                            });
                            if (this.listData.length == this.limit) {
                                this.listData = this.sortMyData(this.listData);
                                this.dataLoaded = true;
                            }
                        }
                        else {
                            console.log('Skipped:', symbol.symbol)
                        }
                    })
            } else { 
                this.limit -= 1;
            }

        });

        
    }

    sortMyData(data: ListData[]) {
        return data.sort(function(first, second) {
            return first.listing.cmc_rank - second.listing.cmc_rank
        });
    }

    public getUnavailableSymbols(): Observable<string[]> {
        const requestUrl = 'assets/unavailable/unavailable-symbols.json';

        return this.http.get<string[]>(requestUrl);

    }
    public getListings(): Observable<ListingsResponse> {
        const requestUrl = 'assets/dummy-data/dummy-listings.json';
        // const requestUrl = `${this.cmcBaseUrl}listings/latest?start=1&limit=${this.limit}&cryptocurrency_type=all&convert=EUR${this.cmcApiKey}`;
        // const requestUrl = this.cmcBaseUrl + 'listings/latest?sort=market_cap&start=10&limit=1&cryptocurrency_type=all&convert=EUR' + this.cmcApiKey +'';
        return this.http.get<ListingsResponse>(requestUrl)
        .pipe(
            retry(0),
            catchError((error: HttpErrorResponse) => {
                console.log(error.headers);
                throw error;
            }),
        );;
    }

    public getKlines(symbol: string): Observable<KlinesResponse> {
        const market = symbol != 'USDT' ? 'USDT' : 'DAI';
        // const requestUrl = `https://api3.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}${market}&interval=1d&limit=7`
        const requestUrl = `assets/dummy-data/dummy-klines.json`

        return this.http.get<KlinesResponse>(requestUrl)
            .pipe(
                retry(9),
                catchError((error: HttpErrorResponse) => {
                    const fallbackValue: KlinesResponse = [];
                    return of(fallbackValue);
                }),
            );
    }


    public getMessages(): Message[] {
        return this.messages;
    }

    public getMessageById(id: number): Message {
        return this.messages[id];
    }
}
