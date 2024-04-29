import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  getDoc ,
  setDoc,
  doc ,
  increment ,
} from "firebase/firestore";
import { resolve } from "path";

initializeApp({
  projectId: "test-pro-8c3e9",
});

const db = getFirestore();
const colRef = collection(db, "users");

const artificial_delay = async (value: number) => {
  return new Promise((resolve) => setTimeout(resolve, value, "it s okay"));
};

const getMyFireDocs = async () => {
  const response = await artificial_delay(5000);
  console.log(response);

  const myFireDocs = await getDocs(colRef);

  const arr = myFireDocs.docs.map((elem) => elem.data());

  console.log(arr);
};

getMyFireDocs();

class ShapeComponent {
  position: Position;
  constructor({ x, y }: { x: number; y: number }) {
    this.position = { x, y };
  }
}

interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  w: number;
  h: number;
}

class Shape {
  isFrozen: boolean;

  components: ShapeComponent[];

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
        (structure[i].position.x + x) * 25,
        (structure[i].position.y + y) * 25,
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
  }: Dimensions & Position & { structure: ShapeComponent[] }) {

    const docRef = doc(db, "users", "28mWE3wGxH8e4FAEN71w");

    updateDoc(docRef , {
      counter:increment(10)
    });

    this.components = structure;
    this.position = { x, y };
    this.dimensions = { w, h };
    this.isFrozen = false;
  }
}

export class Game {
  width: number;
  height: number;
  static elemDimensions = 25;
  allFrozenShapes: Shape[];
  currentAciveShape: Shape | null;
  tetrisScale: number[][];
  lastUpdated = Date.now();
  canvasContext: CanvasRenderingContext2D;

  freeze() {
    const current = this.currentAciveShape;
    if (!current) return;
    // alert('inner');
    this.allFrozenShapes.push(current);
    current.isFrozen = true;
    this.currentAciveShape = null;
    // this.currentTetrisElement.
    console.log(this.currentAciveShape, this.allFrozenShapes);
  }

  update() {
    const now = Date.now();

    const rows: { y: number; x: number[] }[] = [];

    this.allFrozenShapes.forEach((frznShape, i) => {
      frznShape.components.forEach((component) => {
        const lev = rows.find(
          (levelElem) =>
            levelElem.y === component.position.y + frznShape.position.y,
        );

        if (lev) {
          if (
            !lev.x.filter(
              (x) => frznShape.position.x + component.position.x === x,
            ).length
          ) {
            lev.x.push(frznShape.position.x + component.position.x);
          }
        } else {
          rows.push({
            y: component.position.y + frznShape.position.y,
            x: [component.position.x + frznShape.position.x],
          });
        }
      });
    });

    rows.forEach((row) => {
      if (row.x.length > 5) {
        this.allFrozenShapes.forEach((frozenone) => {
          const newComponents = frozenone.components.filter((comp) => {
            return comp.position.y + frozenone.position.y !== row.y;
          });

          frozenone.components = [...newComponents];
        });
      }
    });

    if (now - this.lastUpdated >= 250) {
      this.lastUpdated = now;

      console.log(this.currentAciveShape, "current");

      const current = this.currentAciveShape;

      if (!current) {
        this.currentAciveShape = new Shape({
          x: 0,
          y: 0,
          w: 20,
          h: 20,
          structure: [
            new ShapeComponent({ x: 0, y: 0 }),
            new ShapeComponent({ x: 1, y: 0 }),
            new ShapeComponent({ x: 2, y: 0 }),
            new ShapeComponent({ x: 1, y: 1 }),
          ],
        });
      }

      if (!current) return;

      const isCollission = this.checkCollision({ x: 0, y: 1 });

      if (isCollission) {
        current.isFrozen = true;
        this.allFrozenShapes.push(current);
        this.currentAciveShape = null;
      }

      if (current && !current.isFrozen) {
        current.update();
      }

      // this.allFrozen.for
    }
  }

  checkWalls() {}

  /**
   *
   * @param currentElementDelta
   *
   * @returns
   */

  checkCollision(currentElementDelta: { x: number; y: number }) {
    let isCollision = false;

    const current = this.currentAciveShape;

    if (!current) return false;

    for (const frozenShape of this.allFrozenShapes) {
      for (const frozenShape_struct_elem of frozenShape.components) {
        if (isCollision) {
          break;
        }

        const feX = frozenShape_struct_elem.position.x + frozenShape.position.x;
        const feY = frozenShape_struct_elem.position.y + frozenShape.position.y;

        for (const current_struct_elem of current.components) {
          if (isCollision) {
            break;
          }

          const cX = current_struct_elem.position.x + current.position.x;
          const cY = current_struct_elem.position.y + current.position.y;

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

    const current = this.currentAciveShape;

    if (current) {
      current.render(this.canvasContext);
    }

    this.allFrozenShapes.forEach((fe) => {
      fe.render(ctx);
    });
  }

  constructor(ctx: CanvasRenderingContext2D) {
    this.width = 20;
    this.height = 40;
    this.currentAciveShape = null;

    this.tetrisScale = [...Array(100)].map((elem) => Array(50).fill(0));

    this.canvasContext = ctx;

    window.addEventListener("keypress", (e) => {
      const cur = this.currentAciveShape;

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
              this.allFrozenShapes.push(cur);
              this.currentAciveShape = null;
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

    const initElement = {
      x: 2,
      y: 0,
      w: 20,
      h: 20,
      structure: [
        new ShapeComponent({ x: 0, y: 0 }),
        new ShapeComponent({ x: 1, y: 0 }),
        new ShapeComponent({ x: 2, y: 0 }),
        new ShapeComponent({ x: 1, y: 1 }),
      ],
    };

    this.currentAciveShape = new Shape({ ...initElement });
    this.allFrozenShapes = [];
  }
}
