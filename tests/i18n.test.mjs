import assert from 'node:assert/strict';
import { test } from 'node:test';
function setLocation(hash, search = '') {
  globalThis.window = { location: { hash, search } };
}

setLocation('', '?playusNoMobilePolicy=1');
const {
  createTranslator,
  getCurrentLanguage,
  getLanguageDirection,
  SUPPORTED_LANGUAGES,
} = await import('../dist/sdk/index.js');

test('selects canonical Portuguese with the existing URL protocol', () => {
  assert.ok(SUPPORTED_LANGUAGES.includes('pt'));
  assert.ok(!SUPPORTED_LANGUAGES.some(language => language.startsWith('pt-')));

  for (const [hash, search] of [
    ['#lang=pt&d=1', '?lang=de'],
    ['', '?lang=pt'],
    ['#lang=pt-PT'],
    ['#lang=PT_br'],
  ]) {
    setLocation(hash, search);
    assert.equal(getCurrentLanguage(), 'pt');
    assert.equal(getLanguageDirection(), 'ltr');
  }
});

test('translates Portuguese placeholders and keeps English and RTL fallbacks', () => {
  setLocation('#lang=pt');
  const translations = {
    level: { en: 'Level {n}', pt: 'Nível {n}' },
    retry: { en: 'Try again' },
  };
  const t = createTranslator(translations);
  assert.equal(t('level', { n: 3 }), 'Nível 3');
  assert.equal(t('retry'), 'Try again');

  setLocation('#lang=unknown');
  assert.equal(getCurrentLanguage(), 'en');
  assert.equal(createTranslator(translations)('level', { n: 3 }), 'Level 3');

  setLocation('#lang=ar');
  assert.equal(getLanguageDirection(), 'rtl');
});
