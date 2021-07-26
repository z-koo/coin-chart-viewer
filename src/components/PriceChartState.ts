import { data } from '../sampleData';
import GlobalState from './GlobalState';

export default class PriceChartState {
  public static instance: PriceChartState | null = null;
  globalState: GlobalState;
  dataOnView: data[];
  public maxPriceOnView: number;
  public minPriceOnView: number;
  public minMaxDiff: number;

  private constructor() {
    this.globalState = GlobalState.getInstance();
    this.update();
  }

  public static getInstance() {
    if (PriceChartState.instance === null) {
      PriceChartState.instance = new PriceChartState();
    }
    return PriceChartState.instance;
  }

  public update(): void {
    this.maxPriceOnView = this.calcMaxPrice();
    this.minPriceOnView = this.calcMinPrice();
    this.minMaxDiff = this.calcMinMaxDiff();
  }

  public calcMaxPrice(): number {
    return this.globalState.dataOnView.reduce(
      (maxPrice: number, data: data) => {
        return Math.max(maxPrice, data.high_price);
      },
      0
    );
  }

  public calcMinPrice(): number {
    return this.globalState.dataOnView.reduce(
      (minPrice: number, data: data) => {
        return Math.min(minPrice, data.low_price);
      },
      Infinity
    );
  }

  private calcMinMaxDiff(): number {
    return this.maxPriceOnView - this.minPriceOnView;
  }
}
