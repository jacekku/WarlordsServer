import { ConnectedSocket } from '@nestjs/websockets';
import { Utilities } from 'src/terrain/utilities/utilities.service';

export class Timer {
  id: string;
  startTime: number;
  cycleAmount: number;
  currentCycle: number;
  hasEnded = false;
  cancelled = false;
  callback: CallableFunction;

  constructor(
    cycleAmount = 1,
    callback: CallableFunction = () => console.log('no callback provided'),
  ) {
    this.id = Utilities.generateStringId();
    this.cycleAmount = cycleAmount;
    this.startTime = Date.now();
    this.currentCycle = 0;
    this.callback = callback;
  }

  endTime() {
    if (Number.isFinite(this.cycleAmount)) {
      return this.startTime + this.cycleAmount * 1000;
    }
    return Infinity;
  }
  tick() {
    this.currentCycle++;
  }
  checkEnded() {
    if (this.currentCycle >= this.cycleAmount) {
      this.hasEnded = true;
      const reset = this.callback();
      if (reset) {
        this.hasEnded = false;
        this.currentCycle = 0;
      }
    }
  }
  cancel() {
    this.cancelled = true;
    this.hasEnded = true;
  }
}
