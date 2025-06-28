import { MockDataService } from '../services/mockDataService';
import { ORDER_STATUS, TRANSACTION_TYPE } from '../constants/databaseSchema';
import { generatePriceMovement } from './dataUtils';

// Demo Data Generator for testing and development
export class DemoDataGenerator {
  // Generate additional securities
  static generateAdditionalSecurities() {
    const additionalSecurities = [
      {
        id: 9,
        securityName: 'Johnson & Johnson',
        securitySymbol: 'JNJ',
        value: 165.80,
        currentPrice: 165.80,
        changePercent: 0.3,
        changeValue: 0.50
      },
      {
        id: 10,
        securityName: 'Procter & Gamble Co.',
        securitySymbol: 'PG',
        value: 145.25,
        currentPrice: 145.25,
        changePercent: -0.2,
        changeValue: -0.30
      },
      {
        id: 11,
        securityName: 'Coca-Cola Company',
        securitySymbol: 'KO',
        value: 58.75,
        currentPrice: 58.75,
        changePercent: 0.8,
        changeValue: 0.45
      },
      {
        id: 12,
        securityName: 'Walmart Inc.',
        securitySymbol: 'WMT',
        value: 165.90,
        currentPrice: 165.90,
        changePercent: 1.1,
        changeValue: 1.80
      },
      {
        id: 13,
        securityName: 'JPMorgan Chase & Co.',
        securitySymbol: 'JPM',
        value: 185.45,
        currentPrice: 185.45,
        changePercent: 2.1,
        changeValue: 3.85
      },
      {
        id: 14,
        securityName: 'Bank of America Corp.',
        securitySymbol: 'BAC',
        value: 35.20,
        currentPrice: 35.20,
        changePercent: -0.8,
        changeValue: -0.28
      },
      {
        id: 15,
        securityName: 'Visa Inc.',
        securitySymbol: 'V',
        value: 275.60,
        currentPrice: 275.60,
        changePercent: 1.5,
        changeValue: 4.10
      },
      {
        id: 16,
        securityName: 'Mastercard Inc.',
        securitySymbol: 'MA',
        value: 425.75,
        currentPrice: 425.75,
        changePercent: 0.9,
        changeValue: 3.80
      }
    ];

    // Add to mock data
    MockDataService.mockData.securityDetails.push(...additionalSecurities);
    return additionalSecurities;
  }

  // Generate additional orders for different users
  static generateAdditionalOrders() {
    const additionalOrders = [
      // Orders for user 2 (Jane Smith)
      {
        id: 7,
        idSecurityDetail: 9,
        orderRefNo: 'ORD20240107',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.BUY,
        orderValue: 1658.00,
        quantity: 10,
        orderDate: '2024-01-10T10:30:00Z',
        createdOn: '2024-01-10T10:30:00Z',
        createdBy: 2
      },
      {
        id: 8,
        idSecurityDetail: 10,
        orderRefNo: 'ORD20240108',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.BUY,
        orderValue: 1452.50,
        quantity: 10,
        orderDate: '2024-01-11T14:15:00Z',
        createdOn: '2024-01-11T14:15:00Z',
        createdBy: 2
      },
      {
        id: 9,
        idSecurityDetail: 11,
        orderRefNo: 'ORD20240109',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.BUY,
        orderValue: 1175.00,
        quantity: 20,
        orderDate: '2024-01-12T09:45:00Z',
        createdOn: '2024-01-12T09:45:00Z',
        createdBy: 2
      },
      // More orders for user 1 (John Doe)
      {
        id: 10,
        idSecurityDetail: 12,
        orderRefNo: 'ORD20240110',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.BUY,
        orderValue: 829.50,
        quantity: 5,
        orderDate: '2024-01-12T16:20:00Z',
        createdOn: '2024-01-12T16:20:00Z',
        createdBy: 1
      },
      {
        id: 11,
        idSecurityDetail: 13,
        orderRefNo: 'ORD20240111',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.BUY,
        orderValue: 1854.50,
        quantity: 10,
        orderDate: '2024-01-13T11:10:00Z',
        createdOn: '2024-01-13T11:10:00Z',
        createdBy: 1
      },
      {
        id: 12,
        idSecurityDetail: 14,
        orderRefNo: 'ORD20240112',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.BUY,
        orderValue: 704.00,
        quantity: 20,
        orderDate: '2024-01-14T13:45:00Z',
        createdOn: '2024-01-14T13:45:00Z',
        createdBy: 1
      },
      // Sell orders
      {
        id: 13,
        idSecurityDetail: 1,
        orderRefNo: 'ORD20240113',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.SELL,
        orderValue: 351.00,
        quantity: 2,
        orderDate: '2024-01-15T15:30:00Z',
        createdOn: '2024-01-15T15:30:00Z',
        createdBy: 1
      },
      {
        id: 14,
        idSecurityDetail: 2,
        orderRefNo: 'ORD20240114',
        orderStatus: ORDER_STATUS.COMPLETED,
        transactionType: TRANSACTION_TYPE.SELL,
        orderValue: 650.50,
        quantity: 2,
        orderDate: '2024-01-16T10:15:00Z',
        createdOn: '2024-01-16T10:15:00Z',
        createdBy: 1
      }
    ];

    // Add to mock data
    MockDataService.mockData.orderDetails.push(...additionalOrders);
    return additionalOrders;
  }

