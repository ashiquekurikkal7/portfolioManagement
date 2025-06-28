import { 
  DATABASE_SCHEMA, 
  ORDER_STATUS, 
  TRANSACTION_TYPE, 
  USER_STATUS, 
  LOGIN_STATUS,
  DEFAULT_VALUES 
} from '../constants/databaseSchema';

// Mock Data Generator Functions
const generateOrderRefNo = () => {
  const timestamp = Date.now().toString().slice(-8);
  return `ORD${timestamp}`;
};

const generateRandomPrice = (min, max) => {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
};

const generateRandomQuantity = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Mock Data
export const mockData = {
  // User Details
  userDetails: [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@abc.com',
      createdOn: '2024-01-01T00:00:00Z',
      createdBy: 'system',
      modifiedOn: '2024-01-15T10:30:00Z',
      modifiedBy: 'john.doe@abc.com'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane.smith@abc.com',
      createdOn: '2024-01-02T00:00:00Z',
      createdBy: 'system',
      modifiedOn: '2024-01-14T15:45:00Z',
      modifiedBy: 'jane.smith@abc.com'
    }
  ],

  // User Login Details
  userLoginDetails: [
    {
      id: 1,
      idUserDetail: 1,
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john.doe@abc.com',
      userStatus: USER_STATUS.ACTIVE,
      createdOn: '2024-01-01T00:00:00Z',
      createdBy: 'system',
      modifiedOn: '2024-01-15T10:30:00Z',
      modifiedBy: 'john.doe@abc.com'
    },
    {
      id: 2,
      idUserDetail: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      emailAddress: 'jane.smith@abc.com',
      userStatus: USER_STATUS.ACTIVE,
      createdOn: '2024-01-02T00:00:00Z',
      createdBy: 'system',
      modifiedOn: '2024-01-14T15:45:00Z',
      modifiedBy: 'jane.smith@abc.com'
    }
  ],

  // Security Details (Funds/Securities)
  securityDetails: [
    {
      id: 1,
      securityName: 'Apple Inc.',
      securitySymbol: 'AAPL',
      value: 175.50,
      currentPrice: 175.50,
      changePercent: 2.5,
      changeValue: 4.25
    },
    {
      id: 2,
      securityName: 'Microsoft Corporation',
      securitySymbol: 'MSFT',
      value: 325.25,
      currentPrice: 325.25,
      changePercent: 1.8,
      changeValue: 5.75
    },
    {
      id: 3,
      securityName: 'Tesla Inc.',
      securitySymbol: 'TSLA',
      value: 245.75,
      currentPrice: 245.75,
      changePercent: -1.2,
      changeValue: -3.00
    },
    {
      id: 4,
      securityName: 'Alphabet Inc.',
      securitySymbol: 'GOOGL',
      value: 2750.00,
      currentPrice: 2750.00,
      changePercent: 0.8,
      changeValue: 22.00
    },
    {
      id: 5,
      securityName: 'Amazon.com Inc.',
      securitySymbol: 'AMZN',
      value: 185.25,
      currentPrice: 185.25,
      changePercent: -0.5,
      changeValue: -0.95
    },
    {
      id: 6,
      securityName: 'NVIDIA Corporation',
      securitySymbol: 'NVDA',
      value: 450.75,
      currentPrice: 450.75,
      changePercent: 3.2,
      changeValue: 14.00
    },
    {
      id: 7,
      securityName: 'Meta Platforms Inc.',
      securitySymbol: 'META',
      value: 320.50,
      currentPrice: 320.50,
      changePercent: 1.5,
      changeValue: 4.75
    },
    {
      id: 8,
      securityName: 'Netflix Inc.',
      securitySymbol: 'NFLX',
      value: 485.00,
      currentPrice: 485.00,
      changePercent: -0.8,
      changeValue: -3.90
    }
  ],

  // Order Details
  orderDetails: [
    {
      id: 1,
      idSecurityDetail: 1,
      orderRefNo: 'ORD20240101',
      orderStatus: ORDER_STATUS.COMPLETED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 1755.00,
      quantity: 10,
      orderDate: '2024-01-15T09:30:00Z',
      createdOn: '2024-01-15T09:30:00Z',
      createdBy: 1
    },
    {
      id: 2,
      idSecurityDetail: 2,
      orderRefNo: 'ORD20240102',
      orderStatus: ORDER_STATUS.COMPLETED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 2602.00,
      quantity: 8,
      orderDate: '2024-01-14T14:15:00Z',
      createdOn: '2024-01-14T14:15:00Z',
      createdBy: 1
    },
    {
      id: 3,
      idSecurityDetail: 3,
      orderRefNo: 'ORD20240103',
      orderStatus: ORDER_STATUS.COMPLETED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 1228.75,
      quantity: 5,
      orderDate: '2024-01-13T11:45:00Z',
      createdOn: '2024-01-13T11:45:00Z',
      createdBy: 1
    },
    {
      id: 4,
      idSecurityDetail: 4,
      orderRefNo: 'ORD20240104',
      orderStatus: ORDER_STATUS.SUBMITTED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 2750.00,
      quantity: 1,
      orderDate: '2024-01-16T10:00:00Z',
      createdOn: '2024-01-16T10:00:00Z',
      createdBy: 1
    },
    {
      id: 5,
      idSecurityDetail: 5,
      orderRefNo: 'ORD20240105',
      orderStatus: ORDER_STATUS.EXECUTED,
      transactionType: TRANSACTION_TYPE.SELL,
      orderValue: 185.25,
      quantity: 2,
      orderDate: '2024-01-16T13:30:00Z',
      createdOn: '2024-01-16T13:30:00Z',
      createdBy: 1
    },
    {
      id: 6,
      idSecurityDetail: 6,
      orderRefNo: 'ORD20240106',
      orderStatus: ORDER_STATUS.CANCELLED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 901.50,
      quantity: 2,
      orderDate: '2024-01-16T15:20:00Z',
      createdOn: '2024-01-16T15:20:00Z',
      createdBy: 1
    },
    {
      id: 7,
      idSecurityDetail: 1,
      orderRefNo: 'ORD20240107',
      orderStatus: ORDER_STATUS.EXECUTED,
      transactionType: TRANSACTION_TYPE.SELL,
      orderValue: 1800.00,
      quantity: 10,
      orderDate: '2024-01-17T10:15:00Z',
      createdOn: '2024-01-17T10:15:00Z',
      createdBy: 1
    },
    {
      id: 8,
      idSecurityDetail: 2,
      orderRefNo: 'ORD20240108',
      orderStatus: ORDER_STATUS.COMPLETED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 1500.00,
      quantity: 5,
      orderDate: '2024-01-17T14:30:00Z',
      createdOn: '2024-01-17T14:30:00Z',
      createdBy: 1
    },
    {
      id: 9,
      idSecurityDetail: 3,
      orderRefNo: 'ORD20240109',
      orderStatus: ORDER_STATUS.EXECUTED,
      transactionType: TRANSACTION_TYPE.SELL,
      orderValue: 600.00,
      quantity: 2,
      orderDate: '2024-01-18T09:45:00Z',
      createdOn: '2024-01-18T09:45:00Z',
      createdBy: 1
    },
    {
      id: 10,
      idSecurityDetail: 4,
      orderRefNo: 'ORD20240110',
      orderStatus: ORDER_STATUS.COMPLETED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 2800.00,
      quantity: 1,
      orderDate: '2024-01-18T16:20:00Z',
      createdOn: '2024-01-18T16:20:00Z',
      createdBy: 1
    },
    {
      id: 11,
      idSecurityDetail: 5,
      orderRefNo: 'ORD20240111',
      orderStatus: ORDER_STATUS.EXECUTED,
      transactionType: TRANSACTION_TYPE.BUY,
      orderValue: 450.00,
      quantity: 5,
      orderDate: '2024-01-19T11:10:00Z',
      createdOn: '2024-01-19T11:10:00Z',
      createdBy: 1
    },
    {
      id: 12,
      idSecurityDetail: 6,
      orderRefNo: 'ORD20240112',
      orderStatus: ORDER_STATUS.COMPLETED,
      transactionType: TRANSACTION_TYPE.SELL,
      orderValue: 950.00,
      quantity: 2,
      orderDate: '2024-01-19T15:45:00Z',
      createdOn: '2024-01-19T15:45:00Z',
      createdBy: 1
    }
  ],

  // Account Details
  accountDetails: [
    {
      id: 1,
      idUserLoginDetail: 1,
      credit: 10000.00,
      debit: 0.00,
      runningBalance: 10000.00,
      idOrderDetail: null,
      createdOn: '2024-01-01T00:00:00Z',
      createdBy: 1
    },
    {
      id: 2,
      idUserLoginDetail: 1,
      credit: 0.00,
      debit: 1755.00,
      runningBalance: 8245.00,
      idOrderDetail: 1,
      createdOn: '2024-01-15T09:30:00Z',
      createdBy: 1
    },
    {
      id: 3,
      idUserLoginDetail: 1,
      credit: 0.00,
      debit: 2602.00,
      runningBalance: 5643.00,
      idOrderDetail: 2,
      createdOn: '2024-01-14T14:15:00Z',
      createdBy: 1
    },
    {
      id: 4,
      idUserLoginDetail: 1,
      credit: 0.00,
      debit: 1228.75,
      runningBalance: 4414.25,
      idOrderDetail: 3,
      createdOn: '2024-01-13T11:45:00Z',
      createdBy: 1
    },
    {
      id: 5,
      idUserLoginDetail: 1,
      credit: 370.50,
      debit: 0.00,
      runningBalance: 4784.75,
      runningBalance: 4784.75,
      idOrderDetail: 5,
      createdOn: '2024-01-16T13:30:00Z',
      createdBy: 1
    }
  ],

  // Audit User Login
  auditUserLogin: [
    {
      id: 1,
      idUserLoginDetail: 1,
      sessionId: 'session_001',
      loginStatus: LOGIN_STATUS.SUCCESS,
      loginDateTime: '2024-01-16T08:00:00Z',
      logoutDateTime: null
    },
    {
      id: 2,
      idUserLoginDetail: 1,
      sessionId: 'session_002',
      loginStatus: LOGIN_STATUS.SUCCESS,
      loginDateTime: '2024-01-15T09:00:00Z',
      logoutDateTime: '2024-01-15T17:30:00Z'
    }
  ],

  // Audit Actions
  auditActions: [
    {
      id: 1,
      idUserLoginDetail: 1,
      userAction: 'PORTFOLIO_SUMMARY_VIEW',
      startDateTime: '2024-01-16T10:00:00Z',
      endDateTime: '2024-01-16T10:05:00Z',
      actionDetails: 'Viewed portfolio summary with filters'
    },
    {
      id: 2,
      idUserLoginDetail: 1,
      userAction: 'ORDER_ENTRY',
      startDateTime: '2024-01-16T10:30:00Z',
      endDateTime: '2024-01-16T10:35:00Z',
      actionDetails: 'Placed buy order for GOOGL'
    },
    {
      id: 3,
      idUserLoginDetail: 1,
      userAction: 'TRANSACTION_HISTORY_VIEW',
      startDateTime: '2024-01-16T11:00:00Z',
      endDateTime: '2024-01-16T11:02:00Z',
      actionDetails: 'Viewed transaction history'
    }
  ]
};

