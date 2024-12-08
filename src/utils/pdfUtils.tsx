// src/utils/pdfUtils.ts
import { pdf } from '@react-pdf/renderer';
import { CreatePDF } from '../components/pdf/CreatePDF';
import React from 'react';

type CreatePDFProps = React.ComponentProps<typeof CreatePDF>;

export const generateAndDownloadPDF = async (props: CreatePDFProps) => {
  // Create a new instance of the PDF component
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