// src/types/box.ts
export interface BlindBox {
    id?: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    coverImage: string;
    items: BoxItem[];
    createdAt?: Date;
}

export interface BoxItem {
    id?: string;
    name: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    image: string;
    probability: number; // 0-100
}