// Mock Data Service Functions
export class MockDataService {
  // Get all data
  static getAllData() {
    return mockData;
  }

  // User Management
  static getUsers() {
    return mockData.userDetails;
  }

  static getUserById(id) {
    return mockData.userDetails.find(user => user.id === id);
  }

  static getUserLoginDetails() {
    return mockData.userLoginDetails;
  }

  // Securities/Funds
  static getSecurities() {
    return mockData.securityDetails;
  }

  static getSecurityById(id) {
    return mockData.securityDetails.find(security => security.id === id);
  }

  static getSecurityBySymbol(symbol) {
    return mockData.securityDetails.find(security => security.securitySymbol === symbol);
  }

  // Orders
  static getOrders() {
    return mockData.orderDetails;
  }

  static getOrdersByUserId(userId) {
    return mockData.orderDetails.filter(order => order.createdBy === userId);
  }

  static getOrdersByStatus(status) {
    return mockData.orderDetails.filter(order => order.orderStatus === status);
  }

  static getOrderByRefNo(orderRefNo) {
    return mockData.orderDetails.find(order => order.orderRefNo === orderRefNo);
  }

  // Account Details
  static getAccountDetails() {
    return mockData.accountDetails;
  }

  static getAccountDetailsByUserId(userId) {
    return mockData.accountDetails.filter(account => account.idUserLoginDetail === userId);
  }

