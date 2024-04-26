import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Game } from "../../game/game";
import MyComponent from "../MyComponent";

function MyCanvas() {
  // const {state , stateDispatch} = useMyFirstHook({initState:{allFrozen:[] , currentTetrisElement:null ,lastUpdated:Date.now() , tetrisScale:[]}});

  const [shouldUpdate, setShouldUpdate] = useState(false);

  const canvas = useRef<HTMLCanvasElement>(null);

  const [game, setGame] = useState<Game | null>(null);

  useLayoutEffect(() => {
    if (!canvas) return;

    const canvasCurrnt = canvas.current;

    if (!canvasCurrnt) return;

    const ctx = canvasCurrnt.getContext("2d");

    if (!ctx) return;

    setGame(new Game(ctx));

    let timerId = Infinity;
    if (shouldUpdate) {
      const update = () => {
        if (game) {
          game.update();
          game.render();
        }
        console.log("updated");

        timerId = window.requestAnimationFrame(update);
      };

      timerId = window.requestAnimationFrame(update);
    }

    return () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      cancelAnimationFrame(timerId);
    };
  }, [shouldUpdate]);

  useEffect(() => {});

  return (
    <>
      <MyComponent state={0} />
      <button onClick={() => setShouldUpdate((current) => !current)}>
        click me
      </button>
      <canvas ref={canvas} width={800} height={600}>
        MyCanvas
      </canvas>
    </>
  );
}

export default MyCanvas;
