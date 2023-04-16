import { KlinesResponse } from "./KlinesResponse";
import { CoinData } from "./ListingsResponse";

export interface ListData {
    listing: CoinData,
    klines: KlinesResponse
}