  static getCurrentBalance(userId) {
    const userAccounts = this.getAccountDetailsByUserId(userId);
    if (userAccounts.length === 0) return DEFAULT_VALUES.RUNNING_BALANCE;
    return userAccounts[userAccounts.length - 1].runningBalance;
  }

  // Portfolio Summary
  static getPortfolioSummary(userId, filters = {}) {
    const userOrders = this.getOrdersByUserId(userId);
    const securities = this.getSecurities();
    
    // Group orders by security
    const portfolio = {};
    
    userOrders.forEach(order => {
      if (order.orderStatus === ORDER_STATUS.COMPLETED) {
        const security = securities.find(s => s.id === order.idSecurityDetail);
        if (!security) return;

        if (!portfolio[security.id]) {
          portfolio[security.id] = {
            securityId: security.id,
            securityName: security.securityName,
            securitySymbol: security.securitySymbol,
            totalQuantity: 0,
            totalValue: 0,
            averagePrice: 0,
            currentPrice: security.currentPrice,
            currentValue: 0,
            changePercent: security.changePercent,
            changeValue: security.changeValue
          };
        }

        const portfolioItem = portfolio[security.id];
        if (order.transactionType === TRANSACTION_TYPE.BUY) {
          portfolioItem.totalQuantity += order.quantity;
          portfolioItem.totalValue += order.orderValue;
        } else {
          portfolioItem.totalQuantity -= order.quantity;
          portfolioItem.totalValue -= order.orderValue;
        }

        if (portfolioItem.totalQuantity > 0) {
          portfolioItem.averagePrice = portfolioItem.totalValue / portfolioItem.totalQuantity;
          portfolioItem.currentValue = portfolioItem.totalQuantity * security.currentPrice;
        }
      }
    });

    // Apply filters
    let filteredPortfolio = Object.values(portfolio);
    
    if (filters.orderRefNo) {
      const order = this.getOrderByRefNo(filters.orderRefNo);
      if (order) {
        filteredPortfolio = filteredPortfolio.filter(item => 
          userOrders.some(o => o.idSecurityDetail === item.securityId && o.orderRefNo === filters.orderRefNo)
        );
      }
    }

    if (filters.securityName) {
      filteredPortfolio = filteredPortfolio.filter(item =>
        item.securityName.toLowerCase().includes(filters.securityName.toLowerCase()) ||
        item.securitySymbol.toLowerCase().includes(filters.securityName.toLowerCase())
      );
    }

    if (filters.transactionType) {
      filteredPortfolio = filteredPortfolio.filter(item =>
        userOrders.some(o => o.idSecurityDetail === item.securityId && o.transactionType === filters.transactionType)
      );
    }

    if (filters.fromDate && filters.toDate) {
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      filteredPortfolio = filteredPortfolio.filter(item =>
        userOrders.some(o => {
          const orderDate = new Date(o.orderDate);
          return o.idSecurityDetail === item.securityId && orderDate >= fromDate && orderDate <= toDate;
        })
      );
    }

    return filteredPortfolio;
  }

