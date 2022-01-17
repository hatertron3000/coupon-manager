export interface ProductsFormData {
    description: string;
    isVisible: boolean;
    name: string;
    price: number;
    type: string;
}

export interface ProductsTableItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface ProductsListItem extends ProductsFormData {
    id: number;
}

export interface StringKeyValue {
    [key: string]: string;
}
