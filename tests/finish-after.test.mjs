import assert from 'node:assert/strict';
import { test, mock } from 'node:test';

// Test the public built SDK with a controllable document visibility and fake timers.
class FakeDocument extends EventTarget {
  hidden = false;
  setHidden(hidden) {
    this.hidden = hidden;
    this.dispatchEvent(new Event('visibilitychange'));
  }
}

globalThis.window = { location: { search: '?playusNoMobilePolicy=1' } };
const doc = new FakeDocument();
globalThis.document = doc;
mock.timers.enable({ apis: ['setTimeout'] });
const { finishAfter } = await import('../dist/sdk/index.js');

function reset() {
  doc.hidden = false;
}

test('finishes once after the delay', () => {
  reset();
  let calls = 0;
  finishAfter(400, () => calls++);
  mock.timers.tick(399);
  assert.equal(calls, 0);
  mock.timers.tick(1);
  assert.equal(calls, 1);
  mock.timers.tick(1000);
  assert.equal(calls, 1);
});

test('backgrounding after the call finishes immediately, exactly once', () => {
  reset();
  let calls = 0;
  finishAfter(400, () => calls++);
  mock.timers.tick(100);
  doc.setHidden(true);
  assert.equal(calls, 1);
  mock.timers.tick(1000);
  doc.setHidden(false);
  doc.setHidden(true);
  assert.equal(calls, 1, 'no listener or timer survives the finish');
});

test('backgrounding before the call does not finish anything', () => {
  reset();
  let calls = 0;
  // Normal play: the player takes a call and returns before any outcome exists.
  doc.setHidden(true);
  doc.setHidden(false);
  finishAfter(400, () => calls++);
  assert.equal(calls, 0);
  mock.timers.tick(400);
  assert.equal(calls, 1);
});

test('an outcome fixed while hidden finishes without waiting', () => {
  reset();
  doc.hidden = true;
  let calls = 0;
  finishAfter(400, () => calls++);
  assert.equal(calls, 1);
  mock.timers.tick(1000);
  assert.equal(calls, 1);
});

test('cancel stops the pending finish and its background guard', () => {
  reset();
  let calls = 0;
  const cancel = finishAfter(400, () => calls++);
  cancel();
  doc.setHidden(true);
  mock.timers.tick(1000);
  assert.equal(calls, 0);
});
