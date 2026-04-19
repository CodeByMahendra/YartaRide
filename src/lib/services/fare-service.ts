import Settings from '@/models/Settings';

export interface FareBreakdown {
    baseFare: number;
    distanceFare: number;
    perKmRate: number;
    discount: number;
    platformCommission: number;
}

export async function calculateFare(
    distanceInMeters: number,
    durationInSeconds: number,
    vehicleType: string,
    isShared: boolean = false
) {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = {
            baseFare: { auto: 30, car: 50, moto: 20 },
            perKmRate: { auto: 12, car: 12, moto: 12 },
            perMinuteRate: { auto: 2, car: 3, moto: 1.5 },
            platformCommission: 0.15 // 15% default
        };
    }

    const baseFare = (settings.baseFare as any)[vehicleType] || 50;
    const perKmRate = (settings.perKmRate as any)[vehicleType] || 12;
    const perMinuteRate = (settings.perMinuteRate as any)[vehicleType] || 2;
    const platformCommissionRate = settings.platformCommission || 0.15;

    const distanceKm = distanceInMeters / 1000;
    const durationMin = durationInSeconds / 60;

    const distanceFare = distanceKm * perKmRate;
    const timeFare = durationMin * perMinuteRate;

    let totalFare = baseFare + distanceFare + timeFare;
    let discount = 0;

    if (isShared) {
        // 20-30% discount for shared rides as requested
        const discountRate = 0.25;
        discount = totalFare * discountRate;
        totalFare = totalFare - discount;
    }

    const platformCommission = totalFare * platformCommissionRate;

    return {
        totalFare: Math.round(totalFare),
        breakdown: {
            baseFare,
            distanceFare: Math.round(distanceFare + timeFare),
            perKmRate,
            discount: Math.round(discount),
            platformCommission: Math.round(platformCommission)
        }
    };
}
