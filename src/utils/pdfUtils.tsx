// src/utils/pdfUtils.ts
import { ProjectBasicInfo } from '@/types/building';

interface PDFGenerationProps {
  projectData: ProjectBasicInfo;
  orderNumber: string;
  floorsWithItems: Array<{
    id: string;
    level: number;
    isBase?: boolean;
    items: Record<string, number>;
  }>;
  buildingItems: {
    crane: number;
    mastClimber: number;
    hoistSystem: {
      normalHoist: number;
      smartHoist: number;
    };
  };
  formatPrice: (price: number) => string;
  getItemName: (key: string) => string;
  calculateItemCost: (key: string, quantity: number) => number;
  totalCost: number;
}

export const generateAndDownloadPDF = async (props: PDFGenerationProps) => {
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