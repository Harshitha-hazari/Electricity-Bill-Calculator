import { BillRequest, BillResult } from "./types";

interface TariffSlab {
    limit: number;
    rate: number;
}

const tariffs: Record<BillRequest["category"], TariffSlab[]> = {
    domestic: [
        { limit: 100, rate: 2 },
        { limit: 200, rate: 3 },
        { limit: 300, rate: 5 },
        { limit: Infinity, rate: 7 }
    ],

    commercial: [
        { limit: 100, rate: 5 },
        { limit: 200, rate: 7 },
        { limit: 300, rate: 9 },
        { limit: Infinity, rate: 12 }
    ]
};

function calculateEnergyCharges(
    units: number,
    category: BillRequest["category"]
): number {
    let remainingUnits = units;
    let previousLimit = 0;
    let energyCharges = 0;

    for (const slab of tariffs[category]) {
        const availableUnits = slab.limit - previousLimit;

        const unitsInSlab = Math.min(
            remainingUnits,
            availableUnits
        );

        energyCharges += unitsInSlab * slab.rate;
        remainingUnits -= unitsInSlab;
        previousLimit = slab.limit;

        if (remainingUnits <= 0) {
            break;
        }
    }

    return energyCharges;
}

export function calculateBill(
    request: BillRequest
): BillResult {
    const energyCharges = calculateEnergyCharges(
        request.units,
        request.category
    );

    const total =
        energyCharges +
        request.fixedCharges +
        request.otherCharges;

    return {
        category: request.category,
        units: request.units,
        energyCharges: Number(energyCharges.toFixed(2)),
        fixedCharges: Number(request.fixedCharges.toFixed(2)),
        otherCharges: Number(request.otherCharges.toFixed(2)),
        total: Number(total.toFixed(2))
    };
}