export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  }
  
  static isValidAddress(address: string): boolean {
    return address.trim().length >= 10;
  }
  
  static validateOrderForm(data: {
    email: string;
    phone: string;
    address: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.isValidEmail(data.email)) {
      errors.push('Неверный формат email');
    }
    
    if (!this.isValidPhone(data.phone)) {
      errors.push('Неверный формат телефона');
    }
    
    if (!this.isValidAddress(data.address)) {
      errors.push('Адрес должен содержать минимум 10 символов');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 