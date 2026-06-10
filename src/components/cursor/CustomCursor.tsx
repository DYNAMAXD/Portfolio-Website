import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
//  const dotRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let mouseMoved = false;

    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
    };

    const params = {
      pointsNumber: 30,
      widthFactor: 0.2,
      mouseThreshold: 0.6,
      spring: 0.4,
      friction: 0.5,
    };

    const trail = new Array(params.pointsNumber).fill(null).map(() => ({
      x: pointer.x,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));

    function updateMousePosition(x: number, y: number) {
      pointer.x = x;
      pointer.y = y;
    }

    const mouseMoveHandler = (e: MouseEvent) => {
      mouseMoved = true;
    //   updateMousePosition(e.pageX, e.pageY);
    updateMousePosition(e.clientX, e.clientY);
    };

    const clickHandler = (e: MouseEvent) => {
    //   updateMousePosition(e.pageX, e.pageY);
      updateMousePosition(e.clientX, e.clientY);
    };

    const touchHandler = (e: TouchEvent) => {
    mouseMoved = true;
      const touch = e.touches[0];

      if (touch) {
        updateMousePosition(touch.clientX, touch.clientY);
      }
    };

    window.addEventListener("mousemove", mouseMoveHandler);
    window.addEventListener("click", clickHandler);
    window.addEventListener("touchmove", touchHandler);

    function setupCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    setupCanvas();

    let animationFrameId: number;

    function update(t: number) {
      if (!mouseMoved) {
        pointer.x =
          (0.5 +
            0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
          window.innerWidth;

        pointer.y =
          (0.5 +
            0.2 * Math.cos(0.005 * t) +
            0.1 * Math.cos(0.01 * t)) *
          window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.forEach((p, i) => {
        const prev = i === 0 ? pointer : trail[i - 1];

        const spring =
          i === 0 ? 0.4 * params.spring : params.spring;

        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;

        p.dx *= params.friction;
        p.dy *= params.friction;

        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);

        ctx.quadraticCurveTo(
          trail[i].x,
          trail[i].y,
          xc,
          yc
        );

        ctx.lineWidth =
          params.widthFactor * (params.pointsNumber - i);

        ctx.strokeStyle = "white";
        ctx.lineCap = "round";

        ctx.stroke();
      }

      ctx.lineTo(
        trail[trail.length - 1].x,
        trail[trail.length - 1].y
      );

      ctx.stroke();

      animationFrameId = requestAnimationFrame(update);
    }

    update(0);

    window.addEventListener("resize", setupCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);

      window.removeEventListener(
        "mousemove",
        mouseMoveHandler
      );

      window.removeEventListener(
        "click",
        clickHandler
      );

      window.removeEventListener(
        "touchmove",
        touchHandler
      );

      window.removeEventListener(
        "resize",
        setupCanvas
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 999999,
      }}
    />
  );
}