import { CustomList } from "@/types/vocabulary";

// Escape CSV/TSV field content
const escapeField = (field: string | undefined = '', delimiter: string): string => {
  const str = String(field);
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Convert list data to CSV
const convertToCSV = (list: CustomList): string => {
  const header = ['id', 'german', 'english', 'example', 'category', 'notes'];
  const rows = list.words.map(word =>
    header.map(field => escapeField(String(word[field as keyof typeof word] || ''), ',')).join(',')
  );
  return [header.join(','), ...rows].join('\n');
};

// Convert list data to TSV
const convertToTSV = (list: CustomList): string => {
  const header = ['id', 'german', 'english', 'example', 'category', 'notes'];
  const rows = list.words.map(word =>
    header.map(field => escapeField(String(word[field as keyof typeof word] || ''), '\t')).join('\t')
  );
  return [header.join('\t'), ...rows].join('\n');
};

// Convert list data to simple Text
const convertToTXT = (list: CustomList): string => {
  return list.words.map(word =>
    `${word.german} - ${word.english}${word.example ? ` (e.g., "${word.example}")` : ''}${word.notes ? ` [Notes: ${word.notes}]` : ''}`
  ).join('\n');
};

// Convert list data to Markdown Table
const convertToMD = (list: CustomList): string => {
  const header = '| German | English | Example | Category | Notes |';
  const separator = '|---|---|---|---|---|';
  const rows = list.words.map(word =>
    `| ${word.german || ''} | ${word.english || ''} | ${word.example || ''} | ${word.category || ''} | ${word.notes || ''} |`
  );
  return [`# ${list.name}`, list.description || '', '', header, separator, ...rows].join('\n');
};

/**
 * Exports a vocabulary list as a file in the specified format
 * @param list The vocabulary list to export
 * @param format The export format (csv, tsv, txt, md)
 * @returns void
 */
export const exportListData = (list: CustomList, format: 'csv' | 'tsv' | 'txt' | 'md'): void => {
  if (!list || !list.words || list.words.length === 0) {
    console.error('No data to export');
    return;
  }

  let content = '';
  let mimeType = '';
  let fileExtension = '';

  // Generate content based on format
  switch (format) {
    case 'csv':
      content = convertToCSV(list);
      mimeType = 'text/csv';
      fileExtension = 'csv';
      break;
    case 'tsv':
      content = convertToTSV(list);
      mimeType = 'text/tab-separated-values';
      fileExtension = 'tsv';
      break;
    case 'txt':
      content = convertToTXT(list);
      mimeType = 'text/plain';
      fileExtension = 'txt';
      break;
    case 'md':
      content = convertToMD(list);
      mimeType = 'text/markdown';
      fileExtension = 'md';
      break;
    default:
      console.error('Invalid export format');
      return;
  }

  // Create a blob and trigger download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${list.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_vocabulary.${fileExtension}`;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}; 