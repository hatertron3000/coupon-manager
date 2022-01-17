export interface CouponFormData {
    code: string;
    max_uses: number;
    max_uses_per_customer: number;
}

export interface CouponListItem extends CouponFormData {
    id: string;
    current_uses: number;
    created: string;
}

export enum PromotionRedemptionType {
    coupon = "COUPON",
    automatic = "AUTOMATIC",
}

export enum PromotionStatus {
    enabled = "ENABLED",
    disabled = "DISABLED",
    invalid = "INVALID",
}

export interface PromotionTableItem {
    id: string;
    redemption_type: PromotionRedemptionType;
    name: string;
    current_uses: number;
    max_uses: number;
    status: PromotionStatus;
    start_date: string;
    end_date: string;
    currency_code: string;
}