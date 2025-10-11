import { Request, Response, NextFunction } from 'express';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationUtils {
  /**
   * Validate registration number format and range
   */
  static validateRegistrationNumber(regNo: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!regNo || typeof regNo !== 'string') {
      errors.push({ field: 'regNo', message: 'Registration number is required' });
      return errors;
    }

    // Remove "RA" prefix if present
    const cleaned = regNo.startsWith("RA") ? regNo.slice(2) : regNo;
    
    // Check if it's numeric
    if (!/^\d+$/.test(cleaned)) {
      errors.push({ field: 'regNo', message: 'Registration number must be numeric' });
      return errors;
    }

    // Check range
    const num = parseInt(cleaned, 10);
    const REGISTRATION_RANGE = {
      min: 2411033010001,
      max: 2411033010057,
    };

    if (num < REGISTRATION_RANGE.min || num > REGISTRATION_RANGE.max) {
      errors.push({ 
        field: 'regNo', 
        message: `Registration number must be between ${REGISTRATION_RANGE.min} and ${REGISTRATION_RANGE.max}` 
      });
    }

    return errors;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!password || typeof password !== 'string') {
      errors.push({ field: 'password', message: 'Password is required' });
      return errors;
    }

    if (password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    }

    if (password.length > 128) {
      errors.push({ field: 'password', message: 'Password must be less than 128 characters' });
    }

    return errors;
  }

  /**
   * Validate message content
   */
  static validateMessageContent(content: string): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!content || typeof content !== 'string') {
      errors.push({ field: 'content', message: 'Message content is required' });
      return errors;
    }

    const trimmed = content.trim();
    
    if (trimmed.length === 0) {
      errors.push({ field: 'content', message: 'Message cannot be empty' });
    }

    if (content.length > 1000) {
      errors.push({ field: 'content', message: 'Message cannot exceed 1000 characters' });
    }

    // Check for potentially malicious content
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        errors.push({ field: 'content', message: 'Message contains potentially harmful content' });
        break;
      }
    }

    return errors;
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate request body structure
   */
  static validateRequestBody(req: Request, requiredFields: string[]): ValidationError[] {
    const errors: ValidationError[] = [];
    
    if (!req.body || typeof req.body !== 'object') {
      errors.push({ field: 'body', message: 'Request body is required' });
      return errors;
    }

    for (const field of requiredFields) {
      if (!(field in req.body)) {
        errors.push({ field, message: `${field} is required` });
      }
    }

    return errors;
  }
}

/**
 * Middleware to validate registration data
 */
export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const bodyErrors = ValidationUtils.validateRequestBody(req, ['regNo', 'password']);
  if (bodyErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: bodyErrors 
    });
  }

  const regNoErrors = ValidationUtils.validateRegistrationNumber(req.body.regNo);
  const passwordErrors = ValidationUtils.validatePassword(req.body.password);
  
  const allErrors = [...regNoErrors, ...passwordErrors];
  
  if (allErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: allErrors 
    });
  }

  // Sanitize inputs
  req.body.regNo = ValidationUtils.sanitizeString(req.body.regNo);
  req.body.password = req.body.password; // Don't sanitize password

  next();
};

/**
 * Middleware to validate login data
 */
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const bodyErrors = ValidationUtils.validateRequestBody(req, ['regNo', 'password']);
  if (bodyErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: bodyErrors 
    });
  }

  const regNoErrors = ValidationUtils.validateRegistrationNumber(req.body.regNo);
  const passwordErrors = ValidationUtils.validatePassword(req.body.password);
  
  const allErrors = [...regNoErrors, ...passwordErrors];
  
  if (allErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: allErrors 
    });
  }

  // Sanitize inputs
  req.body.regNo = ValidationUtils.sanitizeString(req.body.regNo);
  req.body.password = req.body.password; // Don't sanitize password

  next();
};

/**
 * Middleware to validate message data
 */
export const validateMessage = (req: Request, res: Response, next: NextFunction) => {
  const bodyErrors = ValidationUtils.validateRequestBody(req, ['content']);
  if (bodyErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: bodyErrors 
    });
  }

  const contentErrors = ValidationUtils.validateMessageContent(req.body.content);
  
  if (contentErrors.length > 0) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: contentErrors 
    });
  }

  // Sanitize content
  req.body.content = ValidationUtils.sanitizeString(req.body.content);

  next();
};

