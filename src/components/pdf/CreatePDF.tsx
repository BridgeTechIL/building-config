// src/components/pdf/CreatePDF.tsx
'use client'
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Use system fonts instead of loading external ones
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  orderNumber: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 20,
    fontFamily: 'Helvetica-Oblique',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  grid: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 8,
  },
  gridHeader: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
  },
  col1: {
    flex: 2,
  },
  col2: {
    flex: 1,
    textAlign: 'center',
  },
  col3: {
    flex: 1,
    textAlign: 'right',
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
  },
  totalAmount: {
    fontSize: 16,
    color: '#0891B2',
    fontFamily: 'Helvetica-Bold',
  },
  text: {
    fontSize: 12,
    lineHeight: 1.5,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
});

interface CreatePDFProps {
  projectData: {
    name: string;
    installationDate: string;
    comments?: string;
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

export const CreatePDF: React.FC<CreatePDFProps> = ({
  projectData,
  orderNumber,
  floorsWithItems,
  buildingItems,
  formatPrice,
  getItemName,
  calculateItemCost,
  totalCost,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{projectData.name}</Text>
        <Text style={styles.orderNumber}>{orderNumber}</Text>
        <Text style={styles.text}>
          Installation Date: {new Date(projectData.installationDate).toLocaleDateString()}
        </Text>
        {projectData.comments && (
          <Text style={styles.text}>Comments: {projectData.comments}</Text>
        )}
      </View>

      {floorsWithItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Floor Planning</Text>
          {floorsWithItems.map((floor) => (
            <View key={floor.id} style={styles.section}>
              <Text style={[styles.text, styles.bold]}>
                {floor.isBase ? 'Base Level' : `Level ${floor.level}`}
              </Text>
              <View style={styles.gridHeader}>
                <View style={styles.grid}>
                  <Text style={[styles.col1, styles.text, styles.bold]}>ITEM</Text>
                  <Text style={[styles.col2, styles.text, styles.bold]}>QTY.</Text>
                  <Text style={[styles.col3, styles.text, styles.bold]}>PRICE</Text>
                </View>
              </View>
              {Object.entries(floor.items).map(([itemKey, quantity]) => {
                if (quantity > 0) {
                  return (
                    <View key={itemKey} style={styles.grid}>
                      <Text style={[styles.col1, styles.text]}>{getItemName(itemKey)}</Text>
                      <Text style={[styles.col2, styles.text]}>
                        {String(quantity).padStart(2, '0')}
                      </Text>
                      <Text style={[styles.col3, styles.text]}>
                        {formatPrice(calculateItemCost(itemKey, quantity))}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          ))}
        </View>
      )}

      {(buildingItems.crane > 0 ||
        buildingItems.mastClimber > 0 ||
        buildingItems.hoistSystem.normalHoist > 0 ||
        buildingItems.hoistSystem.smartHoist > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building Items</Text>
          <View style={styles.gridHeader}>
            <View style={styles.grid}>
              <Text style={[styles.col1, styles.text, styles.bold]}>ITEM</Text>
              <Text style={[styles.col2, styles.text, styles.bold]}>QTY.</Text>
              <Text style={[styles.col3, styles.text, styles.bold]}>PRICE</Text>
            </View>
          </View>
          {buildingItems.crane > 0 && (
            <View style={styles.grid}>
              <Text style={[styles.col1, styles.text]}>{getItemName('crane')}</Text>
              <Text style={[styles.col2, styles.text]}>
                {String(buildingItems.crane).padStart(2, '0')}
              </Text>
              <Text style={[styles.col3, styles.text]}>
                {formatPrice(calculateItemCost('crane', buildingItems.crane))}
              </Text>
            </View>
          )}
          {buildingItems.mastClimber > 0 && (
            <View style={styles.grid}>
              <Text style={[styles.col1, styles.text]}>{getItemName('mastClimber')}</Text>
              <Text style={[styles.col2, styles.text]}>
                {String(buildingItems.mastClimber).padStart(2, '0')}
              </Text>
              <Text style={[styles.col3, styles.text]}>
                {formatPrice(calculateItemCost('mastClimber', buildingItems.mastClimber))}
              </Text>
            </View>
          )}
          {buildingItems.hoistSystem.normalHoist > 0 && (
            <View style={styles.grid}>
              <Text style={[styles.col1, styles.text]}>{getItemName('normalHoist')}</Text>
              <Text style={[styles.col2, styles.text]}>
                {String(buildingItems.hoistSystem.normalHoist).padStart(2, '0')}
              </Text>
              <Text style={[styles.col3, styles.text]}>
                {formatPrice(calculateItemCost('normalHoist', buildingItems.hoistSystem.normalHoist))}
              </Text>
            </View>
          )}
          {buildingItems.hoistSystem.smartHoist > 0 && (
            <View style={styles.grid}>
              <Text style={[styles.col1, styles.text]}>{getItemName('smartHoist')}</Text>
              <Text style={[styles.col2, styles.text]}>
                {String(buildingItems.hoistSystem.smartHoist).padStart(2, '0')}
              </Text>
              <Text style={[styles.col3, styles.text]}>
                {formatPrice(calculateItemCost('smartHoist', buildingItems.hoistSystem.smartHoist))}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.total}>
        <Text style={styles.totalLabel}>Total (incl. fees and tax)</Text>
        <Text style={styles.totalAmount}>{formatPrice(totalCost)}</Text>
      </View>
    </Page>
  </Document>
);