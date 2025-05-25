export enum Role {
    User = 'USER',
    Admin = 'ADMIN'
}

export interface IUser {
    _id: string;
    name?: string;
    email: string;
    password: string;
    phone?: string;
    addresses: IAddress[];
    isActivated: boolean;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    role: Role.User | Role.Admin;
}

export interface IAddress {
    _id: string;
    city: string;
    street: string;
    house: string;
    apartment?: string;
}

export interface IProduct {
    _id: string;
    name: string;
    description?: string;
    composition?: string;
    shelfLife: {
        value: number;
        unit: 'д' | 'м';
    };
    weight: {
        value: number;
        unit: 'г' | 'кг' | 'шт' | 'мл' | 'л';
    };
    storageConditions: string;
    price: number;
    category: ICategory;
    manufacturer?: string;
    discount?: number;
    image: string;
    filters?: string[];
}

export interface ICategory {
    _id: string;
    name: string;
    image?: string;
    parent?: string | null;
    subcategories?: ICategory[];
    filters?: string[];
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
    finalPrice: number;
}

export interface ICart {
    _id: string;
    user: string | IUser;
    items: ICartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface IOrderItem {
    product: IProduct;
    quantity: number;
    price: number;
}

export enum OrderStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Cancelled = 'cancelled',
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.Pending]:    'В ожидании',
    [OrderStatus.Processing]: 'В обработке',
    [OrderStatus.Completed]:  'Завершён',
    [OrderStatus.Cancelled]:  'Отменён',
};

export interface IOrder {
    _id: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    items: IOrderItem[];
    total: number;
    address: {
        city: string;
        street: string;
        house: string;
        apartment?: string;
    };
    status: OrderStatus.Pending | OrderStatus.Processing | OrderStatus.Completed | OrderStatus.Cancelled;
    createdAt?: string;
    updatedAt?: string;
}
