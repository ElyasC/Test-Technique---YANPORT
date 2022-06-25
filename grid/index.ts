type Nullable<T> = T | null;
type Grid = { width: number, height: number };
type Orientation = 'N' | 'E' | 'W' | 'S';
type Player = { x: number, y: number, orientation: Orientation };
type Rotation = 'D' | 'G';
type Command = 'D' | 'G' | 'A';
type Movement = [number, number];
type _Map<T> = { [key: string]: T };

const sleep: (ms: number) => Promise<void> = ms => new Promise(r => setTimeout(r, ms));

class Game {
  private grid: Grid;
  private player: Player;

  constructor(grid: Grid, player: Player) {
    this.grid = grid;
    this.player = player;
  }

  private actions: _Map<Function> = {
    D: () => (this.rotate('D')),
    G: () => (this.rotate('G')),
    A: () => (this.move())
  };

  private movements: _Map<Movement> = {
    N: [0, 1],
    E: [1, 0],
    W: [-1, 0],
    S: [0, -1]
  }

  private rotations: _Map<{ D: Orientation, G: Orientation }> = {
    N: { D: 'E', G: 'W'},
    E: { D: 'S', G: 'N'},
    W: { D: 'N', G: 'S'},
    S: { D: 'W', G: 'E'},
  }

  private character: _Map<string> = {
    N: '^',
    E: '>',
    W: '<',
    S: 'v'
  }

  private move(): void {
    const movement: Movement = this.movements[this.player.orientation];
    
    if (!this.canPlayerMove(movement)) return;
    this.player.x = this.player.x += movement[0];
    this.player.y = this.player.y += movement[1];
  }

  private rotate(rotation: Rotation): void {
    this.player.orientation = this.rotations[this.player.orientation][rotation];
  }

  private canPlayerMove(movement: Movement): boolean {
    if (this.player.x + movement[0] >= this.grid.width) return false;
    if (this.player.y + movement[1] >= this.grid.height) return false;
    return true;
  }

  public execute(command: string) {
    if (this.actions[command]) this.actions[command]();
    console.log('executing command', command);
  }

  public async result() {
    this.drawGrid();
    console.log(`x=${this.player.x} y=${this.player.y} orientation=${this.player.orientation}`)
    await sleep(1000);
  }

  private drawGrid() {
    for (let i: number = this.grid.height - 1; i >= 0; i -= 1) {
      for (let j: number = 0; j < this.grid.width; j += 1) {
        if (j === 0) process.stdout.write('|');
        this.drawCell(j, i);
        process.stdout.write('|');
      }
      if (i > 0) {
        process.stdout.write('\n');
        this.drawLine(this.grid.width);
      }
    }
    process.stdout.write('\n');
  }

  private drawLine(width: number) {
    for (let i: number = 0; i < width; i += 1) {
       process.stdout.write('--');
      }
      process.stdout.write('\n');
  }

  private drawCell(x: number, y: number) {
    if (this.player.x === x && this.player.y === y) {
      return process.stdout.write(this.character[this.player.orientation]);
    }
    process.stdout.write(' ');
  }
}

async function main() {
  const grid: Grid = { width: 10, height: 10 };
  const player: Player = { x: 5, y: 5, orientation: 'N'};
  const game: Game = new Game(grid, player);
  const commands: string = 'AAAAAAAAAADDA';
  console.clear();
  console.log('initial position')
  await game.result();
  for (let i: number = 0; i < commands.length; i += 1) {
    console.clear();
    game.execute(commands.charAt(i));
    await game.result();
  }
};

main();
