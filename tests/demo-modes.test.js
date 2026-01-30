const test = require('node:test');
const assert = require('node:assert/strict');

const DemoModes = require('../demos/_assets/demo-modes.js');

test('DemoModes.toCsv: throws on empty columns', () => {
  assert.throws(() => DemoModes.toCsv({ columns: [], rows: [] }), /columns must be a non-empty array/i);
});

test('DemoModes.toCsv: writes header + rows + trailing newline', () => {
  const csv = DemoModes.toCsv({
    columns: [
      { key: 'a', label: 'A' },
      { key: 'b', label: 'B' },
    ],
    rows: [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ],
  });

  assert.equal(csv, 'A,B\n1,2\n3,4\n');
});

test('DemoModes.toCsv: escapes commas, quotes, and newlines', () => {
  const csv = DemoModes.toCsv({
    columns: [
      { key: 'text', label: 'Text' },
    ],
    rows: [
      { text: 'hello,world' },
      { text: 'he said "hi"' },
      { text: 'line1\nline2' },
    ],
  });

  assert.equal(csv, 'Text\n"hello,world"\n"he said ""hi"""\n"line1\nline2"\n');
});

