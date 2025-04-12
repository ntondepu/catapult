export function stripPII(text) {
  // Remove names, dates, emails, etc.
  return text
    .replace(/(Name|Patient|DOB|Date of Birth):\s*\w+/gi, '$1: [REDACTED]')
    .replace(/\b\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}\b/g, '[DATE]')
    .replace(/\S+@\S+\.\S+/g, '[EMAIL]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/\b[A-Z]{2}\d{6,8}\b/g, '[ID]');
}

export function validateFile(file) {
  const validTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (!validTypes.includes(file.type)) {
    throw new Error('Unsupported file type');
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB max
    throw new Error('File too large (max 5MB)');
  }

  return true;
}