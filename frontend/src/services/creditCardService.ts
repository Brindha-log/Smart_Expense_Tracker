import api from './api';

export interface CreditCard {
    id?: number;
    userId?: number;
    cardName: string;
    bankName: string;
    cardType: 'VISA' | 'MASTERCARD' | 'RUPAY' | 'AMEX' | 'DISCOVER' | 'OTHER';
    creditLimit: number;
    availableLimit: number;
    billingDate: number;
    dueDate: number;
    interestRate: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreditTransaction {
    id?: number;
    cardId?: number;
    amount: number;
    category: 'SHOPPING' | 'DINING' | 'TRAVEL' | 'GROCERIES' | 'ENTERTAINMENT' | 'UTILITY' | 'HEALTH' | 'EDUCATION' | 'OTHER';
    merchant: string;
    transactionDate: string;
    description: string;
    isEmi: boolean;
    status?: 'ACTIVE' | 'REVERSED' | 'DELETED';
    createdAt?: string;
}

export interface CreditPayment {
    id?: number;
    cardId?: number;
    amount: number;
    paymentDate: string;
    status?: 'ACTIVE' | 'REVERSED' | 'DELETED';
    createdAt?: string;
}

export interface CreditBillingSummary {
    currentBillAmount: number;
    outstandingBalance: number;
    remainingLimit: number;
    minimumDue: number;
    totalPayments: number;
    carryForwardUnpaidBalance: number;
    remainingPayableAmount: number;
    billingCycleStart: string;
    billingCycleEnd: string;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export const creditCardService = {
    // Card APIs
    getCard: async (): Promise<CreditCard | null> => {
        try {
            const response = await api.get(`/credit-card`);
            return response.data || null;
        } catch (error) {
            console.error('Error fetching credit card', error);
            return null;
        }
    },

    saveCard: async (card: CreditCard): Promise<CreditCard> => {
        const response = await api.post(`/credit-card`, card);
        return response.data;
    },

    deleteCard: async (): Promise<void> => {
        await api.delete(`/credit-card`);
    },

    getBillingSummary: async (): Promise<CreditBillingSummary | null> => {
        try {
            const response = await api.get(`/credit-card/billing-summary`);
            return response.data;
        } catch (error) {
            console.error('Error fetching billing summary', error);
            return null;
        }
    },

    // Transaction APIs
    getTransactions: async (
        page = 0,
        size = 20
    ): Promise<PageResponse<CreditTransaction>> => {
        const response = await api.get(
            `/credit-transaction?page=${page}&size=${size}`
        );
        return response.data;
    },

    addTransaction: async (
        transaction: CreditTransaction
    ): Promise<CreditTransaction> => {
        const response = await api.post(
            `/credit-transaction`,
            transaction
        );
        return response.data;
    },

    deleteTransaction: async (
        transactionId: number
    ): Promise<void> => {
        await api.delete(`/credit-transaction/${transactionId}`);
    },

    // Payment APIs
    getPayments: async (
        page = 0,
        size = 20
    ): Promise<PageResponse<CreditPayment>> => {
        const response = await api.get(
            `/credit-payment?page=${page}&size=${size}`
        );
        return response.data;
    },

    addPayment: async (
        payment: CreditPayment
    ): Promise<CreditPayment> => {
        const response = await api.post(
            `/credit-payment`,
            payment
        );
        return response.data;
    },

    deletePayment: async (
        paymentId: number
    ): Promise<void> => {
        await api.delete(`/credit-payment/${paymentId}`);
    }
};