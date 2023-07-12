/*
Based on Dark Blue by Thomas Palef.

Plans are submitted as an array of strings that forms a grid.

. = Empty Space
@ = Player Start Position
o = Coins
# = Solid Surface
+ = Stationary Lava
^ = Spike

*/
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;

// ==============Structure==============

// Level pulls the Level Plan data and creates the Level
class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type == "string") return type;
        this.startActors.push(
          type.create(new Vex(x, y), ch));
          return "empty"
      })
    })
  }
}

// State determines the Status of Actors
class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }
  static start(level) {
    return new State(level, level.startActors, "playing");
  }
  get player() {
    return this.actors.find(a => a.type == "player")
  }
}

// Vector sets Position and Size of Actors
class Vector {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vector(this.x * factor, this.y * factor);
  }
}

// =================Actors================

// Player Location and Movement
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }
  get type() { return "player"; }
  static create(pos) {
    return new Player(pos.plus(new Vector(0, -0.5)),
                      new Vector(0, 0));
  }
}
Player.prototype.size = new Vector(0.8, 1.5);

// Lava Location and Movement
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }
  get type() {return "lava";}
  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vector(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vector(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vector(0, 3), pos);
    }
  }
}
Lava.prototype.size = new Vector(1, 1);

// Creates the Coin and determines Location, Wobble animation
class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }
  get type() {return "coin";}
  static create(pos) {
    let basePos = pos.plus(new Vector(0.2, 0.1));
    return new Coin(basePos, basePos,
                    Math.random() * Math.PI * 2);
  }
}
Coin.prototype.size = new Vector(0.6, 0.6);

// Create Spikes

// Creating Level Data Object Assignments (Background Grid or Actors)
const levelCharacters = {
  // Background Grid
  ".": "empty", "#": "wall", "+": "lava",
  // Actors
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

// Creates Level Instance
let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);
// 22px by 9px