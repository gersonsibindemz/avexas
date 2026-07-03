import * as XLSX from 'xlsx';

export const downloadExcel = (data: any, fileName: string, headersMap: Record<string, string>) => {
  const worksheetData = [
    Object.values(headersMap), // Headers
    Object.keys(headersMap).map(key => data[key] || '') // Data
  ];
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Ficha Técnica");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