  // Generate account details for additional orders
  static generateAdditionalAccountDetails() {
    const additionalAccountDetails = [
      // Account details for user 2
      {
        id: 6,
        idUserLoginDetail: 2,
        credit: 15000.00,
        debit: 0.00,
        runningBalance: 15000.00,
        idOrderDetail: null,
        createdOn: '2024-01-02T00:00:00Z',
        createdBy: 2
      },
      {
        id: 7,
        idUserLoginDetail: 2,
        credit: 0.00,
        debit: 1658.00,
        runningBalance: 13342.00,
        idOrderDetail: 7,
        createdOn: '2024-01-10T10:30:00Z',
        createdBy: 2
      },
      {
        id: 8,
        idUserLoginDetail: 2,
        credit: 0.00,
        debit: 1452.50,
        runningBalance: 11889.50,
        idOrderDetail: 8,
        createdOn: '2024-01-11T14:15:00Z',
        createdBy: 2
      },
      {
        id: 9,
        idUserLoginDetail: 2,
        credit: 0.00,
        debit: 1175.00,
        runningBalance: 10714.50,
        idOrderDetail: 9,
        createdOn: '2024-01-12T09:45:00Z',
        createdBy: 2
      },
      // Additional account details for user 1
      {
        id: 10,
        idUserLoginDetail: 1,
        credit: 0.00,
        debit: 829.50,
        runningBalance: 3955.25,
        idOrderDetail: 10,
        createdOn: '2024-01-12T16:20:00Z',
        createdBy: 1
      },
      {
        id: 11,
        idUserLoginDetail: 1,
        credit: 0.00,
        debit: 1854.50,
        runningBalance: 2100.75,
        idOrderDetail: 11,
        createdOn: '2024-01-13T11:10:00Z',
        createdBy: 1
      },
      {
        id: 12,
        idUserLoginDetail: 1,
        credit: 0.00,
        debit: 704.00,
        runningBalance: 1396.75,
        idOrderDetail: 12,
        createdOn: '2024-01-14T13:45:00Z',
        createdBy: 1
      },
      {
        id: 13,
        idUserLoginDetail: 1,
        credit: 351.00,
        debit: 0.00,
        runningBalance: 1747.75,
        idOrderDetail: 13,
        createdOn: '2024-01-15T15:30:00Z',
        createdBy: 1
      },
      {
        id: 14,
        idUserLoginDetail: 1,
        credit: 650.50,
        debit: 0.00,
        runningBalance: 2398.25,
        idOrderDetail: 14,
        createdOn: '2024-01-16T10:15:00Z',
        createdBy: 1
      }
    ];

    // Add to mock data
    MockDataService.mockData.accountDetails.push(...additionalAccountDetails);
    return additionalAccountDetails;
  }

