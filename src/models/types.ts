export type Language = 'en' | 'fr' | 'ar';
export type SubscriptionTierType = 'Bronze' | 'Silver' | 'Gold' | 'None';
export type PaymentMethodType = 'Whish' | 'OMT' | 'WesternUnion' | 'CreditCard';
export type OrderStatus = 'PendingPayment' | 'Processing' | 'Shipped' | 'Delivered';

export interface UserProfile {
    id: string;
    name: string;
    phone: string;
    country: string;
    countryCode: string;
    otpVerified: boolean;
    language: Language;
    subscription: SubscriptionTierType;
    hasIrisTestAccess: boolean;
}

export interface Supplement {
    id: string;
    name: string;
    description: string;
    type: 'Pill' | 'Liquid' | 'Powder';
    price: number;
    weightGrams: number;
}

export interface NutritionalMeal {
    id: string;
    name: string;
    description: string;
    calories?: number;
}

export interface TreatmentTask {
    id: string;
    userId: string;
    type: 'supplement' | 'nutrition';
    itemId: string; // Refers to Supplement.id or NutritionalMeal.id
    title: string;
    time: string; // HH:mm format
    date: string; // YYYY-MM-DD
    dosage?: string;
    instructions?: string; // "With Water", "With Meal"
    completed: boolean;
    notes?: Record<Language, string>; // Translated notes from Admin
}

export interface CartItem {
    supplement: Supplement;
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    status: OrderStatus;
    receiptUrl?: string; // For manual payments
    paymentMethod: PaymentMethodType;
    createdAt: string;
}

export interface PaymentReceipt {
    id: string;
    userId: string;
    orderId?: string; // Optional if it's for Subscription/Iris Test instead of Store Order
    paymentType: 'StoreOrder' | 'Subscription' | 'IrisTest';
    method: PaymentMethodType;
    fileUrl: string;
    amount: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedAt: string;
}

// STAGE 3 DOMAINS
export type MediaType = 'Blog' | 'Video' | 'Audio' | 'Interview';
export type SymptomTag = 'Anxiety' | 'Digestion' | 'Sugar Detox' | 'Fatigue' | 'Iridology 101';

export interface MediaAsset {
    id: string;
    title: Record<Language, string>;
    description: Record<Language, string>;
    type: MediaType;
    tags: SymptomTag[];
    thumbnailUrl: string;
    mediaUrl: string;
    requiredTier: SubscriptionTierType; // Silver/Gold unlocks all. Bronze locks Video/Audio
    publishedAt: string;
}

export interface AppNotification {
    id: string;
    userId?: string; // If null, it's a global "Echo"
    type: 'Alert' | 'SupplementReminder' | 'DailyEcho';
    title: Record<Language, string>;
    message: Record<Language, string>;
    isRead: boolean;
    createdAt: string;
    actionUrl?: string;
}
