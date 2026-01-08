export type Zone = 'Standard' | 'Premium_Eiffel' | 'Sky_Balloon';
export type Skin = 'Iron' | 'Gold' | 'Diamond' | 'Ruby';
export type MediaType = 'none' | 'photo' | 'video' | 'audio';

// --- TES PRIX EXACTS (USD) ---
export const ZONE_PRICES: Record<Zone, number> = {
  Standard: 29.99,
  Premium_Eiffel: 79.99,
  Sky_Balloon: 149.99,
};

export const SKIN_PRICES: Record<Skin, number> = {
  Iron: 0,
  Gold: 19.99,
  Diamond: 49.99,
  Ruby: 99.99,
};

export const MEDIA_PRICES: Record<MediaType, number> = {
  none: 0,
  photo: 9.99,
  video: 29.99,
  audio: 14.99,
};

export const PLATFORM_COMMISSION_RATE = 0.20;
export const CUSTOM_NUMBER_PRICE = 19.99;
export const PRIVATE_LOCK_PRICE = 0;

// --- CALCULATEUR ---
export function calculateLockPrice(
  zone: Zone,
  skin: Skin,
  mediaType: MediaType = 'none',
  customNumber: boolean = false,
  isPrivate: boolean = false
): number {
  const zonePrice = ZONE_PRICES[zone];
  const skinPrice = SKIN_PRICES[skin];
  const mediaPrice = MEDIA_PRICES[mediaType];
  const customNumberPrice = customNumber ? CUSTOM_NUMBER_PRICE : 0;
  const privatePrice = isPrivate ? PRIVATE_LOCK_PRICE : 0;

  return Number((zonePrice + skinPrice + mediaPrice + customNumberPrice + privatePrice).toFixed(2));
}

export function calculateResaleCommission(resalePrice: number): {
  platformCommission: number;
  sellerProfit: number;
} {
  const platformCommission = resalePrice * PLATFORM_COMMISSION_RATE;
  const sellerProfit = resalePrice - platformCommission;

  return {
    platformCommission: Number(platformCommission.toFixed(2)),
    sellerProfit: Number(sellerProfit.toFixed(2)),
  };
}

export function getNextAvailableLockId(existingLockIds: number[]): number | null {
  for (let id = 1; id <= 1000000; id++) {
    if (!existingLockIds.includes(id)) {
      return id;
    }
  }
  return null;
}

export function getRandomAvailableLockId(
  existingLockIds: number[],
  reservedIds: number[]
): number | null {
  const MAX_ATTEMPTS = 100;
  const existingSet = new Set(existingLockIds);
  const reservedSet = new Set(reservedIds);

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const randomId = Math.floor(Math.random() * 1000000) + 1;
    if (!existingSet.has(randomId) && !reservedSet.has(randomId)) {
      return randomId;
    }
  }
  return null;
}

export function isLockIdAvailable(
  lockId: number,
  existingLockIds: number[],
  reservedIds: number[]
): boolean {
  if (lockId < 1 || lockId > 1000000) return false;
  const existingSet = new Set(existingLockIds);
  const reservedSet = new Set(reservedIds);
  return !existingSet.has(lockId) && !reservedSet.has(lockId);
}

// --- DESCRIPTIONS (EN ANGLAIS POUR LE SITE INTERNATIONAL) ---
export const ZONE_DESCRIPTIONS: Record<Zone, { name: string; description: string }> = {
  Standard: {
    name: 'Standard Zone',
    description: 'Classic location on the bridge.',
  },
  Premium_Eiffel: {
    name: 'Eiffel Tower View',
    description: 'Premium spot facing the Eiffel Tower.',
  },
  Sky_Balloon: {
    name: 'Sky Balloon',
    description: 'Floating high above Paris in a balloon.',
  },
};

export const SKIN_DESCRIPTIONS: Record<Skin, { name: string; description: string }> = {
  Iron: {
    name: 'Classic Iron',
    description: 'Standard iron finish.',
  },
  Gold: {
    name: '24K Gold',
    description: 'Shiny luxury gold finish.',
  },
  Diamond: {
    name: 'Diamond',
    description: 'Encrusted with sparkling diamonds.',
  },
  Ruby: {
    name: 'Royal Ruby',
    description: 'Precious red gem finish.',
  },
};