  // Generate historical price data for charts
  static generateHistoricalPriceData(securityId, days = 30) {
    const security = MockDataService.getSecurityById(securityId);
    if (!security) return [];

    const historicalData = [];
    const basePrice = security.currentPrice * 0.9; // Start 10% lower
    const currentDate = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // Generate realistic price movement
      const volatility = 0.02; // 2% daily volatility
      const priceChange = (Math.random() - 0.5) * volatility * basePrice;
      const price = basePrice + priceChange + (i * (security.currentPrice - basePrice) / days);

      historicalData.push({
        date: date.toISOString().split('T')[0],
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      });
    }

    return historicalData;
  }

  // Generate market data for all securities
  static generateMarketData() {
    const securities = MockDataService.getSecurities();
    const marketData = securities.map(security => {
      const newPrice = generatePriceMovement(security.currentPrice);
      const changeValue = newPrice - security.currentPrice;
      const changePercent = (changeValue / security.currentPrice) * 100;

      return {
        ...security,
        currentPrice: newPrice,
        changeValue: parseFloat(changeValue.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000,
        marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000
      };
    });

    return marketData;
  }

  // Generate performance data for portfolio
  static generatePerformanceData(userId, days = 30) {
    const portfolio = MockDataService.getPortfolioSummary(userId);
    const performanceData = [];
    const currentDate = new Date();

    for (let i = days; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      
      // Calculate portfolio value for this date
      let totalValue = 0;
      portfolio.forEach(item => {
        const basePrice = item.currentPrice * (0.95 + (i / days) * 0.1); // Gradual increase
        const priceChange = (Math.random() - 0.5) * 0.02 * basePrice;
        const price = basePrice + priceChange;
        totalValue += item.totalQuantity * price;
      });

      performanceData.push({
        date: date.toISOString().split('T')[0],
        value: parseFloat(totalValue.toFixed(2)),
        change: i < days ? parseFloat((totalValue - performanceData[performanceData.length - 1]?.value || totalValue).toFixed(2)) : 0
      });
    }

    return performanceData;
  }

  // Generate all demo data
  static generateAllDemoData() {
    console.log('Generating demo data...');
    
    const securities = this.generateAdditionalSecurities();
    const orders = this.generateAdditionalOrders();
    const accountDetails = this.generateAdditionalAccountDetails();
    
    console.log(`Generated ${securities.length} additional securities`);
    console.log(`Generated ${orders.length} additional orders`);
    console.log(`Generated ${accountDetails.length} additional account details`);
    
    return {
      securities,
      orders,
      accountDetails
    };
  }

  // Reset demo data to original state
  static resetDemoData() {
    // Reset to original mock data
    MockDataService.mockData.securityDetails = MockDataService.mockData.securityDetails.slice(0, 8);
    MockDataService.mockData.orderDetails = MockDataService.mockData.orderDetails.slice(0, 6);
    MockDataService.mockData.accountDetails = MockDataService.mockData.accountDetails.slice(0, 5);
    
    console.log('Demo data reset to original state');
  }

  // Generate random orders for testing
  static generateRandomOrders(count = 10, userId = 1) {
    const securities = MockDataService.getSecurities();
    const orders = [];

    for (let i = 0; i < count; i++) {
      const security = securities[Math.floor(Math.random() * securities.length)];
      const quantity = Math.floor(Math.random() * 50) + 1;
      const price = generatePriceMovement(security.currentPrice);
      const orderValue = quantity * price;
      const transactionType = Math.random() > 0.5 ? TRANSACTION_TYPE.BUY : TRANSACTION_TYPE.SELL;
      const orderStatus = Math.random() > 0.8 ? ORDER_STATUS.SUBMITTED : ORDER_STATUS.COMPLETED;

      const order = {
        idSecurityDetail: security.id,
        transactionType,
        orderValue: parseFloat(orderValue.toFixed(2)),
        quantity,
        orderStatus,
        createdBy: userId
      };

      orders.push(MockDataService.createOrder(order));
    }

    return orders;
  }
}

export default DemoDataGenerator; 