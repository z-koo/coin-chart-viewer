import strokeLine from '../../lib/strokeLine';
import options from '../../options';
import TrVolumeChartState from '../TrVolumeChartState';
import TickScaling from './TickScaling';

export default class TrVolumeChartYTick {
  public state: TrVolumeChartState = TrVolumeChartState.getInstance();
  public minVal: number;
  public maxVal: number;
  public tickScale: TickScaling;

  constructor(public ctx: CanvasRenderingContext2D | null) {
    this.tickScale = new TickScaling(0, this.state.maxTrVolumeOnView);
  }

  public update(): void {
    this.tickScale.setMinMaxPoints(0, this.state.maxTrVolumeOnView);
    this.tickScale.calculate();
    this.draw();
  }

  public draw(): void {
    if (!this.ctx) return;
    const { fillStyle, leftPadding, fontFamily } = options.yAxis;
    const { layout } = this.state.globalState;

    const formatTick = getformatTickFunc(this.tickScale.tickSpacing);
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = fillStyle;
    this.ctx.strokeStyle = options.color.gridLine;
    this.ctx.font = `${this.state.globalState.fontSize.yAxis}px ${fontFamily}`;
    let currY = this.getTickStart();
    while (currY <= this.state.maxTrVolumeOnView) {
      const scaledCurrTick = this.yScale(currY);
      this.ctx.fillText(
        formatTick(currY),
        layout.global.margin.left + layout.width + leftPadding,
        scaledCurrTick
      );

      const gridStartX = this.state.globalState.layout.lower.margin.left;
      const gridEndX = gridStartX + this.state.globalState.layout.width;
      strokeLine(
        this.ctx,
        gridStartX,
        scaledCurrTick,
        gridEndX,
        scaledCurrTick
      );
      currY += this.tickScale.tickSpacing;
    }
  }

  private getTickStart(): number {
    let currY = this.tickScale.minTick;
    while (currY < 0) {
      currY += this.tickScale.tickSpacing;
    }
    return currY;
  }

  private yScale(value: number): number {
    return (
      (1 - value / this.state.maxTrVolumeOnView) *
        this.state.globalState.layout.lower.height +
      this.state.globalState.layout.lower.margin.top
    );
  }
}

function getformatTickFunc(spacing: number): (num: number) => string {
  const digit = Math.log10(spacing) / 3;

  let divisor = 1;
  let unit = '';
  if (digit >= 3) {
    divisor = 10 ** 9;
    unit = 'G';
  } else if (digit >= 2) {
    divisor = 10 ** 6;
    unit = 'M';
  } else if (digit >= 1) {
    divisor = 10 ** 3;
    unit = 'K';
  }

  return (num: number) =>
    num === 0 ? '0' : (num / divisor).toLocaleString() + unit;
}
