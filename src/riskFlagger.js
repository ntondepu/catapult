<<<<<<< HEAD

// Sample reference ranges (you can add more or load from a JSON)
=======
// Sample reference ranges (expand as needed)
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)
const referenceRanges = {
  "ALT": { low: 7, high: 56, unit: "U/L" },
  "AST": { low: 10, high: 40, unit: "U/L" },
  "Glucose": { low: 70, high: 99, unit: "mg/dL" },
<<<<<<< HEAD
=======
  "Cholesterol": { low: 100, high: 199, unit: "mg/dL" },
  "HDL": { low: 40, high: 60, unit: "mg/dL" },
  "LDL": { low: 0, high: 99, unit: "mg/dL" },
  "Triglycerides": { low: 0, high: 149, unit: "mg/dL" }
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)
};

function getConfidence(value, low, high) {
  const range = high - low;
<<<<<<< HEAD
  const margin = range * 0.1; // 10% of range as "buffer zone"
  const distanceFromNormal = value < low ? low - value : value > high ? value - high : 0;
  const severity = distanceFromNormal / range;

  // Cap severity at 1 for anything too far off
  const confidence = Math.min(1, severity + 0.1); // Slight boost to emphasize
=======
  const margin = range * 0.1;
  const distanceFromNormal = value < low ? low - value : value > high ? value - high : 0;
  const severity = distanceFromNormal / range;
  const confidence = Math.min(1, severity + 0.1);
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)
  return Math.round(confidence * 100);
}

function flagValue(testName, value) {
  const ref = referenceRanges[testName];
<<<<<<< HEAD
  if (!ref) return { flag: "Unknown", confidence: null, explanation: "No reference data available." };
=======
  if (!ref) return {
    flag: "Unknown",
    confidence: null,
    explanation: "No reference data available."
  };
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)

  const { low, high, unit } = ref;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
<<<<<<< HEAD
    return { flag: "Invalid", confidence: null, explanation: "Non-numeric result." };
=======
    return {
      flag: "Invalid",
      confidence: null,
      explanation: "Non-numeric result."
    };
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)
  }

  if (numericValue < low) {
    return {
      flag: "Red",
      confidence: getConfidence(numericValue, low, high),
      explanation: `${testName} is low. Normal: ${low}-${high} ${unit}.`,
    };
  } else if (numericValue > high) {
    return {
      flag: "Red",
      confidence: getConfidence(numericValue, low, high),
      explanation: `${testName} is high. Normal: ${low}-${high} ${unit}.`,
    };
  } else if (
    numericValue < low + (high - low) * 0.1 ||
    numericValue > high - (high - low) * 0.1
  ) {
    return {
      flag: "Yellow",
      confidence: 50,
      explanation: `${testName} is borderline. Normal: ${low}-${high} ${unit}.`,
    };
  } else {
    return {
      flag: "Green",
      confidence: 10,
      explanation: `${testName} is within normal range (${low}-${high} ${unit}).`,
    };
  }
}

<<<<<<< HEAD
function analyzeReport(parsedValues) {
  const flagged = {};

  for (const [testName, value] of Object.entries(parsedValues)) {
    flagged[testName] = flagValue(testName, value);
  }

  return flagged;
}

module.exports = {
  analyzeReport
};
=======
export function analyzeReport(parsedValues) {
  const flagged = {};
  for (const [testName, value] of Object.entries(parsedValues)) {
    flagged[testName] = flagValue(testName, value);
  }
  return flagged;
}
>>>>>>> 2891275 (fixed some errors in index.js and parsePdf.js)
