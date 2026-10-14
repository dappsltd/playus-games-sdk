// Sends the native finish after a short final-feedback beat (a fall, a flash, a revealed answer).
//
// Until finished() reaches the host, closing the app discards the attempt instead of
// consuming it. So the beat must stay short, and once the outcome is fixed, sending the
// app to the background finishes immediately instead of waiting for the beat.
//
// The background guard only exists after finishAfter() was called: backgrounding the
// app during normal play (a call, a system dialog) does not finish anything here.
// Wall-clock timing is intentional (not engine time): the exploit window is real time.
//
// Returns a cancel function for dispose paths; it is a no-op after the finish ran.
export function finishAfter(delayMs: number, finish: () => void): () => void {
  let done = false;
  const cleanup = () => {
    done = true;
    clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
  const run = () => {
    if (done) return;
    cleanup();
    finish();
  };
  const onVisibilityChange = () => {
    if (document.hidden) run();
  };
  const timer = setTimeout(run, Math.max(0, delayMs));
  document.addEventListener('visibilitychange', onVisibilityChange);
  // The outcome is already fixed; if the app is in the background right now, do not wait.
  if (document.hidden) run();
  return () => {
    if (!done) cleanup();
  };
}
