
// Sample reference ranges (you can add more or load from a JSON)
const referenceRanges = {
  "ALT": { low: 7, high: 56, unit: "U/L" },
  "AST": { low: 10, high: 40, unit: "U/L" },
  "Glucose": { low: 70, high: 99, unit: "mg/dL" },
};

function getConfidence(value, low, high) {
  const range = high - low;
  const margin = range * 0.1; // 10% of range as "buffer zone"
  const distanceFromNormal = value < low ? low - value : value > high ? value - high : 0;
  const severity = distanceFromNormal / range;

  // Cap severity at 1 for anything too far off
  const confidence = Math.min(1, severity + 0.1); // Slight boost to emphasize
  return Math.round(confidence * 100);
}

function flagValue(testName, value) {
  const ref = referenceRanges[testName];
  if (!ref) return { flag: "Unknown", confidence: null, explanation: "No reference data available." };

  const { low, high, unit } = ref;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return { flag: "Invalid", confidence: null, explanation: "Non-numeric result." };
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
