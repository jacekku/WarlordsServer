export class TimerMapper {
  private static readonly MAP = {
    MINE: { cycleAmount: 5 },
    EXTRACT: { cycleAmount: 10 },
    HUNT: { cycleAmount: 10 },
    FISH: { cycleAmount: 10 },
    GATHER_SAND: { cycleAmount: 2 },
    CHOP_WOOD: { cycleAmount: 2 },
    GATHER_STICKS: { cycleAmount: 4 },
    FORAGE_BERRIES: { cycleAmount: 4 },
    GATHER_STONES: { cycleAmount: 4 },
    MINE_STONES: { cycleAmount: 10 },
    BUILD: { cycleAmount: 4 },
    DEMOLISH: { cycleAmount: 15 },
    HARVEST: { cycleAmount: 2 },
    CRAFT: { cycleAmount: 5 },
  };

  static mapActionToDuration(action: string) {
    action = action.split(' ').join('_');
    const mapped = TimerMapper.MAP[action];
    return mapped;
  }
}
