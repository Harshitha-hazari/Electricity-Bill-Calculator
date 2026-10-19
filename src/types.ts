export type ConsumerCategory = "domestic" | "commercial";

export interface BillRequest {
    category: ConsumerCategory;
    units: number;
    fixedCharges: number;
    otherCharges: number;
}

export interface BillResult {
    category: ConsumerCategory;
    units: number;
    energyCharges: number;
    fixedCharges: number;
    otherCharges: number;
    total: number;
}