  // Transaction History
  static getTransactionHistory(filters = {}) {
    let transactions = [...mockData.orderDetails];

    // Filter to show only meaningful transactions (Executed and Completed orders)
    transactions = transactions.filter(t => 
      t.orderStatus === ORDER_STATUS.EXECUTED || 
      t.orderStatus === ORDER_STATUS.COMPLETED
    );

    // Apply filters
    if (filters.orderRefNo) {
      transactions = transactions.filter(t => t.orderRefNo.includes(filters.orderRefNo));
    }

    if (filters.securityName) {
      const securities = this.getSecurities();
      const matchingSecurities = securities.filter(s => 
        s.securityName.toLowerCase().includes(filters.securityName.toLowerCase()) ||
        s.securitySymbol.toLowerCase().includes(filters.securityName.toLowerCase())
      );
      transactions = transactions.filter(t => 
        matchingSecurities.some(s => s.id === t.idSecurityDetail)
      );
    }

    if (filters.transactionType) {
      transactions = transactions.filter(t => t.transactionType === filters.transactionType);
    }

    if (filters.orderStatus) {
      transactions = transactions.filter(t => t.orderStatus === filters.orderStatus);
    }

    if (filters.fromDate && filters.toDate) {
      const fromDate = new Date(filters.fromDate);
      const toDate = new Date(filters.toDate);
      transactions = transactions.filter(t => {
        const orderDate = new Date(t.orderDate);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    }

    // Add security details to transactions
    return transactions.map(transaction => {
      const security = this.getSecurityById(transaction.idSecurityDetail);
      return {
        ...transaction,
        securityName: security?.securityName,
        securitySymbol: security?.securitySymbol,
        currentPrice: security?.currentPrice
      };
    });
  }

  // Audit Functions
  static logUserAction(userId, action, details = '') {
    const auditAction = {
      id: mockData.auditActions.length + 1,
      idUserLoginDetail: userId,
      userAction: action,
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      actionDetails: details
    };
    
    mockData.auditActions.push(auditAction);
    return auditAction;
  }

  static getAuditActions(userId) {
    return mockData.auditActions.filter(action => action.idUserLoginDetail === userId);
  }

  // Generate new order
  static createOrder(orderData) {
    const newOrder = {
      id: mockData.orderDetails.length + 1,
      orderRefNo: generateOrderRefNo(),
      orderStatus: ORDER_STATUS.SUBMITTED,
      createdOn: new Date().toISOString(),
      ...orderData
    };

    mockData.orderDetails.push(newOrder);
    
    // Log the action
    this.logUserAction(orderData.createdBy, 'ORDER_CREATED', `Created ${orderData.transactionType} order for ${orderData.quantity} shares`);
    
    return newOrder;
  }

  // Update order status
  static updateOrderStatus(orderId, newStatus) {
    const order = mockData.orderDetails.find(o => o.id === orderId);
    if (order) {
      order.orderStatus = newStatus;
      this.logUserAction(order.createdBy, 'ORDER_STATUS_UPDATED', `Order ${order.orderRefNo} status changed to ${newStatus}`);
    }
    return order;
  }
}

export default MockDataService; 