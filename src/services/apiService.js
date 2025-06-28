// API Service for JSON Server
const API_BASE_URL = 'http://localhost:4000';

class ApiService {
  // Generic API methods
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API GET Error (${endpoint}):`, error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API POST Error (${endpoint}):`, error);
      throw error;
    }
  }

  async put(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API PUT Error (${endpoint}):`, error);
      throw error;
    }
  }

  async delete(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API DELETE Error (${endpoint}):`, error);
      throw error;
    }
  }

  // User Management
  async getUsers() {
    return this.get('/userDetails');
  }

  async getUserById(id) {
    return this.get(`/userDetails/${id}`);
  }

  async getUserLoginDetails() {
    return this.get('/userLoginDetails');
  }

  // Securities/Funds
  async getSecurities() {
    return this.get('/securityDetails');
  }

  async getSecurityById(id) {
    return this.get(`/securityDetails/${id}`);
  }

  async getSecurityBySymbol(symbol) {
    const securities = await this.get('/securityDetails');
    return securities.find(security => security.securitySymbol === symbol);
  }

  // Orders
  async getOrders() {
    return this.get('/orderDetails');
  }

  async getOrdersByUserId(userId) {
    return this.get(`/orderDetails?createdBy=${userId}`);
  }

  async getOrdersByStatus(status) {
    return this.get(`/orderDetails?orderStatus=${status}`);
  }

  async getOrderByRefNo(orderRefNo) {
    const orders = await this.get('/orderDetails');
    return orders.find(order => order.orderRefNo === orderRefNo);
  }

  async createOrder(orderData) {
    return this.post('/orderDetails', orderData);
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await this.get(`/orderDetails/${orderId}`);
    const updatedOrder = { ...order, orderStatus: newStatus };
    return this.put(`/orderDetails/${orderId}`, updatedOrder);
  }

  // Account Details
  async getAccountDetails() {
    return this.get('/accountDetails');
  }

  async getAccountDetailsByUserId(userId) {
    return this.get(`/accountDetails?idUserLoginDetail=${userId}`);
  }

  async getCurrentBalance(userId) {
    const userAccounts = await this.getAccountDetailsByUserId(userId);
    if (userAccounts.length === 0) return 10000; // Default balance
    return userAccounts[userAccounts.length - 1].runningBalance;
  }

  // Audit Functions
  async getAuditActions(userId) {
    return this.get(`/auditActions?idUserLoginDetail=${userId}`);
  }

  async logUserAction(userId, action, details = '') {
    const auditAction = {
      idUserLoginDetail: userId,
      userAction: action,
      startDateTime: new Date().toISOString(),
      endDateTime: new Date().toISOString(),
      actionDetails: details
    };
    return this.post('/auditActions', auditAction);
  }

  // Portfolio Summary
  async getPortfolioSummary(userId, filters = {}) {
    const userOrders = await this.getOrdersByUserId(userId);
    const securities = await this.getSecurities();
    
    // Group orders by security
    const portfolio = {};
    
    userOrders.forEach(order => {
      if (order.orderStatus === 'Completed') {
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
        if (order.transactionType === 'Buy') {
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
      const order = await this.getOrderByRefNo(filters.orderRefNo);
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
  async getTransactionHistory(filters = {}) {
    let transactions = await this.get('/orderDetails');

    // Filter to show only meaningful transactions (Executed and Completed orders)
    transactions = transactions.filter(t => 
      t.orderStatus === 'Executed' || t.orderStatus === 'Completed'
    );

    // Apply filters
    if (filters.orderRefNo) {
      transactions = transactions.filter(t => t.orderRefNo.includes(filters.orderRefNo));
    }

    if (filters.securityName) {
      const securities = await this.getSecurities();
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
    const securities = await this.getSecurities();
    return transactions.map(transaction => {
      const security = securities.find(s => s.id === transaction.idSecurityDetail);
      return {
        ...transaction,
        securityName: security?.securityName,
        securitySymbol: security?.securitySymbol,
        currentPrice: security?.currentPrice
      };
    });
  }
}

export const apiService = new ApiService();
export default apiService; 