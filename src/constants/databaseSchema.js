// Database Schema Constants based on the provided database design

export const DATABASE_SCHEMA = {
  // User Management Tables
  USER_DETAIL: {
    ID: 'id',
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    EMAIL_ADDRESS: 'emailAddress',
    CREATED_ON: 'createdOn',
    CREATED_BY: 'createdBy',
    MODIFIED_ON: 'modifiedOn',
    MODIFIED_BY: 'modifiedBy'
  },

  USER_LOGIN_DETAIL: {
    ID: 'id',
    ID_USER_DETAIL: 'idUserDetail',
    FIRST_NAME: 'firstName',
    LAST_NAME: 'lastName',
    EMAIL_ADDRESS: 'emailAddress',
    USER_STATUS: 'userStatus',
    CREATED_ON: 'createdOn',
    CREATED_BY: 'createdBy',
    MODIFIED_ON: 'modifiedOn',
    MODIFIED_BY: 'modifiedBy'
  },

  // Order Management Tables
  ORDER_DETAIL: {
    ID: 'id',
    ID_SECURITY_DETAIL: 'idSecurityDetail',
    ORDER_REF_NO: 'orderRefNo',
    ORDER_STATUS: 'orderStatus',
    TRANSACTION_TYPE: 'transactionType',
    ORDER_VALUE: 'orderValue',
    QUANTITY: 'quantity',
    ORDER_DATE: 'orderDate',
    CREATED_ON: 'createdOn',
    CREATED_BY: 'createdBy'
  },

  ACCOUNT_DETAIL: {
    ID: 'id',
    ID_USER_LOGIN_DETAIL: 'idUserLoginDetail',
    CREDIT: 'credit',
    DEBIT: 'debit',
    RUNNING_BALANCE: 'runningBalance',
    ID_ORDER_DETAIL: 'idOrderDetail',
    CREATED_ON: 'createdOn',
    CREATED_BY: 'createdBy'
  },

  SECURITY_DETAIL: {
    ID: 'id',
    SECURITY_NAME: 'securityName',
    SECURITY_SYMBOL: 'securitySymbol',
    VALUE: 'value',
    CURRENT_PRICE: 'currentPrice',
    CHANGE_PERCENT: 'changePercent',
    CHANGE_VALUE: 'changeValue'
  },

  // Audit Tables
  AUDIT_USER_LOGIN: {
    ID: 'id',
    ID_USER_LOGIN_DETAIL: 'idUserLoginDetail',
    SESSION_ID: 'sessionId',
    LOGIN_STATUS: 'loginStatus',
    LOGIN_DATE_TIME: 'loginDateTime',
    LOGOUT_DATE_TIME: 'logoutDateTime'
  },

  AUDIT_ACTION: {
    ID: 'id',
    ID_USER_LOGIN_DETAIL: 'idUserLoginDetail',
    USER_ACTION: 'userAction',
    START_DATE_TIME: 'startDateTime',
    END_DATE_TIME: 'endDateTime',
    ACTION_DETAILS: 'actionDetails'
  }
};

// Order Status Constants
export const ORDER_STATUS = {
  SUBMITTED: 'Submitted',
  EXECUTED: 'Executed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  FAILED: 'Failed'
};

// Transaction Type Constants
export const TRANSACTION_TYPE = {
  BUY: 'Buy',
  SELL: 'Sell'
};

// User Status Constants
export const USER_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  SUSPENDED: 'Suspended'
};

// Login Status Constants
export const LOGIN_STATUS = {
  SUCCESS: 'Success',
  FAILED: 'Failed',
  LOGOUT: 'Logout'
};

// Default Values
export const DEFAULT_VALUES = {
  RUNNING_BALANCE: 10000,
  CURRENCY: 'USD',
  DEFAULT_USER_ID: 1
};

// Validation Rules
export const VALIDATION_RULES = {
  ORDER_REF_NO: {
    pattern: /^ORD\d{8}$/,
    message: 'Order Reference Number must be in format ORD followed by 8 digits'
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  QUANTITY: {
    min: 1,
    message: 'Quantity must be greater than 0'
  },
  ORDER_VALUE: {
    min: 0.01,
    message: 'Order value must be greater than 0'
  }
}; 