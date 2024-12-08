// types/pdf.ts
export interface CreatePDFProps {
    projectData: {
      name: string;
      installationDate: string;
      comments?: string;
      status: 'draft' | 'saved';
    };
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