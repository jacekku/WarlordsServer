import { Building } from '@Buildings/model/building.model';
import { Growable } from '@Buildings/model/growable.model';
import { ConfigurableLogger } from '@Logging/logging.service';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { StateService } from '@State/state.service';
import { Timer } from '@Timer/model/timer.model';
import { TimerMapper } from '@Timer/timer.mapper';
import { Player } from '@Users/domain/model/player.model';
import { Server } from 'socket.io';

@Injectable()
export class TimerService implements OnApplicationBootstrap {
  logger = new ConfigurableLogger(TimerService.name);
  timers: Map<string, Timer>;
  cancelledTimers: Map<string, Timer>;
  finishedTimers: Map<string, Timer>;
  websocketServer: Server;
  constructor(private readonly stateService: StateService) {
    setInterval(this.tick.bind(this), 1000);
    this.timers = new Map();
    this.cancelledTimers = new Map();
    this.finishedTimers = new Map();
  }

  onApplicationBootstrap() {
    this.stateService.buildings
      .filter((building) => building.growable)
      .map((building) => Building.from(building))
      .forEach((building) => {
        const timer = new Timer(building.growable.cycleAmount, () => {
          const result = Growable.grow(building);
          this.stateService.updateBuilding(building);
          return result;
        });
        this.registerTimer(timer);
      });
  }

  tick() {
    Array.from(this.timers.values()).forEach((timer) => {
      timer.tick();
      timer.checkEnded();
    });

    Array.from(this.timers.keys()).forEach((key) => {
      const timer = this.timers.get(key);
      if (timer.cancelled) {
        this.cancelledTimers.set(key, timer);
        this.timers.delete(key);
        return;
      }
      if (timer.hasEnded) {
        this.finishedTimers.set(key, timer);
        this.timers.delete(key);
        return;
      }
    });
    this.websocketServer
      .fetchSockets()
      .then(this.sendUpdatesToPlayers.bind(this));
  }

  sendUpdatesToPlayers(clients: any[]) {
    clients.forEach((client) => {
      if (!client) return;
      const currentPlayer = this.stateService.findConnectedPlayer({
        name: client.player,
      } as any);

      if (!currentPlayer) return;
      if (!currentPlayer.timers) currentPlayer.timers = [];
      const timers = currentPlayer.timers.map((id) => this.findTimer(id));
      if (timers.length > 0) {
        client.emit('timer', timers);
      }
    });
  }

  registerTimer(timer: Timer) {
    if (!timer.id) {
      this.logger.error('No id on timer ' + timer);
      return;
    }
    this.timers.set(timer.id, timer);
    return timer;
  }

  findTimer(id: string) {
    return (
      this.timers.get(id) ||
      this.cancelledTimers.get(id) ||
      this.finishedTimers.get(id)
    );
  }

  findTimersOnPlayer(player: Player) {
    if (!player.timers) {
      player.timers = [];
    }
    return player.timers.map((id) => this.findTimer(id));
  }

  addTimer(player: Player, action: string, callback: CallableFunction) {
    const duration = TimerMapper.mapActionToDuration(action);
    const currentPlayer = this.stateService.findConnectedPlayer(player);
    if (!currentPlayer.timers) currentPlayer.timers = [];
    const newTimer = new Timer(duration?.cycleAmount || 1, callback);
    this.registerTimer(newTimer);
    currentPlayer.timers.push(newTimer.id);
    return newTimer;
  }

  ackTimer(timerId: any, ackType: 'cancelled' | 'ended', playerName: string) {
    const currentPlayer = this.stateService.findConnectedPlayer({
      name: playerName,
    } as Player);
    if (ackType == 'cancelled') {
      this.cancelledTimers.delete(timerId);
    }
    if (ackType == 'ended') {
      this.finishedTimers.delete(timerId);
    }
    currentPlayer.timers = currentPlayer.timers
      .filter((timer) => timer != timerId)
      .filter((timer) => timer == null);
  }

  cancelTimer(timer: Timer) {
    const currentTimer = this.findTimer(timer.id);
    currentTimer.cancel();
  }
}
