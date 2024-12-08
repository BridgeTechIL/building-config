// src/utils/pdfUtils.ts
import dynamic from 'next/dynamic';

export const generateAndDownloadPDF = async (props: any) => {
  // Dynamically import react-pdf
  const { pdf } = await import('@react-pdf/renderer');
  const { CreatePDF } = await import('../components/pdf/CreatePDF');
  
  const PDFDocument = <CreatePDF {...props} />;
  
  try {
    const blob = await pdf(PDFDocument).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${props.projectData.name}-summary.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};