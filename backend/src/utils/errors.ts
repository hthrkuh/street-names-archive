/**
 * Custom error classes for better error handling
 */

export class ValidationError extends Error {
  statusCode: number;
  
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  
  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ElasticsearchError extends Error {
  statusCode: number;
  originalError: any;
  
  constructor(message: string, originalError?: any) {
    super(message);
    this.name = 'ElasticsearchError';
    this.statusCode = 500;
    this.originalError = originalError;
    Object.setPrototypeOf(this, ElasticsearchError.prototype);
  }
}

