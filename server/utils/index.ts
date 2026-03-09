// sv-SEロケールは YYYY-MM-DD
export const dateString = (date: Date) => date.toLocaleDateString('sv-SE');

// YYYY-MM-DDThh:mm:ssZ
export const toISO = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, 'Z');
