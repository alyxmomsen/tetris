import { time } from "console";

interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  w: number;
  h: number;
}

class TetrisElement {
  isFrozen: boolean;

  components: number[][];

  position: Position;
  dimensions: Dimensions;

  update() {
    this.position.y++;
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.position;
    const { w, h } = this.dimensions;
    const structure = this.components;

    for (let i = 0; i < structure.length; i++) {
      ctx.fillStyle = this.isFrozen ? "grey" : "green";
      ctx.fillRect(
        (structure[i][0] + x) * 25,
        (structure[i][1] + y) * 25,
        w,
        h,
      );
    }
  }

  constructor({
    x,
    y,
    w,
    h,
    structure,
  }: Dimensions & Position & { structure: number[][] }) {
    this.components = structure;
    this.position = { x, y };
    this.dimensions = { w, h };
    this.isFrozen = false;
  }
}

export class Game {
  static elemDimensions = 25;
  allFrozen: TetrisElement[];
  currentTetrisElement: TetrisElement | null;
  tetrisScale: number[][];
  lastUpdated = Date.now();
  canvasContext: CanvasRenderingContext2D;

  freeze() {
    const current = this.currentTetrisElement;
    if (!current) return;
    // alert('inner');
    this.allFrozen.push(current);
    current.isFrozen = true;
    this.currentTetrisElement = null;
    // this.currentTetrisElement.
    console.log(this.currentTetrisElement, this.allFrozen);
  }

  update() {
    const now = Date.now();

    const rows:{y:number , x:number[]}[] = [] ;

    this.allFrozen.forEach((elem , i) => {

        elem.components.forEach(component => {
            const lev = rows.find(levelElem => levelElem.y === component[1] + elem.position.y);

            if(lev) {

                if(!lev.x.filter(x => elem.position.x + component[0] === x).length) {
                    lev.x.push(elem.position.x + component[0]);
                    // if(lev.x.length > 5) {
                    //     console.log('stackovefrlow');
                    // }
                }
            }
            else {
                rows.push({y:component[1] + elem.position.y , x:[component[0] + elem.position.x]})
            }

        });

    });

    rows.forEach(row => {
        if(row.x.length > 5) {

            this.allFrozen.forEach(frozenone => {
                const newComponents = frozenone.components.filter(comp => {
                    return comp[1] + frozenone.position.y !== row.y
                });

                frozenone.components = [...newComponents] ;
            });

        }
    });

    this.allFrozen.forEach(elem => {});


    if (now - this.lastUpdated >= 250) {
      this.lastUpdated = now;
      // console.log('updated');
      console.log(this.currentTetrisElement, "current");

      const current = this.currentTetrisElement;

      if (!current) {
        // alert();
        this.currentTetrisElement = new TetrisElement({
          x: 0,
          y: 0,
          w: 20,
          h: 20,
          structure: [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1],
          ],
        });
      }

      if (!current) return;

      const isCollission = this.checkCollision({ x: 0, y: 1 });

      if (isCollission) {
        current.isFrozen = true;
        this.allFrozen.push(current);
        this.currentTetrisElement = null;
      }

      if (current && !current.isFrozen) {
        current.update();
      }

      // this.allFrozen.for
    }
  }

  /**
   *
   * @param currentElementDelta
   *
   * @returns
   */

  checkCollision(currentElementDelta: { x: number; y: number }) {
    let isCollision = false;

    const current = this.currentTetrisElement;

    if (!current) return false;

    for (const fe of this.allFrozen) {
      for (const fe_struct_elem of fe.components) {
        if (isCollision) {
          break;
        }

        const feX = fe_struct_elem[0] + fe.position.x;
        const feY = fe_struct_elem[1] + fe.position.y;

        for (const current_struct_elem of current.components) {
          if (isCollision) {
            break;
          }

          const cX = current_struct_elem[0] + current.position.x;
          const cY = current_struct_elem[1] + current.position.y;

          if (
            cX + currentElementDelta.x === feX &&
            cY + currentElementDelta.y === feY
          ) {
            isCollision = true;
            break;
          }
        }
      }

      if (isCollision) {
        break;
      }
    }

    return isCollision;
  }

  render() {
    const ctx = this.canvasContext;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const current = this.currentTetrisElement;

    if (current) {
      current.render(this.canvasContext);
    }

    this.allFrozen.forEach((fe) => {
      fe.render(ctx);
    });
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.currentTetrisElement = null;

    this.tetrisScale = [...Array(100)].map((elem) => Array(50).fill(0));

    this.canvasContext = ctx;

    window.addEventListener("keypress", (e) => {
      const cur = this.currentTetrisElement;

      switch (e.key) {
        case "w":
          return;
        case "a":
          if (cur) {
            const delta = { x: -1, y: 0 };
            const isCollision = this.checkCollision(delta);
            if (!isCollision) {
              cur.position.x += delta.x;
            }
          }
          return;
        case "s":
          if (cur) {
            const delta = { x: 0, y: 1 };
            const isCollision = this.checkCollision(delta);
            if (!isCollision) {
              cur.position.y += delta.y;
            } else {
              cur.isFrozen = true;
              this.allFrozen.push(cur);
              this.currentTetrisElement = null;
            }
          }
          return;
        case "d":
          if (cur) {
            const delta = { x: 1, y: 0 };
            const isCollision = this.checkCollision(delta);
            if (!isCollision) {
              cur.position.x += delta.x;
            }
          }
          return;
        case "f":
          this.freeze();
          return;
      }
    });

    // console.log(this.tetrisScale);

    const initElement = {
      x: 2,
      y: 0,
      w: 20,
      h: 20,
      structure: [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 1],
      ],
    };

    this.currentTetrisElement = new TetrisElement({ ...initElement });
    this.allFrozen = [];
  }
}
