// riskFlagger.js
const REFERENCE_RANGES = {
  'AST': { min: 10, max: 40 },
  'ALT': { min: 7, max: 56 },
  'Glucose': { min: 70, max: 100 }
};

export function flagRisks(text) {  // <-- This is the key change
  const results = [];

  for (const [test, range] of Object.entries(REFERENCE_RANGES)) {
    const regex = new RegExp(`${test}:?\\s*(\\d+\\.?\\d*)`, 'i');
    const match = text.match(regex);

    if (match) {
      const value = parseFloat(match[1]);
      let status = 'normal';

      if (value < range.min) status = 'low';
      if (value > range.max) status = 'high';

      results.push({ test, value, status, range });
    }
  }

  return results;
}

// Alternative if you need multiple exports:
// export { flagRisks, anotherFunction };

