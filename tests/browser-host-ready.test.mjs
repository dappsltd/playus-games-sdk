import assert from 'node:assert/strict';
import { test } from 'node:test';

const hostOrigin = 'https://host.example';

// Import the public build with minimal browser globals, as in the other SDK tests.
globalThis.window = { location: { search: '?playusNoMobilePolicy=1' } };
globalThis.document = new EventTarget();
const { NativeBridge } = await import('../dist/sdk/index.js');

function fixture({ framed = true, native, origin = hostOrigin } = {}) {
  const messages = [];
  const frame = new EventTarget();
  const parent = { postMessage: (event, target) => messages.push({ event, target }) };
  const on = frame.addEventListener.bind(frame);
  const listeners = [];
  frame.addEventListener = (type, listener) => {
    listeners.push(type);
    on(type, listener);
  };
  frame.parent = framed ? parent : frame;
  frame.location = { search: '?playusNoMobilePolicy=1' };
  if (native === 'ios') {
    frame.webkit = { messageHandlers: { gameEvent: { postMessage: event => messages.push({ event }) } } };
  }
  if (native === 'android') {
    frame.gameEvent = { handleMessage: value => messages.push({ event: JSON.parse(value) }) };
  }
  globalThis.window = frame;
  const bridge = new NativeBridge();
  bridge.attach();
  bridge.configure(origin ? { browserHostOrigin: origin } : {});
  bridge.game.ready({ gameId: 'test-game' });
  const handshakeId = messages[0]?.event.handshakeId;

  return {
    frame,
    bridge,
    listeners,
    messages,
    handshakeId,
    send(data = { type: 'hostReady', handshakeId }, { origin = hostOrigin, source = parent } = {}) {
      const event = new MessageEvent('message', { origin, data });
      // Node doesn't implement WindowProxy as a MessageEvent source.
      Object.defineProperty(event, 'source', { value: source });
      frame.dispatchEvent(event);
    },
  };
}

test('acknowledges hostReady from the configured parent over the existing browser transport', () => {
  const { handshakeId, messages, send } = fixture();
  send();
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready', 'hostReadyAck']);
  assert.equal(messages[1].event.handshakeId, handshakeId);
  assert.equal(messages[1].event.source, 'game-native-bridge');
  assert.equal(messages[1].event.bridgeVersion, messages[0].event.bridgeVersion);
});

test('does not enable the browser input by default', () => {
  const { listeners, messages, send } = fixture({ origin: null });
  assert.deepEqual(listeners, []);
  send();
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
});

test('does not trust opaque origins or wildcards', () => {
  for (const origin of ['null', '*']) {
    const { listeners, messages, send } = fixture({ origin });
    assert.deepEqual(listeners, []);
    send(undefined, { origin });
    assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
  }
});

test('invalid reconfiguration disables a previously enabled input', () => {
  const { bridge, messages, send } = fixture();
  bridge.configure({ browserHostOrigin: null });
  send();
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
});

test('ignores messages from the wrong origin or window', () => {
  const { messages, send } = fixture();
  send(undefined, { origin: 'https://untrusted.example' });
  send(undefined, { source: {} });
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
});

test('ignores unrelated messages, malformed input and mismatched handshakes', () => {
  const { handshakeId, messages, send } = fixture();
  send(null);
  send({ type: 'setMuted', handshakeId });
  send({ type: 'hostReady', handshakeId: 1 });
  send({ type: 'hostReady', handshakeId: `${handshakeId}-old` });
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
});

for (const native of ['ios', 'android']) {
  test(`keeps ${native} on the existing native handshake`, () => {
    const { frame, handshakeId, listeners, messages, send } = fixture({ native });
    assert.deepEqual(listeners, []);
    send();
    assert.deepEqual(JSON.parse(frame.gameAPI.hostReady({ handshakeId: 'stale' })), {
      success: false, error: 'handshake_mismatch',
    });
    assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
    assert.deepEqual(JSON.parse(frame.gameAPI.hostReady({ handshakeId })), { success: true });
    assert.deepEqual(messages.map(({ event }) => event.type), ['ready', 'hostReadyAck']);
    assert.equal(messages[1].event.source, undefined);
    assert.equal(messages[1].event.handshakeId, handshakeId);
  });
}

test('does not install the message listener in a standalone browser tab', () => {
  const { listeners, messages } = fixture({ framed: false });
  assert.deepEqual(listeners, []);
  assert.deepEqual(messages, []);
});

test('does not relay a browser message to a late-installed native handler', () => {
  const { frame, messages, send } = fixture();
  frame.gameEvent = { handleMessage: value => messages.push({ event: JSON.parse(value) }) };
  send();
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready']);
});

test('reconfiguring the same bridge does not acknowledge twice', () => {
  const { bridge, messages, send } = fixture();
  bridge.configure({ browserHostOrigin: hostOrigin });
  send();
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready', 'hostReadyAck']);
});

test('routes the browser handshake to the bridge that issued its ID', () => {
  const { messages, send } = fixture();
  const otherBridge = new NativeBridge();
  otherBridge.attach();
  otherBridge.configure({ browserHostOrigin: hostOrigin });
  send();
  assert.deepEqual(messages.map(({ event }) => event.type), ['ready', 'hostReadyAck']);
});
