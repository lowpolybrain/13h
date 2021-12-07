export type AnimateMethod = (
  // Render counter - it is incremented for every render.
  // Affected by frameSkip and frameRepeat.
  renderedFrame: number,
  // Time provided by requestAnimationFrame (if any)
  time: number
) => void;

export type AnimateOptions = {
  initialSkip?: number;

  // Repeat each frame
  frameRepeat?: number;

  // How many frames to skip. If you provide 5 here - only every
  // 5th call will be landed. Useful to slow stuff down
  frameSkip?: number;

  // Used for sandboxes and hot module reloading to kill
  // previous requestAnimationFrames (as they stack up)
  // leading to tremendous performance problems
  cleanupId?: string;
};

declare global {
  interface Window {
    _cdeCleanup?: Record<string, number>;
  }
}

export const animate = function (nextFrame: AnimateMethod, options: AnimateOptions = {}) {
  let renderedFrame = 0;

  let frameSkipCounter = 0;

  let setCleanup: ((cleanupNum: number) => void) | undefined;

  if (options.cleanupId) {
    if (!window._cdeCleanup) {
      window._cdeCleanup = {};
    } else {
      const frameId = window._cdeCleanup[options.cleanupId];
      if (frameId) {
        console.log('Cancelled', frameId);
        window.cancelAnimationFrame(frameId);
      }
    }
    setCleanup = (cleanupNum: number) => {
      if (window._cdeCleanup && options.cleanupId) {
        window._cdeCleanup[options.cleanupId] = cleanupNum;
      }
    };
  }

  const renderNextFrame = (time: number) => {
    if (options.frameSkip != null && options.frameSkip > 0) {
      frameSkipCounter = (frameSkipCounter + 1) % options.frameSkip;
      if (!frameSkipCounter) {
        nextFrame(renderedFrame++, time);
      }
    } else {
      nextFrame(renderedFrame++, time);
    }
  };

  if (options.initialSkip != null && options.initialSkip > 0) {
    for (let i = 0; i < options.initialSkip; i++) {
      renderNextFrame(0);
    }
  }

  const rqAnimFrame = (fn: (n: number) => void) => {
    const id = window.requestAnimationFrame(fn);
    if (setCleanup) {
      setCleanup(id);
    }
  };

  const goToNextFrame = (n: number) => {
    if (options.frameRepeat) {
      for (let i = 0; i <= options.frameRepeat; i++) {
        renderNextFrame(n);
      }
    } else {
      renderNextFrame(n);
    }
    rqAnimFrame(goToNextFrame);
  };

  rqAnimFrame(goToNextFrame);
};
