export interface AdminAccessProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarInitials: string;
}
export interface AdminStoreSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  storeLocation: string;
  instagramUrl: string;
  maxInstallments: number;
  freeShippingMinValue: number;
  estimatedDelivery: string;
  promoBarEnabled: boolean;
  promoBarMessage: string;
  ordersAlertEmail: string;
  maintenanceMode: boolean;
  shippingOriginCep: string;
  shippingOriginStreet: string;
  shippingOriginNumber: string;
  shippingOriginComplement: string;
  shippingOriginNeighborhood: string;
  shippingOriginCity: string;
  shippingOriginState: string;
}
