// utils.js
export function stripPII(text) {
  // Simple regex to remove names, dates, emails, etc.
  return text
    .replace(/Name:\s*\w+/gi, 'Name: [REDACTED]')
    .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '[DATE]')
    .replace(/\S+@\S+\.\S+/g, '[EMAIL]');
}

