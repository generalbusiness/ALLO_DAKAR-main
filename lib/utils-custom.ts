/**
 * Format currency in CFA Franc
 */
export function formatCurrency(amount: number): string {
    return `${amount.toLocaleString('fr-FR')} F`;
  }
  
  /**
   * Format phone number for Senegal
   */
  export function formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as +221 XX XXX XX XX
    if (cleaned.length === 9) {
      return `+221 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
    }
    
    return phone;
  }
  
  /**
   * Generate SMS message for parcel delivery notification
   */
  export function generateParcelSMS(recipientName: string, senderName?: string): string {
    const sender = senderName ? ` de la part de ${senderName}` : '';
    return `Bonjour ${recipientName}, vous allez recevoir un colis via Allô Dakar${sender}. Merci de vous rendre disponible.`;
  }
  
  /**
   * Calculate distance between two points (mock implementation)
   */
  export function calculateDistance(from: string, to: string): number {
    // This is a mock implementation
    // In production, you would use Google Maps Distance Matrix API
    const cities: Record<string, { lat: number; lng: number }> = {
      'Dakar': { lat: 14.6928, lng: -17.4467 },
      'Thiès': { lat: 14.7886, lng: -16.9260 },
      'Saint-Louis': { lat: 16.0178, lng: -16.4883 },
      'Kaolack': { lat: 14.1497, lng: -16.0775 },
      'Ziguinchor': { lat: 12.5681, lng: -16.2719 },
      'Mbour': { lat: 14.4167, lng: -16.9667 },
    };
    
    const fromCity = cities[from];
    const toCity = cities[to];
    
    if (!fromCity || !toCity) return 0;
    
    // Simple distance calculation (Haversine formula)
    const R = 6371; // Radius of the Earth in km
    const dLat = (toCity.lat - fromCity.lat) * Math.PI / 180;
    const dLon = (toCity.lng - fromCity.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(fromCity.lat * Math.PI / 180) * Math.cos(toCity.lat * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance);
  }
  
  /**
   * Calculate estimated price based on distance and type
   */
  export function calculatePrice(distance: number, type: 'voyage' | 'colis', seats: number = 1): number {
    const basePrice = type === 'voyage' ? 1000 : 800;
    const pricePerKm = type === 'voyage' ? 100 : 80;
    
    return (basePrice + (distance * pricePerKm)) * seats;
  }
  
  /**
   * Format date to French locale
   */
  export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
  
  /**
   * Format time
   */
  export function formatTime(time: string): string {
    return time;
  }
  
  /**
   * Validate Senegalese phone number
   */
  export function validatePhoneNumber(phone: string): boolean {
    // Senegalese phone numbers are 9 digits
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 9 && /^7[0-9]{8}$/.test(cleaned);
  }
  
  /**
   * Generate unique ID
   */
  export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  