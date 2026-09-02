// ============================================================================
// 1. FOOD LIBRARY
// ============================================================================
export type Availability = 'common' | 'uncommon' | 'rare' | 'exotic';
export type FoodRegion = 'europe' | 'asia' | 'americas' | 'africa' | 'oceania' | 'global';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface Nutrient {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  water: number;
}

export interface Micronutrients {
  // --- MINERALS ---
  ironMg: number;
  calciumMg: number;
  potassiumMg: number;
  sodiumMg: number;
  magnesiumMg: number;
  zincMg: number;

  // --- VITAMINS ---
  vitaminCMg: number;
  vitaminDMcg: number;
  vitaminBMcg: number;
  vitaminKMcg: number;
  folateMcg: number;
  vitaminAMcg: number;
  vitaminEMg: number;

  // --- FATTY ACIDS ---
  omega3Mg: number;
  omega6Mg: number;
  oleicAcidG: number;

  // --- BIOACTIVE COMPOUNDS ---
  lycopeneMcg: number;
  betaCaroteneMcg: number;
  luteinMcg: number;
  anthocyaninsMg: number;
  probioticsCFU: number;
  prebioticFiberG: number;
};

export interface Food {
  id: string;
  name: string;
  shortName: string;
  emoji: string;
  iconId?: string;
  category: FoodCategory;
  servingSize: number;
  servingSizeLabel: string;
  calories: number;
  macronutrients: Nutrient;
  micronutrients: Micronutrients;
  tags: FoodTag[];
  availability: Availability;
  region: FoodRegion;
}

export interface ScenarioGoal {
  nutrientKey: string;
  target?: number;
  maxValue?: number;
  unitLabel?: string;
}

export interface Scenario {
  id: string;
  tier: number;
  pathId?: string;
  title: string;
  description: string;
  activeMeals: MealType[]; // Replaces layout/mealType

  // Goals: primary (overall) or meal-specific (for teaching splitting)
  primaryGoals?: ScenarioGoal[];
  mealGoals?: {
    breakfast?: ScenarioGoal[];
    lunch?: ScenarioGoal[];
    dinner?: ScenarioGoal[];
    snacks?: ScenarioGoal[];
  };

  // Dietary / Tag restrictions
  requiredFoodTags?: FoodTag[];
  mustIncludeFoodTags?: FoodTag[];
  forbiddenFoodTags?: FoodTag[];

  // Combos
  requiredComboIds?: string[];
  forbiddenComboIds?: string[];

  // Rewards
  coinsReward: number;
  unlocksFoods?: string[];
}

export type FoodCategory =
  | 'meat-fish' | 'dairy' | 'grains' | 'vegetables' | 'fruits'
  | 'nuts-legumes' | 'snacks' | 'drinks' | 'seasonings-fats';

export const CATEGORY_EMOJIS: Record<FoodCategory, string> = {
  'meat-fish': '🥩', 'dairy': '🥛', 'grains': '🍞', 'vegetables': '🥦',
  'fruits': '🍎', 'nuts-legumes': '🌰', 'snacks': '🍰', 'drinks': '🥤',
  'seasonings-fats': '🫒',
};

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  'meat-fish': 'Meat/Fish',
  'dairy': 'Dairy',
  'grains': 'Grains',
  'vegetables': 'Veggies',
  'fruits': 'Fruits',
  'nuts-legumes': 'Nuts/Beans',
  'snacks': 'Snacks',
  'drinks': 'Drinks',
  'seasonings-fats': 'Spices/Oils',
};

export type FoodTag =
  | 'high-protein' | 'high-fiber' | 'high-sugar' | 'high-sodium' | 'high-iron'
  | 'high-vitaminD' | 'high-vitaminA' | 'high-vitaminC' | 'high-vitaminE' | 'high-magnesium'
  | 'high-potassium' | 'high-calcium' | 'high-antioxidants' | 'high-fat' | 'very-low-fat'
  | 'low-fat' | 'low-calorie' | 'healthy-fats' | 'empty-calories' | 'high-saturated-fat'
  | 'anti-inflammatory' | 'metabolism-boost' | 'essential' | 'hydrating' | 'alcohol'
  | 'caffeine' | 'zero-calorie' | 'high-choline' | 'complete-protein' | 'snack'
  | 'post-workout' | 'fortified' | 'high-omega6' | 'high-omega3' | 'vegetable'
  | 'vegan' | 'gluten-free' | 'slow-carbs' | 'fast-carbs' | 'probiotic' | 'fermented';

// ============================================================================
// 1. FOOD LIBRARY
// ============================================================================

export const FOOD_LIBRARY: Food[] = [
  // ============================================
  // 1. MEAT & FISH (8)
  // ============================================
  {
    id: 'chicken', name: 'Chicken Breast (cooked, skinless)', shortName: 'Chicken', emoji: '🍗',
    category: 'meat-fish', servingSize: 150, servingSizeLabel: 'g', calories: 248,
    macronutrients: { protein: 46.5, carbs: 0, fat: 5.4, fiber: 0, water: 97.5 },
    micronutrients: { ironMg: 1.35, calciumMg: 16.5, vitaminCMg: 0, vitaminDMcg: 0.15, vitaminBMcg: 0.45, vitaminKMcg: 0, folateMcg: 6, vitaminAMcg: 9, vitaminEMg: 0.42, potassiumMg: 384, sodiumMg: 111, magnesiumMg: 39, zincMg: 1.17, omega3Mg: 70, omega6Mg: 230, oleicAcidG: 2.1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'low-fat', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'beef', name: 'Beef Steak (lean, cooked)', shortName: 'Beef', emoji: '🥩',
    category: 'meat-fish', servingSize: 150, servingSizeLabel: 'g', calories: 375,
    macronutrients: { protein: 39, carbs: 0, fat: 22.5, fiber: 0, water: 88.5 },
    micronutrients: { ironMg: 3.9, calciumMg: 18, vitaminCMg: 0, vitaminDMcg: 0.15, vitaminBMcg: 2.25, vitaminKMcg: 1.5, folateMcg: 12, vitaminAMcg: 0, vitaminEMg: 0.9, potassiumMg: 477, sodiumMg: 112.5, magnesiumMg: 31.5, zincMg: 9.47, omega3Mg: 60, omega6Mg: 300, oleicAcidG: 6, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-iron', 'high-potassium', 'high-saturated-fat', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'egg', name: 'Whole Egg (large, boiled)', shortName: 'Egg', emoji: '🥚',
    category: 'meat-fish', servingSize: 50, servingSizeLabel: 'g', calories: 78,
    macronutrients: { protein: 6.5, carbs: 0.6, fat: 5.5, fiber: 0, water: 37.5 },
    micronutrients: { ironMg: 0.88, calciumMg: 28, vitaminCMg: 0, vitaminDMcg: 1, vitaminBMcg: 0.45, vitaminKMcg: 0.3, folateMcg: 12, vitaminAMcg: 80, vitaminEMg: 0.53, potassiumMg: 69, sodiumMg: 62, magnesiumMg: 6, zincMg: 0.65, omega3Mg: 30, omega6Mg: 120, oleicAcidG: 2.5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 150, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'complete-protein', 'high-choline', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'salmon', name: 'Salmon Fillet (cooked)', shortName: 'Salmon', emoji: '🐟',
    category: 'meat-fish', servingSize: 150, servingSizeLabel: 'g', calories: 312,
    macronutrients: { protein: 30, carbs: 0, fat: 19.5, fiber: 0, water: 97.5 },
    micronutrients: { ironMg: 0.51, calciumMg: 18, vitaminCMg: 0, vitaminDMcg: 18.75, vitaminBMcg: 4.8, vitaminKMcg: 0.3, folateMcg: 15, vitaminAMcg: 18, vitaminEMg: 5.33, potassiumMg: 544.5, sodiumMg: 88.5, magnesiumMg: 40.5, zincMg: 0.96, omega3Mg: 2250, omega6Mg: 150, oleicAcidG: 4.5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'healthy-fats', 'high-omega3', 'high-potassium', 'high-vitaminD', 'anti-inflammatory', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'sardines', name: 'Sardines (canned in oil, drained)', shortName: 'Sardines', emoji: '🐟',
    category: 'meat-fish', servingSize: 90, servingSizeLabel: 'g', calories: 187,
    macronutrients: { protein: 22.5, carbs: 0, fat: 10, fiber: 0, water: 54 },
    micronutrients: { ironMg: 2.61, calciumMg: 343.8, vitaminCMg: 0, vitaminDMcg: 6.12, vitaminBMcg: 8.01, vitaminKMcg: 2.7, folateMcg: 9, vitaminAMcg: 27, vitaminEMg: 1.84, potassiumMg: 357.3, sodiumMg: 276.3, magnesiumMg: 27, zincMg: 1.18, omega3Mg: 1500, omega6Mg: 100, oleicAcidG: 3, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'healthy-fats', 'high-iron', 'high-omega3', 'high-calcium', 'high-vitaminD', 'anti-inflammatory', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'shrimp', name: 'Shrimp (cooked)', shortName: 'Shrimp', emoji: '🦐',
    category: 'meat-fish', servingSize: 100, servingSizeLabel: 'g', calories: 99,
    macronutrients: { protein: 24, carbs: 0.2, fat: 0.3, fiber: 0, water: 75 },
    micronutrients: { ironMg: 0.21, calciumMg: 52, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 2.5, vitaminKMcg: 0.2, folateMcg: 3, vitaminAMcg: 18, vitaminEMg: 1.32, potassiumMg: 259, sodiumMg: 111, magnesiumMg: 37, zincMg: 1.11, omega3Mg: 200, omega6Mg: 10, oleicAcidG: 0.1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'very-low-fat', 'low-calorie', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'pork', name: 'Pork Chop (lean, cooked)', shortName: 'Pork', emoji: '🍖',
    category: 'meat-fish', servingSize: 150, servingSizeLabel: 'g', calories: 363,
    macronutrients: { protein: 40.5, carbs: 0, fat: 21, fiber: 0, water: 87 },
    micronutrients: { ironMg: 1.31, calciumMg: 28.5, vitaminCMg: 0.6, vitaminDMcg: 1.2, vitaminBMcg: 0.9, vitaminKMcg: 0, folateMcg: 6, vitaminAMcg: 3, vitaminEMg: 0.45, potassiumMg: 543, sodiumMg: 93, magnesiumMg: 36, zincMg: 3.59, omega3Mg: 30, omega6Mg: 300, oleicAcidG: 5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-saturated-fat', 'high-potassium', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'turkey', name: 'Turkey Breast (cooked)', shortName: 'Turkey', emoji: '🦃',
    category: 'meat-fish', servingSize: 150, servingSizeLabel: 'g', calories: 240,
    macronutrients: { protein: 38, carbs: 0, fat: 6, fiber: 0, water: 103 },
    micronutrients: { ironMg: 2.5, calciumMg: 15, vitaminCMg: 0, vitaminDMcg: 0.15, vitaminBMcg: 0.9, vitaminKMcg: 0, folateMcg: 9, vitaminAMcg: 0, vitaminEMg: 0.3, potassiumMg: 405, sodiumMg: 105, magnesiumMg: 33, zincMg: 2.4, omega3Mg: 30, omega6Mg: 300, oleicAcidG: 1.5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'low-fat', 'high-iron', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'canned-tuna', name: 'Tuna (Canned in water, drained)', shortName: 'Tuna', emoji: '🥫',
    category: 'meat-fish', servingSize: 100, servingSizeLabel: 'g', calories: 116,
    macronutrients: { protein: 25.5, carbs: 0, fat: 0.8, fiber: 0, water: 70 },
    micronutrients: { ironMg: 1.5, calciumMg: 4, vitaminCMg: 0, vitaminDMcg: 1.5, vitaminBMcg: 2.5, vitaminKMcg: 0, folateMcg: 4, vitaminAMcg: 8, vitaminEMg: 1, potassiumMg: 237, sodiumMg: 290, magnesiumMg: 27, zincMg: 0.9, omega3Mg: 800, omega6Mg: 50, oleicAcidG: 0.2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-omega3', 'high-sodium', 'gluten-free'], availability: 'common', region: 'global',
  },

  // ============================================
  // 2. DAIRY (8)
  // ============================================
  {
    id: 'milk', name: 'Whole Milk', shortName: 'Milk', emoji: '🥛',
    category: 'dairy', servingSize: 250, servingSizeLabel: 'ml', calories: 153,
    macronutrients: { protein: 8, carbs: 12, fat: 8.3, fiber: 0, water: 220 },
    micronutrients: { ironMg: 0.08, calciumMg: 282.5, vitaminCMg: 0, vitaminDMcg: 3.25, vitaminBMcg: 1.13, vitaminKMcg: 0.5, folateMcg: 12, vitaminAMcg: 115, vitaminEMg: 0.18, potassiumMg: 330, sodiumMg: 107.5, magnesiumMg: 25, zincMg: 0.93, omega3Mg: 0, omega6Mg: 50, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 15, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-calcium', 'high-vitaminD', 'high-vitaminA', 'complete-protein', 'hydrating', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'cheese', name: 'Cheddar Cheese', shortName: 'Cheese', emoji: '🧀',
    category: 'dairy', servingSize: 30, servingSizeLabel: 'g', calories: 121,
    macronutrients: { protein: 7.5, carbs: 0.4, fat: 10, fiber: 0, water: 11.1 },
    micronutrients: { ironMg: 0.2, calciumMg: 216.3, vitaminCMg: 0, vitaminDMcg: 0.18, vitaminBMcg: 0.1, vitaminKMcg: 2.4, folateMcg: 3, vitaminAMcg: 79.5, vitaminEMg: 0.09, potassiumMg: 29.4, sodiumMg: 186.3, magnesiumMg: 8.4, zincMg: 0.93, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 2.5, lycopeneMcg: 0, betaCaroteneMcg: 30, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'high-saturated-fat', 'fermented', 'high-sodium', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'greek-yogurt', name: 'Greek Yogurt (2% fat)', shortName: 'Greek Yogurt', emoji: '🫙',
    category: 'dairy', servingSize: 150, servingSizeLabel: 'g', calories: 145,
    macronutrients: { protein: 13.5, carbs: 5.4, fat: 3, fiber: 0, water: 126 },
    micronutrients: { ironMg: 0.06, calciumMg: 132, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.45, vitaminKMcg: 0, folateMcg: 12, vitaminAMcg: 34.5, vitaminEMg: 0.06, potassiumMg: 180, sodiumMg: 42, magnesiumMg: 12, zincMg: 0.6, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0.5, lycopeneMcg: 0, betaCaroteneMcg: 10, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 1e9, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'fermented', 'probiotic', 'post-workout', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'kefir', name: 'Kefir (low-fat)', shortName: 'Kefir', emoji: '🥛',
    category: 'dairy', servingSize: 250, servingSizeLabel: 'ml', calories: 133,
    macronutrients: { protein: 8.3, carbs: 17.5, fat: 2.5, fiber: 0, water: 220 },
    micronutrients: { ironMg: 0.05, calciumMg: 250, vitaminCMg: 0.5, vitaminDMcg: 1.25, vitaminBMcg: 0.5, vitaminKMcg: 0, folateMcg: 12, vitaminAMcg: 25, vitaminEMg: 0.03, potassiumMg: 350, sodiumMg: 62.5, magnesiumMg: 20, zincMg: 0.7, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 0.5, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 2e9, prebioticFiberG: 0 },
    tags: ['high-calcium', 'probiotic', 'fermented', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'skyr', name: 'Skyr (plain, fat-free)', shortName: 'Skyr', emoji: '🥣',
    category: 'dairy', servingSize: 150, servingSizeLabel: 'g', calories: 98,
    macronutrients: { protein: 16.5, carbs: 6, fat: 0.3, fiber: 0, water: 126 },
    micronutrients: { ironMg: 0.03, calciumMg: 187.5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.6, vitaminKMcg: 0, folateMcg: 9, vitaminAMcg: 6, vitaminEMg: 0, potassiumMg: 195, sodiumMg: 48, magnesiumMg: 15, zincMg: 0.75, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 1.5e9, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'fermented', 'very-low-fat', 'probiotic', 'gluten-free'], availability: 'uncommon', region: 'europe',
  },
  {
    id: 'cottage-cheese', name: 'Cottage Cheese (low-fat)', shortName: 'Cottage Cheese', emoji: '🥛',
    category: 'dairy', servingSize: 100, servingSizeLabel: 'g', calories: 72,
    macronutrients: { protein: 12, carbs: 2.7, fat: 1, fiber: 0, water: 82 },
    micronutrients: { ironMg: 0.07, calciumMg: 61, vitaminCMg: 0, vitaminDMcg: 0.1, vitaminBMcg: 0.17, vitaminKMcg: 0, folateMcg: 6, vitaminAMcg: 10, vitaminEMg: 0.02, potassiumMg: 84, sodiumMg: 330, magnesiumMg: 6, zincMg: 0.4, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0.3, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'fermented', 'high-sodium', 'post-workout', 'low-fat', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'mozzarella', name: 'Mozzarella Cheese', shortName: 'Mozzarella', emoji: '🧀',
    category: 'dairy', servingSize: 30, servingSizeLabel: 'g', calories: 85,
    macronutrients: { protein: 6.3, carbs: 0.6, fat: 6.5, fiber: 0, water: 16.5 },
    micronutrients: { ironMg: 0.03, calciumMg: 143, vitaminCMg: 0, vitaminDMcg: 0.06, vitaminBMcg: 0.03, vitaminKMcg: 0.6, folateMcg: 3, vitaminAMcg: 50, vitaminEMg: 0.09, potassiumMg: 19.5, sodiumMg: 130, magnesiumMg: 3.9, zincMg: 0.6, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 1.8, lycopeneMcg: 0, betaCaroteneMcg: 20, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'fermented', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'parmesan', name: 'Parmesan Cheese (grated)', shortName: 'Parmesan', emoji: '🧀',
    category: 'dairy', servingSize: 30, servingSizeLabel: 'g', calories: 122,
    macronutrients: { protein: 10.8, carbs: 1, fat: 8.5, fiber: 0, water: 8.4 },
    micronutrients: { ironMg: 0.3, calciumMg: 336, vitaminCMg: 0, vitaminDMcg: 0.3, vitaminBMcg: 0.12, vitaminKMcg: 0.6, folateMcg: 1.5, vitaminAMcg: 75, vitaminEMg: 0.15, potassiumMg: 36, sodiumMg: 450, magnesiumMg: 12, zincMg: 1, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 2.5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'fermented', 'high-sodium', 'high-saturated-fat', 'gluten-free'], availability: 'common', region: 'europe',
  },
  {
    id: 'feta', name: 'Feta Cheese', shortName: 'Feta', emoji: '🧀',
    category: 'dairy', servingSize: 30, servingSizeLabel: 'g', calories: 79,
    macronutrients: { protein: 4.2, carbs: 1.2, fat: 6.2, fiber: 0, water: 16 },
    micronutrients: { ironMg: 0.2, calciumMg: 140, vitaminCMg: 0, vitaminDMcg: 0.2, vitaminBMcg: 0.3, vitaminKMcg: 0.3, folateMcg: 3, vitaminAMcg: 60, vitaminEMg: 0.2, potassiumMg: 18, sodiumMg: 316, magnesiumMg: 4, zincMg: 0.7, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'high-sodium', 'high-saturated-fat', 'gluten-free'], availability: 'common', region: 'europe',
  },

  // ============================================
  // 3. GRAINS & STARCHES (8)
  // ============================================
  {
    id: 'rice', name: 'White Rice (cooked)', shortName: 'Rice', emoji: '🍚',
    category: 'grains', servingSize: 150, servingSizeLabel: 'g', calories: 195,
    macronutrients: { protein: 4.1, carbs: 42, fat: 0.5, fiber: 0.6, water: 105 },
    micronutrients: { ironMg: 0.59, calciumMg: 12, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 3, vitaminAMcg: 0, vitaminEMg: 0.04, potassiumMg: 55.5, sodiumMg: 3, magnesiumMg: 15, zincMg: 0.74, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0.2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['fast-carbs', 'vegan', 'gluten-free'], availability: 'common', region: 'asia',
  },
  {
    id: 'wheat-bread', name: 'Whole Wheat Bread', shortName: 'Wheat Bread', emoji: '🍞',
    category: 'grains', servingSize: 30, servingSizeLabel: 'g', calories: 80,
    macronutrients: { protein: 2.7, carbs: 14.7, fat: 1, fiber: 0.8, water: 10.2 },
    micronutrients: { ironMg: 0.81, calciumMg: 24, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.06, vitaminKMcg: 0.3, folateMcg: 6, vitaminAMcg: 0, vitaminEMg: 0.18, potassiumMg: 81, sodiumMg: 144, magnesiumMg: 18.6, zincMg: 0.57, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 0.2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['fast-carbs', 'high-fiber', 'vegan'], availability: 'common', region: 'global',
  },
  {
    id: 'pasta', name: 'Pasta (cooked)', shortName: 'Pasta', emoji: '🍝',
    category: 'grains', servingSize: 150, servingSizeLabel: 'g', calories: 197,
    macronutrients: { protein: 7.5, carbs: 37.5, fat: 1.7, fiber: 2.7, water: 102 },
    micronutrients: { ironMg: 1.2, calciumMg: 12, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.15, vitaminKMcg: 0, folateMcg: 6, vitaminAMcg: 0, vitaminEMg: 0.09, potassiumMg: 66, sodiumMg: 1.5, magnesiumMg: 27, zincMg: 0.9, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0.2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['fast-carbs', 'high-fiber', 'vegan'], availability: 'common', region: 'europe',
  },
  {
    id: 'oats', name: 'Oats (rolled, dry)', shortName: 'Oats', emoji: '🥣',
    category: 'grains', servingSize: 40, servingSizeLabel: 'g', calories: 156,
    macronutrients: { protein: 6.8, carbs: 26.4, fat: 2.8, fiber: 4.2, water: 5.6 },
    micronutrients: { ironMg: 2.16, calciumMg: 21.6, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.04, vitaminKMcg: 0, folateMcg: 6, vitaminAMcg: 0, vitaminEMg: 0.36, potassiumMg: 174, sodiumMg: 2.4, magnesiumMg: 55.6, zincMg: 1.52, omega3Mg: 0, omega6Mg: 60, oleicAcidG: 0.6, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 2 },
    tags: ['slow-carbs', 'high-fiber', 'high-iron', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'potatoes', name: 'Potato (boiled, with skin)', shortName: 'Potatoes', emoji: '🥔',
    category: 'grains', servingSize: 150, servingSizeLabel: 'g', calories: 131,
    macronutrients: { protein: 2.9, carbs: 30, fat: 0.2, fiber: 2.7, water: 112.5 },
    micronutrients: { ironMg: 0.45, calciumMg: 15, vitaminCMg: 12, vitaminDMcg: 0, vitaminBMcg: 0.15, vitaminKMcg: 0.3, folateMcg: 15, vitaminAMcg: 0, vitaminEMg: 0.03, potassiumMg: 600, sodiumMg: 7.5, magnesiumMg: 28.5, zincMg: 0.45, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0.5 },
    tags: ['slow-carbs', 'high-potassium', 'high-vitaminC', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'buckwheat', name: 'Buckwheat (cooked)', shortName: 'Buckwheat', emoji: '🥣',
    category: 'grains', servingSize: 150, servingSizeLabel: 'g', calories: 138,
    macronutrients: { protein: 5.1, carbs: 30, fat: 0.9, fiber: 1.5, water: 111 },
    micronutrients: { ironMg: 1.05, calciumMg: 12, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.06, vitaminKMcg: 0, folateMcg: 12, vitaminAMcg: 0, vitaminEMg: 0.21, potassiumMg: 148.5, sodiumMg: 3, magnesiumMg: 67.5, zincMg: 0.9, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0.2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['slow-carbs', 'high-magnesium', 'vegan', 'gluten-free'], availability: 'common', region: 'europe',
  },
  {
    id: 'rye-bread', name: 'Rye Bread', shortName: 'Rye Bread', emoji: '🍞',
    category: 'grains', servingSize: 30, servingSizeLabel: 'g', calories: 75,
    macronutrients: { protein: 2.6, carbs: 14.4, fat: 0.3, fiber: 1.7, water: 11.1 },
    micronutrients: { ironMg: 0.87, calciumMg: 15, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.03, vitaminKMcg: 0.3, folateMcg: 6, vitaminAMcg: 0, vitaminEMg: 0.12, potassiumMg: 87, sodiumMg: 156, magnesiumMg: 16.5, zincMg: 0.63, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0.1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['slow-carbs', 'high-fiber', 'vegan'], availability: 'common', region: 'europe',
  },
  {
    id: 'quinoa', name: 'Quinoa (cooked)', shortName: 'Quinoa', emoji: '🥣',
    category: 'grains', servingSize: 150, servingSizeLabel: 'g', calories: 222,
    macronutrients: { protein: 8, carbs: 39, fat: 3.5, fiber: 5, water: 108 },
    micronutrients: { ironMg: 2.8, calciumMg: 30, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.2, vitaminKMcg: 0, folateMcg: 78, vitaminAMcg: 0, vitaminEMg: 1.2, potassiumMg: 315, sodiumMg: 7.5, magnesiumMg: 120, zincMg: 1.5, omega3Mg: 30, omega6Mg: 300, oleicAcidG: 0.5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['slow-carbs', 'high-protein', 'complete-protein', 'high-fiber', 'high-iron', 'vegan', 'gluten-free'], availability: 'common', region: 'americas',
  },
  {
    id: 'corn', name: 'Sweet Corn (cooked)', shortName: 'Corn', emoji: '🌽',
    category: 'grains', servingSize: 100, servingSizeLabel: 'g', calories: 96,
    macronutrients: { protein: 3.4, carbs: 21, fat: 1.5, fiber: 2.4, water: 73 },
    micronutrients: { ironMg: 0.5, calciumMg: 2, vitaminCMg: 5.5, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0.3, folateMcg: 46, vitaminAMcg: 8, vitaminEMg: 0.1, potassiumMg: 218, sodiumMg: 1, magnesiumMg: 26, zincMg: 0.5, omega3Mg: 0, omega6Mg: 100, oleicAcidG: 0.2, lycopeneMcg: 0, betaCaroteneMcg: 50, luteinMcg: 200, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['fast-carbs', 'high-fiber', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },

  // ============================================
  // 4. VEGETABLES (8)
  // ============================================
  {
    id: 'tomato', name: 'Tomato (raw)', shortName: 'Tomato', emoji: '🍅',
    category: 'vegetables', servingSize: 120, servingSizeLabel: 'g', calories: 22,
    macronutrients: { protein: 1.1, carbs: 4.7, fat: 0.2, fiber: 1.4, water: 108 },
    micronutrients: { ironMg: 0.22, calciumMg: 14.4, vitaminCMg: 13.2, vitaminDMcg: 0, vitaminBMcg: 0.06, vitaminKMcg: 7.2, folateMcg: 12, vitaminAMcg: 58.8, vitaminEMg: 0.54, potassiumMg: 283.2, sodiumMg: 4.8, magnesiumMg: 15.6, zincMg: 0.18, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0, lycopeneMcg: 3000, betaCaroteneMcg: 300, luteinMcg: 100, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-vitaminC', 'hydrating', 'anti-inflammatory', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'cucumber', name: 'Cucumber (raw, with peel)', shortName: 'Cucumber', emoji: '🥒',
    category: 'vegetables', servingSize: 100, servingSizeLabel: 'g', calories: 15,
    macronutrients: { protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5, water: 95 },
    micronutrients: { ironMg: 0.28, calciumMg: 16, vitaminCMg: 2.8, vitaminDMcg: 0, vitaminBMcg: 0.04, vitaminKMcg: 16.4, folateMcg: 7, vitaminAMcg: 5, vitaminEMg: 0.08, potassiumMg: 147, sodiumMg: 2, magnesiumMg: 13, zincMg: 0.2, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 10, luteinMcg: 20, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'hydrating', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'red-pepper', name: 'Red Bell Pepper (raw)', shortName: 'Red Pepper', emoji: '🫑',
    category: 'vegetables', servingSize: 120, servingSizeLabel: 'g', calories: 31,
    macronutrients: { protein: 1.2, carbs: 7.2, fat: 0.4, fiber: 2.5, water: 108 },
    micronutrients: { ironMg: 0.36, calciumMg: 9.6, vitaminCMg: 152.4, vitaminDMcg: 0, vitaminBMcg: 0.06, vitaminKMcg: 4.8, folateMcg: 12, vitaminAMcg: 93.6, vitaminEMg: 1.32, potassiumMg: 250.8, sodiumMg: 3.6, magnesiumMg: 14.4, zincMg: 0.24, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 2000, luteinMcg: 500, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-vitaminC', 'high-vitaminA', 'anti-inflammatory', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'spinach', name: 'Spinach (raw)', shortName: 'Spinach', emoji: '🥬',
    category: 'vegetables', servingSize: 80, servingSizeLabel: 'g', calories: 18,
    macronutrients: { protein: 2.3, carbs: 2.9, fat: 0.3, fiber: 1.8, water: 72.8 },
    micronutrients: { ironMg: 1.84, calciumMg: 59.2, vitaminCMg: 14.4, vitaminDMcg: 0, vitaminBMcg: 0.14, vitaminKMcg: 145, folateMcg: 140, vitaminAMcg: 374.4, vitaminEMg: 1.34, potassiumMg: 334.4, sodiumMg: 47.2, magnesiumMg: 59.2, zincMg: 0.38, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 5000, luteinMcg: 6000, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-iron', 'high-potassium', 'high-magnesium', 'high-vitaminA', 'high-calcium', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'carrot', name: 'Carrot (raw)', shortName: 'Carrot', emoji: '🥕',
    category: 'vegetables', servingSize: 60, servingSizeLabel: 'g', calories: 25,
    macronutrients: { protein: 0.5, carbs: 6, fat: 0.1, fiber: 1.7, water: 52.2 },
    micronutrients: { ironMg: 0.18, calciumMg: 19.2, vitaminCMg: 3.6, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 6.6, folateMcg: 6, vitaminAMcg: 505.2, vitaminEMg: 0.38, potassiumMg: 195, sodiumMg: 33, magnesiumMg: 7.8, zincMg: 0.12, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 10000, luteinMcg: 200, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0.5 },
    tags: ['low-calorie', 'high-vitaminA', 'high-fiber', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'broccoli', name: 'Broccoli (raw)', shortName: 'Broccoli', emoji: '🥦',
    category: 'vegetables', servingSize: 90, servingSizeLabel: 'g', calories: 31,
    macronutrients: { protein: 2.5, carbs: 6.3, fat: 0.4, fiber: 2.3, water: 79.2 },
    micronutrients: { ironMg: 0.54, calciumMg: 34.2, vitaminCMg: 60.3, vitaminDMcg: 0, vitaminBMcg: 0.54, vitaminKMcg: 77, folateMcg: 40, vitaminAMcg: 18, vitaminEMg: 0.59, potassiumMg: 254.7, sodiumMg: 24.3, magnesiumMg: 16.2, zincMg: 0.45, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 30, luteinMcg: 1000, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-vitaminC', 'high-fiber', 'anti-inflammatory', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'onion', name: 'Onion (raw)', shortName: 'Onion', emoji: '🧅',
    category: 'vegetables', servingSize: 50, servingSizeLabel: 'g', calories: 20,
    macronutrients: { protein: 0.6, carbs: 4.5, fat: 0.1, fiber: 0.9, water: 44 },
    micronutrients: { ironMg: 0.1, calciumMg: 11.5, vitaminCMg: 4.5, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0.2, folateMcg: 4, vitaminAMcg: 1, vitaminEMg: 0.01, potassiumMg: 80.5, sodiumMg: 2, magnesiumMg: 5, zincMg: 0.1, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 2 },
    tags: ['low-calorie', 'high-vitaminC', 'anti-inflammatory', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'mushrooms', name: 'Mushrooms (raw)', shortName: 'Mushrooms', emoji: '🍄',
    category: 'vegetables', servingSize: 100, servingSizeLabel: 'g', calories: 22,
    macronutrients: { protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1, water: 92 },
    micronutrients: { ironMg: 0.5, calciumMg: 3, vitaminCMg: 2, vitaminDMcg: 1, vitaminBMcg: 0.1, vitaminKMcg: 0, folateMcg: 17, vitaminAMcg: 0, vitaminEMg: 0.01, potassiumMg: 318, sodiumMg: 5, magnesiumMg: 9, zincMg: 0.5, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-vitaminD', 'high-potassium', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },
  {
    id: 'zucchini', name: 'Zucchini (raw)', shortName: 'Zucchini', emoji: '🥒',
    category: 'vegetables', servingSize: 120, servingSizeLabel: 'g', calories: 20,
    macronutrients: { protein: 1.5, carbs: 3.6, fat: 0.4, fiber: 1.2, water: 114 },
    micronutrients: { ironMg: 0.4, calciumMg: 16, vitaminCMg: 21, vitaminDMcg: 0, vitaminBMcg: 0.2, vitaminKMcg: 6, folateMcg: 28, vitaminAMcg: 24, vitaminEMg: 0.1, potassiumMg: 324, sodiumMg: 12, magnesiumMg: 22, zincMg: 0.3, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 50, luteinMcg: 200, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'hydrating', 'vegan', 'gluten-free', 'vegetable'], availability: 'common', region: 'global',
  },

  // ============================================
  // 5. FRUITS & BERRIES (8)
  // ============================================
  {
    id: 'apple', name: 'Apple (with skin)', shortName: 'Apple', emoji: '🍎',
    category: 'fruits', servingSize: 180, servingSizeLabel: 'g', calories: 94,
    macronutrients: { protein: 0.5, carbs: 25.2, fat: 0.4, fiber: 4.3, water: 151.2 },
    micronutrients: { ironMg: 0.18, calciumMg: 9, vitaminCMg: 7.2, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 2.7, folateMcg: 3, vitaminAMcg: 54, vitaminEMg: 0.29, potassiumMg: 180, sodiumMg: 1.8, magnesiumMg: 7.2, zincMg: 0.05, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 30, luteinMcg: 20, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0.5 },
    tags: ['high-fiber', 'hydrating', 'snack', 'anti-inflammatory', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'orange', name: 'Orange (raw)', shortName: 'Orange', emoji: '🍊',
    category: 'fruits', servingSize: 130, servingSizeLabel: 'g', calories: 61,
    macronutrients: { protein: 1.2, carbs: 15.6, fat: 0.1, fiber: 3.1, water: 112.7 },
    micronutrients: { ironMg: 0.1, calciumMg: 46.8, vitaminCMg: 58.5, vitaminDMcg: 0, vitaminBMcg: 0.26, vitaminKMcg: 0, folateMcg: 20, vitaminAMcg: 19.5, vitaminEMg: 0.13, potassiumMg: 237.9, sodiumMg: 0, magnesiumMg: 10.4, zincMg: 0.13, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 30, luteinMcg: 20, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-vitaminC', 'hydrating', 'snack', 'anti-inflammatory', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'banana', name: 'Banana', shortName: 'Banana', emoji: '🍌',
    category: 'fruits', servingSize: 120, servingSizeLabel: 'g', calories: 107,
    macronutrients: { protein: 1.3, carbs: 27.6, fat: 0.4, fiber: 3.1, water: 87.6 },
    micronutrients: { ironMg: 0.22, calciumMg: 6, vitaminCMg: 8.4, vitaminDMcg: 0, vitaminBMcg: 0.12, vitaminKMcg: 0.6, folateMcg: 15, vitaminAMcg: 5.4, vitaminEMg: 0.08, potassiumMg: 358.8, sodiumMg: 1.2, magnesiumMg: 28.8, zincMg: 0.14, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 15, luteinMcg: 10, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 1 },
    tags: ['high-potassium', 'fast-carbs', 'snack', 'post-workout', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'strawberries', name: 'Strawberries (raw)', shortName: 'Strawberries', emoji: '🍓',
    category: 'fruits', servingSize: 150, servingSizeLabel: 'g', calories: 48,
    macronutrients: { protein: 1.1, carbs: 11.6, fat: 0.5, fiber: 3, water: 136.5 },
    micronutrients: { ironMg: 0.54, calciumMg: 18, vitaminCMg: 67.5, vitaminDMcg: 0, vitaminBMcg: 0.06, vitaminKMcg: 1.5, folateMcg: 15, vitaminAMcg: 1.5, vitaminEMg: 0.33, potassiumMg: 178.5, sodiumMg: 1.5, magnesiumMg: 12, zincMg: 0.21, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 10, anthocyaninsMg: 30, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-vitaminC', 'high-antioxidants', 'snack', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'blueberries', name: 'Blueberries (raw)', shortName: 'Blueberries', emoji: '🫐',
    category: 'fruits', servingSize: 150, servingSizeLabel: 'g', calories: 86,
    macronutrients: { protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, water: 123 },
    micronutrients: { ironMg: 0.24, calciumMg: 6, vitaminCMg: 9.6, vitaminDMcg: 0, vitaminBMcg: 0.15, vitaminKMcg: 19, folateMcg: 6, vitaminAMcg: 3, vitaminEMg: 0.57, potassiumMg: 85.5, sodiumMg: 1.5, magnesiumMg: 6, zincMg: 0.12, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 15, luteinMcg: 50, anthocyaninsMg: 200, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-antioxidants', 'anti-inflammatory', 'snack', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'kiwi', name: 'Kiwi (raw)', shortName: 'Kiwi', emoji: '🥝',
    category: 'fruits', servingSize: 75, servingSizeLabel: 'g', calories: 46,
    macronutrients: { protein: 0.8, carbs: 11.3, fat: 0.4, fiber: 2.3, water: 60 },
    micronutrients: { ironMg: 0.14, calciumMg: 15, vitaminCMg: 50.3, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 2.7, folateMcg: 15, vitaminAMcg: 3.8, vitaminEMg: 0.75, potassiumMg: 150, sodiumMg: 1.5, magnesiumMg: 8.3, zincMg: 0.07, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 10, luteinMcg: 50, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-vitaminC', 'high-fiber', 'snack', 'anti-inflammatory', 'vegan', 'gluten-free', 'low-calorie'], availability: 'common', region: 'global',
  },
  {
    id: 'grapes', name: 'Grapes (raw)', shortName: 'Grapes', emoji: '🍇',
    category: 'fruits', servingSize: 150, servingSizeLabel: 'g', calories: 104,
    macronutrients: { protein: 1.1, carbs: 27, fat: 0.3, fiber: 1.4, water: 118.5 },
    micronutrients: { ironMg: 0.36, calciumMg: 10.5, vitaminCMg: 6.6, vitaminDMcg: 0, vitaminBMcg: 0.06, vitaminKMcg: 1.5, folateMcg: 3, vitaminAMcg: 4.5, vitaminEMg: 0.45, potassiumMg: 193.5, sodiumMg: 1.5, magnesiumMg: 7.5, zincMg: 0.06, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 15, luteinMcg: 20, anthocyaninsMg: 50, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['hydrating', 'high-antioxidants', 'snack', 'high-sugar', 'fast-carbs', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'avocado', name: 'Avocado (raw)', shortName: 'Avocado', emoji: '🥑',
    category: 'fruits', servingSize: 100, servingSizeLabel: 'g', calories: 160,
    macronutrients: { protein: 2, carbs: 9, fat: 15, fiber: 7, water: 73 },
    micronutrients: { ironMg: 0.6, calciumMg: 12, vitaminCMg: 10, vitaminDMcg: 0, vitaminBMcg: 0.2, vitaminKMcg: 21, folateMcg: 81, vitaminAMcg: 7, vitaminEMg: 2.1, potassiumMg: 485, sodiumMg: 7, magnesiumMg: 29, zincMg: 0.6, omega3Mg: 110, omega6Mg: 1689, oleicAcidG: 9, lycopeneMcg: 0, betaCaroteneMcg: 62, luteinMcg: 369, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'high-fiber', 'high-fat', 'high-potassium', 'anti-inflammatory', 'vegan', 'gluten-free'], availability: 'common', region: 'americas',
  },
  {
    id: 'lemon', name: 'Lemon (raw)', shortName: 'Lemon', emoji: '🍋',
    category: 'fruits', servingSize: 60, servingSizeLabel: 'g', calories: 17,
    macronutrients: { protein: 0.6, carbs: 5.4, fat: 0.2, fiber: 1.6, water: 54 },
    micronutrients: { ironMg: 0.4, calciumMg: 12, vitaminCMg: 34.4, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0.1, folateMcg: 11, vitaminAMcg: 2, vitaminEMg: 0.1, potassiumMg: 102, sodiumMg: 1, magnesiumMg: 6, zincMg: 0.1, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 1, luteinMcg: 10, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'high-vitaminC', 'snack', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },

  // ============================================
  // 6. LEGUMES & NUTS (8)
  // ============================================
  {
    id: 'lentils', name: 'Lentils (cooked)', shortName: 'Lentils', emoji: '🥣',
    category: 'nuts-legumes', servingSize: 150, servingSizeLabel: 'g', calories: 174,
    macronutrients: { protein: 13.5, carbs: 30, fat: 0.6, fiber: 11.9, water: 103.5 },
    micronutrients: { ironMg: 4.95, calciumMg: 28.5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.15, vitaminKMcg: 0, folateMcg: 180, vitaminAMcg: 1.5, vitaminEMg: 0.15, potassiumMg: 553.5, sodiumMg: 3, magnesiumMg: 54, zincMg: 1.91, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0.1, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 2 },
    tags: ['high-fiber', 'high-protein', 'high-iron', 'high-magnesium', 'slow-carbs', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'beans', name: 'Beans (cooked, common)', shortName: 'Beans', emoji: '🫘',
    category: 'nuts-legumes', servingSize: 150, servingSizeLabel: 'g', calories: 191,
    macronutrients: { protein: 13.1, carbs: 34.2, fat: 0.8, fiber: 9.6, water: 99 },
    micronutrients: { ironMg: 3.15, calciumMg: 52.5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.15, vitaminKMcg: 3, folateMcg: 150, vitaminAMcg: 0, vitaminEMg: 0.15, potassiumMg: 534, sodiumMg: 1.5, magnesiumMg: 64.5, zincMg: 1.5, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0.1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 2 },
    tags: ['high-fiber', 'high-protein', 'high-magnesium', 'slow-carbs', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'chickpeas', name: 'Chickpeas (cooked)', shortName: 'Chickpeas', emoji: '🧆',
    category: 'nuts-legumes', servingSize: 150, servingSizeLabel: 'g', calories: 246,
    macronutrients: { protein: 13.4, carbs: 41.1, fat: 3.9, fiber: 11.4, water: 90 },
    micronutrients: { ironMg: 4.34, calciumMg: 73.5, vitaminCMg: 1.95, vitaminDMcg: 0, vitaminBMcg: 0.12, vitaminKMcg: 3, folateMcg: 150, vitaminAMcg: 1.5, vitaminEMg: 0.87, potassiumMg: 436.5, sodiumMg: 10.5, magnesiumMg: 72, zincMg: 2.3, omega3Mg: 0, omega6Mg: 50, oleicAcidG: 0.5, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 2 },
    tags: ['high-fiber', 'high-protein', 'high-magnesium', 'slow-carbs', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'peas', name: 'Green Peas (cooked)', shortName: 'Peas', emoji: '🟢',
    category: 'nuts-legumes', servingSize: 80, servingSizeLabel: 'g', calories: 65,
    macronutrients: { protein: 4.3, carbs: 11.6, fat: 0.3, fiber: 4.1, water: 62.4 },
    micronutrients: { ironMg: 1.2, calciumMg: 20, vitaminCMg: 0.56, vitaminDMcg: 0, vitaminBMcg: 0.08, vitaminKMcg: 12, folateMcg: 32, vitaminAMcg: 30.4, vitaminEMg: 0.08, potassiumMg: 195.2, sodiumMg: 4, magnesiumMg: 24, zincMg: 0.99, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 200, luteinMcg: 1000, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 1 },
    tags: ['high-fiber', 'vegetable', 'vegan', 'gluten-free', 'slow-carbs'], availability: 'common', region: 'global',
  },
  {
    id: 'walnuts', name: 'Walnuts', shortName: 'Walnuts', emoji: '🌰',
    category: 'nuts-legumes', servingSize: 30, servingSizeLabel: 'g', calories: 196,
    macronutrients: { protein: 4.5, carbs: 4.2, fat: 19.5, fiber: 2, water: 1.2 },
    micronutrients: { ironMg: 0.87, calciumMg: 29.4, vitaminCMg: 0.39, vitaminDMcg: 0, vitaminBMcg: 0.05, vitaminKMcg: 0.6, folateMcg: 9, vitaminAMcg: 0.3, vitaminEMg: 0.21, potassiumMg: 132.3, sodiumMg: 0.6, magnesiumMg: 47.4, zincMg: 0.93, omega3Mg: 270, omega6Mg: 10000, oleicAcidG: 2.5, lycopeneMcg: 0, betaCaroteneMcg: 3, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'high-omega3', 'snack', 'high-fat', 'high-magnesium', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'almonds', name: 'Almonds', shortName: 'Almonds', emoji: '🥜',
    category: 'nuts-legumes', servingSize: 30, servingSizeLabel: 'g', calories: 174,
    macronutrients: { protein: 6.3, carbs: 6.6, fat: 15, fiber: 3.8, water: 1.2 },
    micronutrients: { ironMg: 1.11, calciumMg: 80.7, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.07, vitaminKMcg: 0, folateMcg: 9, vitaminAMcg: 0, vitaminEMg: 7.69, potassiumMg: 219.9, sodiumMg: 0.3, magnesiumMg: 81, zincMg: 0.94, omega3Mg: 0, omega6Mg: 3500, oleicAcidG: 7, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'high-vitaminE', 'high-fat', 'snack', 'high-calcium', 'high-magnesium', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'seeds', name: 'Mixed Seeds (sunflower, pumpkin)', shortName: 'Seeds', emoji: '🌻',
    category: 'nuts-legumes', servingSize: 30, servingSizeLabel: 'g', calories: 172,
    macronutrients: { protein: 6.3, carbs: 6, fat: 14.7, fiber: 2.6, water: 1.5 },
    micronutrients: { ironMg: 1.92, calciumMg: 23.4, vitaminCMg: 0.45, vitaminDMcg: 0, vitaminBMcg: 0.27, vitaminKMcg: 0, folateMcg: 15, vitaminAMcg: 0.9, vitaminEMg: 10.55, potassiumMg: 193.5, sodiumMg: 2.7, magnesiumMg: 133.8, zincMg: 2.1, omega3Mg: 50, omega6Mg: 3000, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'high-magnesium', 'snack', 'high-fat', 'high-vitaminE', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'tofu', name: 'Tofu (firm, calcium-set)', shortName: 'Tofu', emoji: '🧊',
    category: 'nuts-legumes', servingSize: 100, servingSizeLabel: 'g', calories: 144,
    macronutrients: { protein: 17, carbs: 3, fat: 9, fiber: 2, water: 68 },
    micronutrients: { ironMg: 2.7, calciumMg: 350, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 15, vitaminAMcg: 0, vitaminEMg: 0.3, potassiumMg: 150, sodiumMg: 7, magnesiumMg: 30, zincMg: 1.5, omega3Mg: 400, omega6Mg: 2000, oleicAcidG: 1.5, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'complete-protein', 'high-iron', 'vegan', 'gluten-free'], availability: 'common', region: 'asia',
  },
  {
    id: 'cashews', name: 'Cashews (raw)', shortName: 'Cashews', emoji: '🥜',
    category: 'nuts-legumes', servingSize: 30, servingSizeLabel: 'g', calories: 157,
    macronutrients: { protein: 5, carbs: 8.5, fat: 12.5, fiber: 1, water: 1.5 },
    micronutrients: { ironMg: 1.7, calciumMg: 15, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.1, vitaminKMcg: 2, folateMcg: 7, vitaminAMcg: 0, vitaminEMg: 0.3, potassiumMg: 190, sodiumMg: 3, magnesiumMg: 83, zincMg: 1.6, omega3Mg: 0, omega6Mg: 2000, oleicAcidG: 6, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'high-fat', 'high-magnesium', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },

  // ============================================
  // 7. SNACKS & SWEETS (8)
  // ============================================
  {
    id: 'dark-chocolate', name: 'Dark Chocolate (70%)', shortName: 'Dark Chocolate', emoji: '🍫',
    category: 'snacks', servingSize: 30, servingSizeLabel: 'g', calories: 170,
    macronutrients: { protein: 2.2, carbs: 13, fat: 12, fiber: 3, water: 0.5 },
    micronutrients: { ironMg: 3.4, calciumMg: 30, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 3, vitaminAMcg: 0, vitaminEMg: 0.3, potassiumMg: 200, sodiumMg: 3, magnesiumMg: 40, zincMg: 0.8, omega3Mg: 0, omega6Mg: 20, oleicAcidG: 4, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'high-fat', 'snack', 'anti-inflammatory', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'popcorn', name: 'Popcorn (air-popped)', shortName: 'Popcorn', emoji: '🍿',
    category: 'snacks', servingSize: 30, servingSizeLabel: 'g', calories: 116,
    macronutrients: { protein: 3.9, carbs: 23.4, fat: 1.4, fiber: 4.5, water: 2.1 },
    micronutrients: { ironMg: 0.57, calciumMg: 4.5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 3, vitaminAMcg: 1.5, vitaminEMg: 0.21, potassiumMg: 81, sodiumMg: 1.2, magnesiumMg: 33.6, zincMg: 0.63, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 0.3, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-fiber', 'low-calorie', 'snack', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'granola-bar', name: 'Granola Bar (with oats & honey)', shortName: 'Granola Bar', emoji: '🍫',
    category: 'snacks', servingSize: 40, servingSizeLabel: 'g', calories: 188,
    macronutrients: { protein: 4, carbs: 25.6, fat: 8, fiber: 2.4, water: 3.2 },
    micronutrients: { ironMg: 1.04, calciumMg: 32, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.08, vitaminKMcg: 0, folateMcg: 3, vitaminAMcg: 0, vitaminEMg: 0.44, potassiumMg: 136, sodiumMg: 68, magnesiumMg: 24, zincMg: 0.88, omega3Mg: 0, omega6Mg: 200, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'fast-carbs', 'snack'], availability: 'common', region: 'global',
  },
  {
    id: 'dried-fruits', name: 'Dried Mixed Fruits', shortName: 'Dried Fruits', emoji: '🥣',
    category: 'snacks', servingSize: 30, servingSizeLabel: 'g', calories: 102,
    macronutrients: { protein: 1.1, carbs: 24, fat: 0.3, fiber: 2.1, water: 6.6 },
    micronutrients: { ironMg: 0.78, calciumMg: 24, vitaminCMg: 0.6, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0.6, folateMcg: 2, vitaminAMcg: 6, vitaminEMg: 0.42, potassiumMg: 345, sodiumMg: 4.5, magnesiumMg: 21, zincMg: 0.21, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 10, luteinMcg: 0, anthocyaninsMg: 5, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'high-fiber', 'fast-carbs', 'high-potassium', 'snack', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'cake', name: 'Sponge Cake (with icing)', shortName: 'Cake', emoji: '🍰',
    category: 'snacks', servingSize: 80, servingSizeLabel: 'g', calories: 278,
    macronutrients: { protein: 3.5, carbs: 45.6, fat: 8.8, fiber: 0.2, water: 21.6 },
    micronutrients: { ironMg: 0.72, calciumMg: 48, vitaminCMg: 0.16, vitaminDMcg: 0.4, vitaminBMcg: 0.06, vitaminKMcg: 0, folateMcg: 6, vitaminAMcg: 56.8, vitaminEMg: 0.88, potassiumMg: 52.8, sodiumMg: 220.8, magnesiumMg: 7.2, zincMg: 0.32, omega3Mg: 0, omega6Mg: 30, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'high-saturated-fat', 'fast-carbs', 'empty-calories', 'snack'], availability: 'common', region: 'global',
  },
  {
    id: 'ice-cream', name: 'Vanilla Ice Cream', shortName: 'Ice Cream', emoji: '🍦',
    category: 'snacks', servingSize: 100, servingSizeLabel: 'g', calories: 207,
    macronutrients: { protein: 3.5, carbs: 24, fat: 11, fiber: 0.7, water: 60 },
    micronutrients: { ironMg: 0.09, calciumMg: 128, vitaminCMg: 0.6, vitaminDMcg: 0.6, vitaminBMcg: 0.24, vitaminKMcg: 0.3, folateMcg: 6, vitaminAMcg: 81, vitaminEMg: 0.15, potassiumMg: 199, sodiumMg: 80, magnesiumMg: 14, zincMg: 0.44, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 3, lycopeneMcg: 0, betaCaroteneMcg: 20, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'high-saturated-fat', 'empty-calories', 'fast-carbs', 'high-calcium', 'snack', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'potato-chips', name: 'Potato Chips (salted)', shortName: 'Chips', emoji: '🍟',
    category: 'snacks', servingSize: 30, servingSizeLabel: 'g', calories: 161,
    macronutrients: { protein: 2.1, carbs: 15.9, fat: 10.5, fiber: 1, water: 1.2 },
    micronutrients: { ironMg: 0.27, calciumMg: 6, vitaminCMg: 4.8, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 1.23, potassiumMg: 285, sodiumMg: 135, magnesiumMg: 12, zincMg: 0.24, omega3Mg: 0, omega6Mg: 200, oleicAcidG: 1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sodium', 'high-fat', 'fast-carbs', 'empty-calories', 'snack', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'protein-bar', name: 'Protein Bar (chocolate)', shortName: 'Protein Bar', emoji: '🍫',
    category: 'snacks', servingSize: 40, servingSizeLabel: 'g', calories: 180,
    macronutrients: { protein: 20, carbs: 16, fat: 5, fiber: 1, water: 2 },
    micronutrients: { ironMg: 1.8, calciumMg: 80, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 1, potassiumMg: 120, sodiumMg: 160, magnesiumMg: 40, zincMg: 2, omega3Mg: 0, omega6Mg: 50, oleicAcidG: 1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-sugar', 'snack', 'post-workout'], availability: 'common', region: 'global',
  },
  {
    id: 'croissant', name: 'Butter Croissant', shortName: 'Croissant', emoji: '🥐',
    category: 'snacks', servingSize: 60, servingSizeLabel: 'g', calories: 272,
    macronutrients: { protein: 5.5, carbs: 31, fat: 14, fiber: 1.5, water: 12 },
    micronutrients: { ironMg: 1.5, calciumMg: 30, vitaminCMg: 0, vitaminDMcg: 0.2, vitaminBMcg: 0.2, vitaminKMcg: 2, folateMcg: 30, vitaminAMcg: 50, vitaminEMg: 0.5, potassiumMg: 60, sodiumMg: 270, magnesiumMg: 9, zincMg: 0.4, omega3Mg: 0, omega6Mg: 200, oleicAcidG: 4, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-fat', 'high-saturated-fat', 'fast-carbs', 'empty-calories', 'snack'], availability: 'common', region: 'europe',
  },

  // ============================================
  // 8. DRINKS (8)
  // ============================================
  {
    id: 'water', name: 'Water', shortName: 'Water', emoji: '💧',
    category: 'drinks', servingSize: 250, servingSizeLabel: 'ml', calories: 0,
    macronutrients: { protein: 0, carbs: 0, fat: 0, fiber: 0, water: 250 },
    micronutrients: { ironMg: 0, calciumMg: 0, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 0, sodiumMg: 0, magnesiumMg: 0, zincMg: 0, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['zero-calorie', 'hydrating', 'essential', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'soy-milk', name: 'Soy Milk (fortified)', shortName: 'Soy Milk', emoji: '🥛',
    category: 'drinks', servingSize: 250, servingSizeLabel: 'ml', calories: 130,
    macronutrients: { protein: 8, carbs: 4, fat: 4, fiber: 1, water: 230 },
    micronutrients: { ironMg: 1.2, calciumMg: 300, vitaminCMg: 0, vitaminDMcg: 2.5, vitaminBMcg: 0.5, vitaminKMcg: 3, folateMcg: 25, vitaminAMcg: 75, vitaminEMg: 1.2, potassiumMg: 300, sodiumMg: 115, magnesiumMg: 40, zincMg: 0.5, omega3Mg: 50, omega6Mg: 2000, oleicAcidG: 1, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-protein', 'high-calcium', 'high-vitaminD', 'vegan', 'gluten-free', 'fortified'], availability: 'common', region: 'global',
  },
  {
    id: 'green-tea', name: 'Green Tea (brewed)', shortName: 'Green Tea', emoji: '🍵',
    category: 'drinks', servingSize: 250, servingSizeLabel: 'ml', calories: 2,
    macronutrients: { protein: 0, carbs: 0.5, fat: 0, fiber: 0, water: 249.5 },
    micronutrients: { ironMg: 0, calciumMg: 2.5, vitaminCMg: 0.25, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 42.5, sodiumMg: 1.25, magnesiumMg: 3.75, zincMg: 0, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['zero-calorie', 'caffeine', 'anti-inflammatory', 'metabolism-boost', 'vegan', 'gluten-free', 'hydrating'], availability: 'common', region: 'asia',
  },
  {
    id: 'black-tea', name: 'Black Tea (brewed)', shortName: 'Black Tea', emoji: '🫖',
    category: 'drinks', servingSize: 250, servingSizeLabel: 'ml', calories: 2,
    macronutrients: { protein: 0, carbs: 0.5, fat: 0, fiber: 0, water: 249.5 },
    micronutrients: { ironMg: 0, calciumMg: 5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 45, sodiumMg: 2.5, magnesiumMg: 3.75, zincMg: 0, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['zero-calorie', 'caffeine', 'metabolism-boost', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'coffee', name: 'Black Coffee (brewed)', shortName: 'Coffee', emoji: '☕',
    category: 'drinks', servingSize: 250, servingSizeLabel: 'ml', calories: 2,
    macronutrients: { protein: 0.3, carbs: 0, fat: 0, fiber: 0, water: 249.7 },
    micronutrients: { ironMg: 0, calciumMg: 2.5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 92.5, sodiumMg: 2.5, magnesiumMg: 4.5, zincMg: 0.02, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['zero-calorie', 'caffeine', 'metabolism-boost', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'juice', name: 'Orange / Apple Juice', shortName: 'Fruit Juice', emoji: '🧃',
    category: 'drinks', servingSize: 200, servingSizeLabel: 'ml', calories: 90,
    macronutrients: { protein: 1.4, carbs: 20, fat: 0.2, fiber: 0.4, water: 178 },
    micronutrients: { ironMg: 0.2, calciumMg: 20, vitaminCMg: 46, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 15, vitaminAMcg: 10, vitaminEMg: 0.2, potassiumMg: 360, sodiumMg: 4, magnesiumMg: 16, zincMg: 0.1, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'fast-carbs', 'high-vitaminC', 'hydrating', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'soda', name: 'Cola Soda', shortName: 'Soda', emoji: '🥤',
    category: 'drinks', servingSize: 330, servingSizeLabel: 'ml', calories: 139,
    macronutrients: { protein: 0, carbs: 35, fat: 0, fiber: 0, water: 295 },
    micronutrients: { ironMg: 0, calciumMg: 6.6, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 6.6, sodiumMg: 23.1, magnesiumMg: 0, zincMg: 0, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'fast-carbs', 'empty-calories', 'caffeine', 'hydrating', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'sports-drink', name: 'Sports Drink (Isotonic)', shortName: 'Sports Drink', emoji: '🥤',
    category: 'drinks', servingSize: 330, servingSizeLabel: 'ml', calories: 80,
    macronutrients: { protein: 0, carbs: 21, fat: 0, fiber: 0, water: 305 },
    micronutrients: { ironMg: 0, calciumMg: 5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 50, sodiumMg: 250, magnesiumMg: 5, zincMg: 0, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'fast-carbs', 'empty-calories', 'high-sodium', 'hydrating', 'post-workout', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'beer', name: 'Beer (regular)', shortName: 'Beer', emoji: '🍺',
    category: 'drinks', servingSize: 330, servingSizeLabel: 'ml', calories: 140,
    macronutrients: { protein: 1.6, carbs: 12, fat: 0, fiber: 0, water: 315 },
    micronutrients: { ironMg: 0.1, calciumMg: 15, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0.2, vitaminKMcg: 0, folateMcg: 15, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 90, sodiumMg: 15, magnesiumMg: 18, zincMg: 0.1, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['empty-calories', 'fast-carbs', 'high-sugar', 'alcohol'], availability: 'common', region: 'global',
  },

  // ============================================
  // 9. FATS & SEASONINGS (8)
  // ============================================
  {
    id: 'olive-oil', name: 'Extra Virgin Olive Oil', shortName: 'Olive Oil', emoji: '🫒',
    category: 'seasonings-fats', servingSize: 15, servingSizeLabel: 'ml', calories: 119,
    macronutrients: { protein: 0, carbs: 0, fat: 14, fiber: 0, water: 0 },
    micronutrients: { ironMg: 0, calciumMg: 0, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 8.1, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 1.9, potassiumMg: 0, sodiumMg: 0, magnesiumMg: 0, zincMg: 0, omega3Mg: 0, omega6Mg: 1000, oleicAcidG: 10, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'anti-inflammatory', 'high-fat', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'butter', name: 'Butter (salted)', shortName: 'Butter', emoji: '🧈',
    category: 'seasonings-fats', servingSize: 10, servingSizeLabel: 'g', calories: 72,
    macronutrients: { protein: 0.1, carbs: 0, fat: 8.1, fiber: 0, water: 1.6 },
    micronutrients: { ironMg: 0, calciumMg: 2.4, vitaminCMg: 0, vitaminDMcg: 0.15, vitaminBMcg: 0, vitaminKMcg: 0.7, folateMcg: 0, vitaminAMcg: 68.4, vitaminEMg: 0.19, potassiumMg: 3.5, sodiumMg: 65, magnesiumMg: 0.2, zincMg: 0.01, omega3Mg: 0, omega6Mg: 10, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 5, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-fat', 'high-saturated-fat', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'salt', name: 'Table Salt', shortName: 'Salt', emoji: '🧂',
    category: 'seasonings-fats', servingSize: 1, servingSizeLabel: 'g', calories: 0,
    macronutrients: { protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0 },
    micronutrients: { ironMg: 0, calciumMg: 0, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 0, sodiumMg: 388, magnesiumMg: 0, zincMg: 0, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['zero-calorie', 'high-sodium', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'vinegar', name: 'Balsamic Vinegar', shortName: 'Vinegar', emoji: '🍶',
    category: 'seasonings-fats', servingSize: 15, servingSizeLabel: 'ml', calories: 21,
    macronutrients: { protein: 0.1, carbs: 4.5, fat: 0, fiber: 0, water: 10 },
    micronutrients: { ironMg: 0.1, calciumMg: 3, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 18, sodiumMg: 3, magnesiumMg: 0.6, zincMg: 0.01, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['low-calorie', 'vegan', 'fermented', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'honey', name: 'Honey', shortName: 'Honey', emoji: '🍯',
    category: 'seasonings-fats', servingSize: 15, servingSizeLabel: 'g', calories: 46,
    macronutrients: { protein: 0.1, carbs: 12, fat: 0, fiber: 0, water: 3 },
    micronutrients: { ironMg: 0.1, calciumMg: 1, vitaminCMg: 0.1, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 11, sodiumMg: 1, magnesiumMg: 0.1, zincMg: 0.1, omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-sugar', 'fast-carbs', 'anti-inflammatory', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'mayo', name: 'Mayonnaise', shortName: 'Mayo', emoji: '🥚',
    category: 'seasonings-fats', servingSize: 15, servingSizeLabel: 'g', calories: 94,
    macronutrients: { protein: 0.2, carbs: 0.1, fat: 10, fiber: 0, water: 4 },
    micronutrients: { ironMg: 0.1, calciumMg: 1.5, vitaminCMg: 0, vitaminDMcg: 0.15, vitaminBMcg: 0, vitaminKMcg: 5, folateMcg: 0, vitaminAMcg: 1.5, vitaminEMg: 0.5, potassiumMg: 1.5, sodiumMg: 90, magnesiumMg: 0.1, zincMg: 0, omega3Mg: 0, omega6Mg: 1500, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-fat', 'high-saturated-fat', 'high-sodium', 'high-omega6'], availability: 'common', region: 'global',
  },
  {
    id: 'soy-sauce', name: 'Soy Sauce', shortName: 'Soy Sauce', emoji: '🍶',
    category: 'seasonings-fats', servingSize: 15, servingSizeLabel: 'ml', calories: 8,
    macronutrients: { protein: 1, carbs: 1, fat: 0, fiber: 0, water: 12 },
    micronutrients: { ironMg: 0.1, calciumMg: 1.5, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0, potassiumMg: 20, sodiumMg: 900, magnesiumMg: 2, zincMg: 0.1, omega3Mg: 0, omega6Mg: 50, oleicAcidG: 0, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['zero-calorie', 'high-sodium', 'fermented', 'vegan'], availability: 'common', region: 'asia',
  },
  {
    id: 'sunflower-oil', name: 'Sunflower Oil', shortName: 'Sunflower Oil', emoji: '🌻',
    category: 'seasonings-fats', servingSize: 15, servingSizeLabel: 'ml', calories: 120,
    macronutrients: { protein: 0, carbs: 0, fat: 14, fiber: 0, water: 0 },
    micronutrients: { ironMg: 0, calciumMg: 0, vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0.5, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 5.6, potassiumMg: 0, sodiumMg: 0, magnesiumMg: 0, zincMg: 0, omega3Mg: 0, omega6Mg: 8000, oleicAcidG: 2, lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['high-fat', 'high-omega6', 'vegan', 'gluten-free'], availability: 'common', region: 'global',
  },
  {
    id: 'pesto', name: 'Pesto Sauce', shortName: 'Pesto', emoji: '🌿',
    category: 'seasonings-fats', servingSize: 30, servingSizeLabel: 'g', calories: 191,
    macronutrients: { protein: 4, carbs: 3, fat: 19, fiber: 1, water: 2 },
    micronutrients: { ironMg: 1, calciumMg: 70, vitaminCMg: 2, vitaminDMcg: 0, vitaminBMcg: 0.1, vitaminKMcg: 15, folateMcg: 10, vitaminAMcg: 50, vitaminEMg: 2, potassiumMg: 100, sodiumMg: 320, magnesiumMg: 20, zincMg: 0.5, omega3Mg: 50, omega6Mg: 1000, oleicAcidG: 10, lycopeneMcg: 0, betaCaroteneMcg: 100, luteinMcg: 500, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0 },
    tags: ['healthy-fats', 'high-fat', 'high-sodium', 'vegan', 'gluten-free'], availability: 'common', region: 'europe',
  },
];

// // ============================================
// 2. COMBOS
// ============================================
export type ComboPenalty = 'CRITICAL' | 'MODERATE' | 'MINOR';
export type ComboBonus = 'CRITICAL' | 'MODERATE' | 'MINOR';

export interface CoinBreakdown {
  base: number;
  variety: number;
  goodCombos: { id: string; label: string; amount: number }[];
  badCombos: { id: string; label: string; amount: number }[];
  thresholds: { id: string; label: string; amount: number }[];
  noHintBonus: number;
  total: number;
}

export const NO_HINT_BONUS = 5;

export interface BadCombo {
  id: string;
  shortLabel: string;
  requiredGroups: string[][];
  severity: ComboPenalty;
  coinsPenalty: number;
  message: string;
  explanation: string;
}

export interface GoodCombo {
  id: string;
  shortLabel: string;
  requiredGroups: string[][];
  severity: ComboBonus;
  coinsBonus: number;
  message: string;
  explanation: string;
}

export interface ThresholdViolation {
  id: string;
  label: string;
  penalty: number;
}

export const BAD_COMBOS: BadCombo[] = [
  {
    id: 'CitricAcidBlocksDairy',
    shortLabel: 'Citrus + Dairy',
    requiredGroups: [['orange', 'kiwi', 'strawberries', 'lemon'], ['milk', 'greek-yogurt', 'kefir']],
    severity: 'MODERATE', coinsPenalty: 15,
    message: '🥛🍊 Citric acid can interfere with liquid dairy digestion',
    explanation: 'Highly acidic fruits can curdle milk proteins in the stomach, potentially causing discomfort and slowing digestion.',
  },
  {
    id: 'OxalatesBlockCalcium',
    shortLabel: 'Spinach + Calcium',
    requiredGroups: [['spinach'], ['milk', 'cheese', 'mozzarella', 'greek-yogurt', 'cottage-cheese', 'skyr', 'kefir', 'tofu', 'soy-milk']],
    severity: 'MODERATE', coinsPenalty: 10,
    message: '🥬🥛 Spinach oxalates reduce calcium absorption',
    explanation: 'Oxalates in spinach strongly bind to calcium during digestion, preventing your body from absorbing it and rendering the calcium useless.',
  },
  {
    id: 'TanninsBlockIron',
    shortLabel: 'Tannins + Iron',
    requiredGroups: [['coffee', 'black-tea', 'green-tea'], ['beef', 'lentils', 'spinach', 'sardines', 'chickpeas', 'tofu', 'beans']],
    severity: 'MODERATE', coinsPenalty: 5,
    message: '☕🩸 Tannins reduce iron absorption',
    explanation: 'Tannins and polyphenols in tea and coffee bind to iron in your digestive tract, preventing it from entering your bloodstream.',
  },
  {
    id: 'ExcessSaturatedFat',
    shortLabel: 'Excess Saturated Fat',
    requiredGroups: [['butter', 'cheese', 'mozzarella', 'milk', 'pork', 'beef', 'mayo', 'croissant', 'feta']],
    severity: 'MINOR', coinsPenalty: 5,
    message: '🧈🥛 Too much saturated fat in one meal',
    explanation: 'Combining multiple high-saturated-fat foods slows down digestion, causes lethargy, and spikes cholesterol temporarily.',
  },
  {
    id: 'SugarConfusesSlowCarbs',
    shortLabel: 'Sugar + Slow Carbs',
    requiredGroups: [['honey', 'juice', 'soda', 'sports-drink', 'beer'], ['rice', 'pasta', 'potatoes', 'wheat-bread', 'oats', 'quinoa', 'corn']],
    severity: 'MINOR', coinsPenalty: 10,
    message: '🍬🍞 Mixing fast sugars with slow carbs causes insulin confusion',
    explanation: 'Adding pure sugars to complex carbohydrates spikes blood glucose too rapidly, negating the slow, steady energy benefits of complex carbs.',
  },
  {
    id: 'CaffeineOverload',
    shortLabel: 'Caffeine Overload',
    requiredGroups: [['coffee', 'black-tea', 'green-tea', 'soda']],
    severity: 'MINOR', coinsPenalty: 10,
    message: '☕🥤 Excessive caffeine intake in one meal',
    explanation: 'Combining multiple caffeinated drinks can lead to jitters, anxiety, and disrupted nutrient absorption.',
  },
  {
    id: 'SodiumOverload',
    shortLabel: 'Sodium Overload',
    requiredGroups: [['soy-sauce', 'salt'], ['cheese', 'parmesan', 'cottage-cheese', 'potato-chips', 'sports-drink', 'feta', 'canned-tuna', 'pesto', 'croissant']],
    severity: 'CRITICAL', coinsPenalty: 15,
    message: '🧂🥀 Extreme sodium concentration',
    explanation: 'Combining liquid/solid sodium sources with naturally salty dairy/processed foods pushes sodium levels dangerously high, dehydrating cells and spiking blood pressure.',
  },
  {
    id: 'LiquidSugarCrash',
    shortLabel: 'Liquid + Solid Sugar',
    requiredGroups: [['soda', 'sports-drink', 'juice'], ['cake', 'ice-cream', 'dark-chocolate', 'protein-bar']],
    severity: 'MODERATE', coinsPenalty: 10,
    message: '📉🥤 Liquid + solid sugar causes a massive crash',
    explanation: 'Drinking liquid sugar while eating solid sugar creates a massive insulin spike followed by a severe energy crash, stressing the pancreas.',
  },
  {
    id: 'CalciumCaffeineWash',
    shortLabel: 'Caffeine + Calcium',
    requiredGroups: [['coffee', 'black-tea', 'green-tea'], ['milk', 'cheese', 'greek-yogurt', 'tofu', 'soy-milk', 'mozzarella']],
    severity: 'MINOR', coinsPenalty: 5,
    message: '☕🥛 Caffeine slightly washes out calcium',
    explanation: 'High caffeine intake acts as a mild diuretic, causing the body to excrete a small amount of calcium before it can be fully absorbed by the bones.',
  },
  {
    id: 'FatSugarSpike',
    shortLabel: 'Fat + Sugar Spike',
    requiredGroups: [
      ['honey', 'juice', 'soda', 'sports-drink', 'cake', 'ice-cream', 'granola-bar', 'dried-fruits'],
      ['butter', 'cheese', 'beef', 'pork', 'mayo', 'sunflower-oil', 'cashews', 'pesto', 'croissant', 'feta']
    ],
    severity: 'MODERATE', coinsPenalty: 10,
    message: '📉🍬 Fast sugars mixed with heavy fat cause an insulin rollercoaster',
    explanation: 'Combining fast sugars with high fat delays sugar absorption, causing a massive, prolonged insulin spike and fat storage.',
  },
];

export interface ThresholdRule {
  id: string;
  label: string;
  type: 'max' | 'min';
  penalty: number;
  explanation: string;
}

export const THRESHOLD_RULES: ThresholdRule[] = [
  // --- MAX LIMITS (Excess) ---
  {
    id: 'monotonous-meal',
    label: 'Monotonous Meal',
    type: 'min', penalty: 10,
    explanation: 'Eating 2+ identical foods in one meal limits nutrient diversity. Mix it up!',
  },
  {
    id: 'heavy-breakfast',
    label: 'Heavy Breakfast',
    type: 'max', penalty: 5,
    explanation: 'A massive breakfast over 800 kcal can make you sluggish. Keep it moderate to start right.',
  },
  {
    id: 'heavy-lunch',
    label: 'Heavy Lunch',
    type: 'max', penalty: 5,
    explanation: 'Eating over 1000 kcal for lunch is a one-way ticket to a 3pm food coma. Keep it reasonable!',
  },
  {
    id: 'fat-dinner',
    label: 'Heavy Dinner',
    type: 'max', penalty: 5,
    explanation: 'Fat digests slowly. Eating over 60g of fat for dinner can ruin your sleep and cause indigestion.',
  },
  {
    id: 'heavy-snack',
    label: 'Heavy Snack',
    type: 'max', penalty: 5,
    explanation: 'Snacks should be light bridges between meals. Over 200 kcal and it\'s basically a fourth meal!',
  },
  // --- MIN LIMITS (Imbalance) ---
  {
    id: 'starvation-meal',
    label: 'Starvation Meal',
    type: 'min', penalty: 15,
    explanation: 'Main meals (Breakfast, Lunch, Dinner) under 200 kcal won\'t fuel you. Don\'t starve yourself!',
  },
  {
    id: 'carnivore-plate',
    label: 'Carnivore Plate',
    type: 'min', penalty: 5,
    explanation: 'A meal with no veggies, grains, or fruits lacks fiber and vitamins for healthy digestion.',
  },
  {
    id: 'empty-carbs',
    label: 'Empty Carbs',
    type: 'min', penalty: 5,
    explanation: 'Only grains and sweets with no protein or fat spike blood sugar and leave you starving.',
  },
];

export function detectThresholdPenalties(
  meals: Record<string, string[]>,
  activeMeals: MealType[]
): ThresholdViolation[] {
  const violations: ThresholdViolation[] = [];
  const SUBSTANTIVE_CATEGORIES = ['meat-fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts-legumes'];

  (Object.keys(meals) as MealType[]).forEach(mt => {
    // FIX: Only check meals that are active in the current scenario
    if (!activeMeals.includes(mt)) return;

    const foods = meals[mt] || [];
    const isMainMeal = mt !== 'snacks';
    const nutrition = calculateMealNutrition(foods, foods.map(() => 1));

    // Repetition Check (Applies to ALL meals)
    const counts = foods.reduce((acc, id) => { acc[id] = (acc[id] || 0) + 1; return acc; }, {} as Record<string, number>);
    const maxRep = Math.max(0, ...Object.values(counts)); // Math.max(0, ...) prevents -Infinity on empty arrays
    if (maxRep >= 2) {
      violations.push({ id: `rep-${mt}`, label: `Monotonous Meal (${mt})`, penalty: 10 });
    }

    // Max Nutrient Limits
    if (mt === 'breakfast' && nutrition.calories > 800) violations.push({ id: `heavy-bf`, label: `Heavy Breakfast (${mt})`, penalty: 5 });
    if (mt === 'lunch' && nutrition.calories > 1000) violations.push({ id: `heavy-lunch`, label: `Heavy Lunch (${mt})`, penalty: 5 });
    if (mt === 'dinner' && nutrition.fat > 60) violations.push({ id: `fat-dinner`, label: `Heavy Dinner (${mt})`, penalty: 5 });
    if (mt === 'snacks' && nutrition.calories > 200) violations.push({ id: `heavy-snack`, label: `Heavy Snack (${mt})`, penalty: 5 });

    // Min Imbalance Limits (ONLY for Breakfast, Lunch, Dinner)
    if (isMainMeal) {
      // This now naturally catches 0 foods (0 kcal < 200 kcal) and <200 kcal meals!
      if (nutrition.calories < 200) {
        violations.push({ id: `starve-${mt}`, label: `Starvation Meal (${mt})`, penalty: 15 });
      }

      if (foods.length >= 3) {
        const categoriesIncluded = new Set(
          foods.map(id => FOOD_LIBRARY.find(f => f.id === id)?.category).filter(c => c && SUBSTANTIVE_CATEGORIES.includes(c)) as string[]
        );

        const hasProteinFat = categoriesIncluded.has('meat-fish') || categoriesIncluded.has('nuts-legumes') || categoriesIncluded.has('dairy');
        const hasVegFruitGrain = categoriesIncluded.has('vegetables') || categoriesIncluded.has('fruits') || categoriesIncluded.has('grains');

        // Carnivore Plate (No Veggies, Grains, or Fruits)
        if (hasProteinFat && !hasVegFruitGrain) {
          violations.push({ id: `carnivore-${mt}`, label: `Carnivore Plate (${mt})`, penalty: 5 });
        }

        // Empty Carbs (No Protein, Dairy, or Nuts)
        const onlyCarbs = !categoriesIncluded.has('meat-fish') && !categoriesIncluded.has('nuts-legumes') && !categoriesIncluded.has('dairy');
        if (onlyCarbs && hasVegFruitGrain) {
          violations.push({ id: `empty-carbs-${mt}`, label: `Empty Carbs (${mt})`, penalty: 5 });
        }
      }
    }
  });

  return violations;
}

export const GOOD_COMBOS: GoodCombo[] = [
  {
    id: 'VitCBoostsIron',
    shortLabel: 'VitC + Iron',
    requiredGroups: [['red-pepper', 'orange', 'strawberries', 'kiwi', 'broccoli', 'lemon'], ['spinach', 'lentils', 'beans', 'chickpeas', 'tofu']],
    severity: 'CRITICAL', coinsBonus: 10,
    message: '🍊🥬 Vitamin C supercharges plant iron absorption!',
    explanation: 'Vitamin C converts non-heme iron from plants into a highly absorbable form, multiplying iron uptake by up to 6x.',
  },
  {
    id: 'VitDBoostsCalcium',
    shortLabel: 'VitD + Calcium',
    requiredGroups: [['salmon', 'sardines', 'mushrooms', 'egg', 'canned-tuna'], ['milk', 'cheese', 'greek-yogurt', 'cottage-cheese', 'tofu', 'soy-milk']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🐟🥛 Vitamin D maximizes calcium absorption',
    explanation: 'Vitamin D acts as a key to unlock intestinal calcium absorption, directing it straight to your bones.',
  },
  {
    id: 'FatsUnlockVitamins',
    shortLabel: 'Fats + Vitamins',
    requiredGroups: [['olive-oil', 'sunflower-oil', 'walnuts', 'almonds', 'seeds', 'avocado', 'cashews', 'pesto'], ['carrot', 'spinach', 'red-pepper', 'tomato']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🫒🥕 Healthy fats unlock fat-soluble vitamins',
    explanation: 'Vitamins A, E, and carotenoids require dietary fat to be properly absorbed by the body.',
  },
  {
    id: 'ComplementaryProteins',
    shortLabel: 'Complementary Protein',
    requiredGroups: [['beans', 'lentils', 'chickpeas'], ['rice', 'wheat-bread', 'oats', 'buckwheat', 'quinoa', 'corn']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🫘🍚 Complete protein synergy!',
    explanation: 'Legumes lack methionine but have lysine; grains lack lysine but have methionine. Together they form a perfect complete protein.',
  },
  {
    id: 'BodybuilderClassic',
    shortLabel: 'Balanced Macro',
    requiredGroups: [['chicken', 'turkey'], ['rice'], ['broccoli']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🍗🍚🥦 The perfect balanced macro meal',
    explanation: 'Lean protein for muscles, fast carbs for energy, and broccoli for fiber and micronutrients.',
  },
  {
    id: 'HeartHealthyBreakfast',
    shortLabel: 'Heart Healthy',
    requiredGroups: [['oats', 'blueberries', 'walnuts', 'milk']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🥣🫐🌰 Heart-healthy omega and antioxidant boost',
    explanation: 'A perfect blend of slow carbs, antioxidants, and omega-3 fatty acids for cardiovascular health.',
  },
  {
    id: 'MediterraneanPowerhouse',
    shortLabel: 'Mediterranean',
    requiredGroups: [['salmon', 'canned-tuna'], ['tomato', 'red-pepper', 'olive-oil', 'pesto']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🐟🍅🫒 The Mediterranean anti-inflammatory shield',
    explanation: 'Combines high-quality Omega-3s with lycopene and oleic acid for ultimate anti-inflammatory effects.',
  },
  {
    id: 'PrebioticProbiotic',
    shortLabel: 'Prebiotic + Probiotic',
    requiredGroups: [['kefir', 'greek-yogurt', 'skyr'], ['banana', 'oats', 'honey', 'onion']],
    severity: 'MINOR', coinsBonus: 2,
    message: '🥛🍌🫶 Feeding your gut microbiome',
    explanation: 'Probiotics in dairy need prebiotic fiber (from bananas/oats/onions) to thrive and colonize the gut.',
  },
  {
    id: 'PostWorkoutRecovery',
    shortLabel: 'Post-Workout',
    requiredGroups: [['egg', 'banana', 'honey']],
    severity: 'MINOR', coinsBonus: 2,
    message: '🥚🍌🍯 Fast glycogen and protein replenishment',
    explanation: 'The perfect post-workout spike: simple sugars rapidly restore muscle glycogen while eggs provide immediate protein synthesis.',
  },
  {
    id: 'EnergyStabilizer',
    shortLabel: 'Steady Energy',
    requiredGroups: [['buckwheat', 'egg', 'cucumber']],
    severity: 'MINOR', coinsBonus: 2,
    message: '🥣🥚🥒 Low-glycemic steady energy',
    explanation: 'Buckwheat provides slow, steady glucose release, paired with high-quality protein and hydration for zero crashes.',
  },
  {
    id: 'VeganCalciumSynergy',
    shortLabel: 'Vegan Calcium',
    requiredGroups: [['tofu', 'soy-milk'], ['mushrooms', 'broccoli']],
    severity: 'MODERATE', coinsBonus: 5,
    message: '🌱🦴 The Vegan Calcium Secret',
    explanation: 'Vegans often lack calcium. Fortified tofu/soy milk paired with broccoli (calcium) and mushrooms (Vit D) ensures strong bones without dairy.',
  },
  {
    id: 'AvocadoToastSynergy',
    shortLabel: 'Avocado + Toast',
    requiredGroups: [['avocado'], ['wheat-bread', 'rye-bread']],
    severity: 'MINOR', coinsBonus: 2,
    message: '🥑🍞 Sustained energy release',
    explanation: 'The healthy fats in avocado dramatically slow down the digestion of whole-grain bread, providing extremely stable, long-lasting energy.',
  },
  {
    id: 'AntioxidantSynergy',
    shortLabel: 'Antioxidant',
    requiredGroups: [['dark-chocolate'], ['strawberries', 'blueberries', 'orange', 'kiwi']],
    severity: 'MINOR', coinsBonus: 2,
    message: '🍫🫐 Amplified antioxidant absorption',
    explanation: 'Vitamin C from berries actively regenerates the flavonoid antioxidants in dark chocolate, doubling their cellular protection power.',
  },
  {
    id: 'ShellfishImmunitySynergy',
    shortLabel: 'Shellfish + VitC',
    requiredGroups: [['shrimp'], ['broccoli', 'red-pepper', 'orange', 'kiwi', 'strawberries']],
    severity: 'MINOR', coinsBonus: 2,
    message: '🦐🍊 Shellfish + Vitamin C Immunity Boost',
    explanation: 'Shellfish is rich in Zinc and Copper, which are essential for immune cell function. Vitamin C enhances the absorption and utilization of these trace minerals, boosting immunity.',
  },
];

// ==========================================
// DETECTION LOGIC
// ==========================================
export function detectBadCombos(foodIds: string[]): BadCombo[] {
  if (foodIds.length < 2) return [];
  return BAD_COMBOS.filter(combo => {
    const hasAllGroups = combo.requiredGroups.every(group => group.some(fId => foodIds.includes(fId)));
    const hasTwoInAnyGroup = combo.requiredGroups.some(group => group.filter(fId => foodIds.includes(fId)).length >= 2);
    if (combo.requiredGroups.length > 1) { return hasAllGroups; }
    else { return hasTwoInAnyGroup; }
  });
}

export function detectGoodCombos(foodIds: string[]): GoodCombo[] {
  if (foodIds.length < 2) return [];
  return GOOD_COMBOS.filter(combo => {
    const hasAllGroups = combo.requiredGroups.every(group => group.some(fId => foodIds.includes(fId)));
    const hasTwoInAnyGroup = combo.requiredGroups.some(group => group.filter(fId => foodIds.includes(fId)).length >= 2);
    if (combo.requiredGroups.length > 1) { return hasAllGroups; }
    else { return hasTwoInAnyGroup; }
  });
}


// ============================================================================
// 3. CHARACTER STATS & PROGRESSION
// ============================================================================
export interface Character {
  id: string;
  name: string;
  coins: number;
}

// ============================================
// 5. SCENARIOS (Tier 1 Starter Pack)
// ============================================
export const NUTRIENT_MAP: Record<string, { path: string; unit: string }> = {
  calories: { path: 'calories', unit: 'kcal' },
  water: { path: 'macronutrients.water', unit: 'ml' },
  protein: { path: 'macronutrients.protein', unit: 'g' },
  carbs: { path: 'macronutrients.carbs', unit: 'g' },
  fat: { path: 'macronutrients.fat', unit: 'g' },
  fiber: { path: 'macronutrients.fiber', unit: 'g' },
  iron: { path: 'micronutrients.ironMg', unit: 'mg' },
  calcium: { path: 'micronutrients.calciumMg', unit: 'mg' },
  potassium: { path: 'micronutrients.potassiumMg', unit: 'mg' },
  sodium: { path: 'micronutrients.sodiumMg', unit: 'mg' },
  magnesium: { path: 'micronutrients.magnesiumMg', unit: 'mg' },
  zinc: { path: 'micronutrients.zincMg', unit: 'mg' },
  vitaminC: { path: 'micronutrients.vitaminCMg', unit: 'mg' },
  vitaminD: { path: 'micronutrients.vitaminDMcg', unit: 'mcg' },
  vitaminB: { path: 'micronutrients.vitaminBMcg', unit: 'mcg' },
  vitaminK: { path: 'micronutrients.vitaminKMcg', unit: 'mcg' },
  folate: { path: 'micronutrients.folateMcg', unit: 'mcg' },
  vitaminA: { path: 'micronutrients.vitaminAMcg', unit: 'mcg' },
  vitaminE: { path: 'micronutrients.vitaminEMg', unit: 'mg' },
  omega3: { path: 'micronutrients.omega3Mg', unit: 'mg' },
  omega6: { path: 'micronutrients.omega6Mg', unit: 'mg' },
  oleicAcid: { path: 'micronutrients.oleicAcidG', unit: 'g' },
  lycopene: { path: 'micronutrients.lycopeneMcg', unit: 'mcg' },
  betaCarotene: { path: 'micronutrients.betaCaroteneMcg', unit: 'mcg' },
  lutein: { path: 'micronutrients.luteinMcg', unit: 'mcg' },
  anthocyanins: { path: 'micronutrients.anthocyaninsMg', unit: 'mg' },
  probiotics: { path: 'micronutrients.probioticsCFU', unit: 'CFU' },
  prebioticFiber: { path: 'micronutrients.prebioticFiberG', unit: 'g' },
};

// ============================================================================
// STARTING INVENTORY
// ============================================================================
export const STARTING_FOODS: string[] = [
  'water', 'chicken', 'wheat-bread', 'butter', 'milk', 'apple', 'tomato', 'salt', 'cashews', 'lemon', 'zucchini'
];

export const SCENARIOS: Scenario[] = [
  // ==========================================================
  // TIER 1: The Foundation (Macros)
  // ==========================================================
  {
    id: 'calorie-counting', tier: 1, pathId: 'basics',
    title: 'Calorie Counting',
    description: 'You accidentally entered a "Moderate Eating" contest. To qualify, you need a lunch that hits exactly 500 kcal. No complex rules yet—just learn the plate UI and don\'t get disqualified for being too hungry (or too full).',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'calories', target: 500, unitLabel: 'kcal' }],
    unlocksFoods: ['egg', 'beans', 'corn'], coinsReward: 20,
  },
  {
    id: 'protein-power', tier: 1, pathId: 'basics',
    title: 'Protein Power',
    description: 'You challenged a bodybuilder to a flex-off at the beach. Your muscles are currently screaming for reinforcements. Load up a post-workout lunch with 30g of protein before the showdown!',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'protein', target: 30, unitLabel: 'g' }],
    unlocksFoods: ['rice', 'walnuts'], coinsReward: 20,
  },
  {
    id: 'carbs-for-energy', tier: 1, pathId: 'basics',
    title: 'Carbs for Energy',
    description: 'You have to outrun a hive of very angry bees this afternoon. Your brain and legs both run on carbs. Pack a lunch with 60g of carbs so you don\'t become their afternoon snack.',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'carbs', target: 60, unitLabel: 'g' }],
    unlocksFoods: ['oats', 'green-tea'], coinsReward: 20,
  },
  {
    id: 'dont-fear-fats', tier: 1, pathId: 'basics',
    title: 'Don\'t Fear Fats',
    description: 'Your brain has threatened to go on strike unless it gets some premium lubrication (fats) for hormone production. Appease it with a 25g fat dinner before it files a formal complaint.',
    activeMeals: ['dinner'],
    primaryGoals: [{ nutrientKey: 'fat', target: 25, unitLabel: 'g' }],
    unlocksFoods: ['olive-oil', 'coffee'], coinsReward: 20,
  },
  {
    id: 'macro-balance', tier: 1, pathId: 'basics',
    title: 'The Macro Balance',
    description: 'A wizard has cursed you to only feel satiated if your macros are in perfect harmony. Hit 40g protein, 50g carbs, and 15g fat in one lunch, or risk turning into a hangry frog.',
    activeMeals: ['lunch'],
    primaryGoals: [
      { nutrientKey: 'protein', target: 40, unitLabel: 'g' },
      { nutrientKey: 'carbs', target: 50, unitLabel: 'g' },
      { nutrientKey: 'fat', target: 15, unitLabel: 'g' },
    ],
    unlocksFoods: ['lentils', 'onion'], coinsReward: 20,
  },

  // ==========================================================
  // TIER 2: Basic Micronutrients (Hitting Targets)
  // ==========================================================
  {
    id: 'vitc-immunity', tier: 2, pathId: 'vitC',
    title: 'Vitamin C Immunity',
    description: 'Your coworker Dave has been coughing aggressively all week. Build a lunch packed with 60mg of Vitamin C to build a forcefield around your immune system. Dave\'s germs don\'t stand a chance.',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'vitaminC', target: 60, unitLabel: 'mg' }],
    unlocksFoods: ['red-pepper', 'orange'], coinsReward: 30,
  },
  {
    id: 'fiber-for-fullness', tier: 2, pathId: 'fiber',
    title: 'Fiber for Fullness',
    description: 'You\'re trapped in a very boring 3-hour Zoom meeting. You need a snack with 4g of fiber under 150 kcal so your stomach doesn\'t loudly rumble and ask what\'s for dinner.',
    activeMeals: ['snacks'],
    primaryGoals: [
      { nutrientKey: 'fiber', target: 4, unitLabel: 'g' },
      { nutrientKey: 'calories', target: 50, maxValue: 150, unitLabel: 'kcal' },
    ],
    unlocksFoods: ['cucumber', 'granola-bar'], coinsReward: 30,
  },
  {
    id: 'hydration-matters', tier: 2, pathId: 'hydration',
    title: 'Hydration Matters',
    description: 'You\'ve been mistaken for a dried-up houseplant. Prove them wrong with a hydrating lunch delivering 600ml of water under 300 kcal before someone tries to water your hair.',
    activeMeals: ['lunch'],
    primaryGoals: [
      { nutrientKey: 'water', target: 600, unitLabel: 'ml' },
      { nutrientKey: 'calories', target: 100, maxValue: 300, unitLabel: 'kcal' },
    ],
    unlocksFoods: ['pasta', 'soda', 'feta'], coinsReward: 30,
  },
  {
    id: 'pumping-iron', tier: 2, pathId: 'iron',
    title: 'Pumping Iron',
    description: 'You\'ve been invited to arm-wrestle a blacksmith. Build a lunch with 10mg of iron so your blood can actually carry oxygen to your soon-to-be-victorious biceps.',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'iron', target: 10, unitLabel: 'mg' }],
    unlocksFoods: ['beef', 'potato-chips'], coinsReward: 30,
  },
  {
    id: 'strong-bones', tier: 2, pathId: 'calcium',
    title: 'Strong Bones',
    description: 'You\'re auditioning for a role as a stunt double who gets thrown out of windows. You need 400mg of calcium for lunch to ensure your bones survive the director\'s "vision."',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'calcium', target: 400, unitLabel: 'mg' }],
    unlocksFoods: ['sardines', 'peas'], coinsReward: 30,
  },
  {
    id: 'tier2-master-revision', tier: 2, pathId: 'summary',
    title: 'Master Revision',
    description: 'The nutrition inspector is coming to grade your cafeteria. Impress them by hitting 50mg Vit C, 10mg Iron, and 400mg Calcium in one lunch. Don\'t mess this up, the health inspector is already mad about the mystery meat.',
    activeMeals: ['lunch'],
    primaryGoals: [
      { nutrientKey: 'vitaminC', target: 50, unitLabel: 'mg' },
      { nutrientKey: 'iron', target: 10, unitLabel: 'mg' },
      { nutrientKey: 'calcium', target: 400, unitLabel: 'mg' },
    ],
    unlocksFoods: ['rye-bread', 'sunflower-oil'], coinsReward: 30,
  },

  // ==========================================================
  // TIER 3: Micro Interactions (Combos & Antagonists)
  // ==========================================================
  {
    id: 'iron-booster-combo', tier: 3, pathId: 'iron',
    title: 'The Iron Booster',
    description: 'You\'ve discovered plant iron is shy and hides from your bloodstream. Coax it out by pairing it with a Vitamin C wingman! Build a lunch with 12mg iron that triggers the VitCBoostsIron combo.',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'iron', target: 12, unitLabel: 'mg' }],
    requiredComboIds: ['VitCBoostsIron'],
    unlocksFoods: ['black-tea', 'broccoli'], coinsReward: 40,
  },
  {
    id: 'coffee-blocks-iron', tier: 3, pathId: 'iron',
    title: 'Coffee Blocks Iron',
    description: 'Your morning coffee is a bouncer at the club, and it refuses to let Iron inside. Build a breakfast with 8mg of iron, but whatever you do—do NOT trigger the TanninsBlockIron combo!',
    activeMeals: ['breakfast'],
    primaryGoals: [{ nutrientKey: 'iron', target: 8, unitLabel: 'mg' }],
    forbiddenComboIds: ['TanninsBlockIron'],
    unlocksFoods: ['spinach', 'cheese', 'croissant'], coinsReward: 40,
  },
  {
    id: 'calcium-key-synergy', tier: 3, pathId: 'calcium',
    title: 'The Calcium Key',
    description: 'Calcium is a VIP trying to get into the bloodstream club, but it left its ID (Vitamin D) at home. Hit 400mg calcium for lunch while triggering the VitDBoostsCalcium combo to get them past the bouncer.',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'calcium', target: 400, unitLabel: 'mg' }],
    requiredComboIds: ['VitDBoostsCalcium'],
    unlocksFoods: ['kefir', 'mushrooms'], coinsReward: 40,
  },
  {
    id: 'spinach-steals-calcium', tier: 3, pathId: 'calcium',
    title: 'Spinach Steals Calcium',
    description: 'Spinach is secretly a calcium kidnapper. It looks innocent, but its oxalates bind calcium up and throw it in a van! Hit 400mg calcium for lunch WITHOUT triggering the OxalatesBlockCalcium combo.',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'calcium', target: 400, unitLabel: 'mg' }],
    forbiddenComboIds: ['OxalatesBlockCalcium'],
    unlocksFoods: ['tofu', 'almonds'], coinsReward: 40,
  },
  {
    id: 'unlocking-vitamin-a', tier: 3, pathId: 'fats',
    title: 'Unlocking Vitamin A',
    description: 'Vitamin A is trapped inside a locked vault of vegetables. Fat is the only key. Hit 300mcg Vit A while triggering the FatsUnlockVitamins combo to bust those nutrients free!',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'vitaminA', target: 300, unitLabel: 'mcg' }],
    requiredComboIds: ['FatsUnlockVitamins'],
    unlocksFoods: ['carrot', 'honey'], coinsReward: 40,
  },

  // ==========================================================
  // TIER 4: Meal Mechanics (Splitting Plates)
  // ==========================================================
  {
    id: 'morning-fuel-plus-snack', tier: 4, pathId: 'bridge',
    title: 'Morning Fuel + Snack',
    description: 'You\'re navigating a dangerous morning of school drop-offs and traffic. You need a 350 kcal breakfast for the road, and a 150 kcal snack for when the kids inevitably ask for food. Split your energy budget!',
    activeMeals: ['breakfast', 'snacks'],
    mealGoals: {
      breakfast: [{ nutrientKey: 'calories', target: 350, unitLabel: 'kcal' }],
      snacks: [{ nutrientKey: 'calories', target: 150, unitLabel: 'kcal' }],
    },
    unlocksFoods: ['banana', 'seeds', 'beer'], coinsReward: 50,
  },
  {
    id: 'sustained-energy-split', tier: 4, pathId: 'bridge',
    title: 'Sustained Energy Split',
    description: 'You\'re hunting the legendary Sugar Crash Dragon. Your breakfast needs 30g of slow carbs (oats/rye) to stalk it, and your snack needs 15g of fast carbs to sprint away when it notices you.',
    activeMeals: ['breakfast', 'snacks'],
    mealGoals: {
      breakfast: [{ nutrientKey: 'carbs', target: 30, unitLabel: 'g' }],
      snacks: [{ nutrientKey: 'carbs', target: 15, unitLabel: 'g' }],
    },
    unlocksFoods: ['potatoes', 'kiwi'], coinsReward: 50,
  },
  {
    id: 'micro-management-split', tier: 4, pathId: 'bridge',
    title: 'The Micro Manager',
    description: 'Vitamin C has the memory of a goldfish and leaves your body in a few hours. Distribute 60mg of it across lunch (30mg) and a snack (30mg) so your immune system doesn\'t forget what it\'s doing.',
    activeMeals: ['lunch', 'snacks'],
    mealGoals: {
      lunch: [{ nutrientKey: 'vitaminC', target: 30, unitLabel: 'mg' }],
      snacks: [{ nutrientKey: 'vitaminC', target: 30, unitLabel: 'mg' }],
    },
    unlocksFoods: ['chickpeas', 'blueberries'], coinsReward: 50,
  },
  {
    id: 'sodium-potassium-balance', tier: 4, pathId: 'bridge',
    title: 'Sodium-Potassium Balance',
    description: 'You ate too much salty popcorn at the movies and now you\'re a puffy balloon. Offset the sodium with potassium! Get 800mg potassium under 400mg sodium across lunch and a snack to deflate.',
    activeMeals: ['lunch', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'potassium', target: 800, unitLabel: 'mg' },
      { nutrientKey: 'sodium', target: 100, maxValue: 400, unitLabel: 'mg' },
    ],
    unlocksFoods: ['salmon', 'avocado'], coinsReward: 50,
  },
  {
    id: 'endurance-hydration', tier: 4, pathId: 'bridge',
    title: 'Endurance Hydration',
    description: 'You\'re being chased by a slow but relentless zombie. You need 100ml of water and 20g of fast carbs in a snack under 120 kcal to maintain your brisk jog to safety.',
    activeMeals: ['snacks'],
    primaryGoals: [
      { nutrientKey: 'water', target: 100, unitLabel: 'ml' },
      { nutrientKey: 'carbs', target: 20, unitLabel: 'g' },
      { nutrientKey: 'calories', target: 50, maxValue: 120, unitLabel: 'kcal' },
    ],
    unlocksFoods: ['soy-milk', 'juice'], coinsReward: 50,
  },

  // ==========================================================
  // TIER 5: Lifestyles & Advanced (Two Meals)
  // ==========================================================
  {
    id: 'vegan-protein-day', tier: 5, pathId: 'lifestyle',
    title: 'Vegan Protein Day',
    description: 'Your friend bet you $50 you can\'t survive a single day without eating a cow. Prove them wrong across two meals! Hit 40g protein using strictly vegan foods. Mooo-ve over, meat.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [{ nutrientKey: 'protein', target: 40, unitLabel: 'g' }],
    requiredFoodTags: ['vegan'],
    unlocksFoods: ['quinoa', 'sports-drink'], coinsReward: 60,
  },
  {
    id: 'gluten-free-energy', tier: 5, pathId: 'lifestyle',
    title: 'Gluten-Free Energy',
    description: 'The bakery down the street is a mafia front, and they\'ve banned you from eating gluten. Show them you don\'t need their bread! Hit 80g of carbs across two meals using ONLY gluten-free foods.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [{ nutrientKey: 'carbs', target: 80, unitLabel: 'g' }],
    requiredFoodTags: ['gluten-free'],
    unlocksFoods: ['buckwheat', 'greek-yogurt'], coinsReward: 60,
  },
  {
    id: 'mediterranean-shield', tier: 5, pathId: 'fats',
    title: 'The Mediterranean Shield',
    description: 'You want to live to be 120 years old just to annoy your neighbors. Adopt the Mediterranean diet! Build two meals with 40g protein and 30g fat that trigger the MediterraneanPowerhouse combo.',
    activeMeals: ['lunch', 'dinner'],
    primaryGoals: [
      { nutrientKey: 'protein', target: 40, unitLabel: 'g' },
      { nutrientKey: 'fat', target: 30, unitLabel: 'g' },
    ],
    requiredComboIds: ['MediterraneanPowerhouse'],
    unlocksFoods: ['skyr', 'cottage-cheese', 'pesto'], coinsReward: 60,
  },
  {
    id: 'vegan-calcium-secret', tier: 5, pathId: 'lifestyle',
    title: 'The Vegan Calcium Secret',
    description: 'You\'re a vegan dinosaur, and your bones are getting brittle. Discover the secret: Tofu + Broccoli + Mushrooms! Hit 400mg Calcium across two meals and trigger the VeganCalciumSynergy combo.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [{ nutrientKey: 'calcium', target: 400, unitLabel: 'mg' }],
    requiredComboIds: ['VeganCalciumSynergy'],
    unlocksFoods: ['shrimp', 'pork'], coinsReward: 60,
  },
  {
    id: 'anti-inflammatory-day', tier: 5, pathId: 'fats',
    title: 'Anti-Inflammatory Day',
    description: 'You\'ve been stung by a swarm of "Inflammation Bees" (a metaphorical, but painful foe). Soothe the sting by building two meals with 30g of fat using ONLY anti-inflammatory and healthy-fat foods.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [{ nutrientKey: 'fat', target: 30, unitLabel: 'g' }],
    requiredFoodTags: ['anti-inflammatory', 'healthy-fats'],
    unlocksFoods: ['vinegar', 'mayo'], coinsReward: 60,
  },
  {
    id: 'pub-lunch-trap', tier: 5, pathId: 'lifestyle',
    title: 'The Pub Lunch Trap',
    description: 'You\'re at the pub and ordered a beer. The evil bartender says you can\'t leave until you eat 60g of carbs to soak it up. But beware: mixing beer\'s fast sugars with slow carbs (like bread or pasta) triggers an insulin crash!',
    activeMeals: ['lunch'],
    primaryGoals: [{ nutrientKey: 'carbs', target: 60, unitLabel: 'g' }],
    forbiddenComboIds: ['SugarConfusesSlowCarbs'],
    unlocksFoods: ['mozzarella', 'parmesan'], coinsReward: 60,
  },

  // ==========================================================
  // TIER 6: Two-Meal Mastery (High Coordination)
  // ==========================================================
  {
    id: 'the-office-worker', tier: 6, pathId: 'bridge',
    title: 'The Office Worker',
    description: 'The evil HR department has installed a "food coma detector" at your desk. Keep your total under 1000 kcal across breakfast and lunch, but get 50g protein so you don\'t fall asleep in the 3pm meeting.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 800, maxValue: 1000, unitLabel: 'kcal' },
      { nutrientKey: 'protein', target: 50, unitLabel: 'g' },
    ],
    unlocksFoods: ['dark-chocolate', 'popcorn'], coinsReward: 70,
  },
  {
    id: 'athletes-double-shift', tier: 6, pathId: 'bridge',
    title: 'Athlete\'s Double Shift',
    description: 'You\'re playing in the World Championship of competitive nap-taking, which requires intense carb-loading and muscle recovery. Hit 90g carbs and 60g protein across breakfast and lunch!',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [
      { nutrientKey: 'carbs', target: 90, unitLabel: 'g' },
      { nutrientKey: 'protein', target: 60, unitLabel: 'g' },
    ],
    unlocksFoods: ['grapes', 'turkey'], coinsReward: 70,
  },
  {
    id: 'combo-mastery-across-meals', tier: 6, pathId: 'bridge',
    title: 'Combo Mastery Across Meals',
    description: 'You\'re a combo sommelier. Show off your pairing skills: trigger VitCBoostsIron in breakfast, and VitDBoostsCalcium in lunch. Two different synergies, two different plates, one massive flex.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [
      { nutrientKey: 'iron', target: 10, unitLabel: 'mg' },
      { nutrientKey: 'calcium', target: 400, unitLabel: 'mg' },
    ],
    requiredComboIds: ['VitCBoostsIron', 'VitDBoostsCalcium'],
    unlocksFoods: ['dried-fruits', 'strawberries'], coinsReward: 70,
  },
  {
    id: 'pescatarian-cut', tier: 6, pathId: 'bridge',
    title: 'Pescatarian Cut',
    description: 'You\'ve been shrunken down to the size of an ant and need to carry 60g of protein back to the colony, but you only have room for 500 kcal in your tiny ant backpack. Shrimp is your only hope!',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [
      { nutrientKey: 'protein', target: 60, unitLabel: 'g' },
      { nutrientKey: 'calories', target: 300, maxValue: 500, unitLabel: 'kcal' },
    ],
    unlocksFoods: ['protein-bar', 'soy-sauce', 'canned-tuna'], coinsReward: 70,
  },
  {
    id: 'double-meal-macro-balance', tier: 6, pathId: 'bridge',
    title: 'Double Meal Macro Balance',
    description: 'An alien has challenged you to perfectly balance the macros of two human meals, or they will destroy Earth. Hit exactly 1200 kcal with 70g protein, 120g carbs, and 35g fat. No pressure.',
    activeMeals: ['breakfast', 'lunch'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 1200, unitLabel: 'kcal' },
      { nutrientKey: 'protein', target: 70, unitLabel: 'g' },
      { nutrientKey: 'carbs', target: 120, unitLabel: 'g' },
      { nutrientKey: 'fat', target: 35, unitLabel: 'g' },
    ],
    unlocksFoods: ['ice-cream', 'cake'], coinsReward: 70,
  },

  // ==========================================================
  // TIER 7: Full Day Master Challenges
  // ==========================================================
  {
    id: 'standard-balanced-day', tier: 7, pathId: 'realworld',
    title: 'The Standard Balanced Day',
    description: 'You\'ve been asked to write the textbook definition of a "Normal Human Diet." Set the baseline for the species: 2000 kcal with 70g protein, 250g carbs, and 65g fat across a full day. Make humanity proud.',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 2000, unitLabel: 'kcal' },
      { nutrientKey: 'protein', target: 70, unitLabel: 'g' },
      { nutrientKey: 'carbs', target: 250, unitLabel: 'g' },
      { nutrientKey: 'fat', target: 65, unitLabel: 'g' },
    ],
    unlocksFoods: [], coinsReward: 80,
  },
  {
    id: 'zero-bad-combos-day', tier: 7, pathId: 'realworld',
    title: 'Zero Bad Combos Day',
    description: 'The Food Police are auditing your digestive tract. Plan an entire day where NO bad combo ever triggers. 2000 kcal, 70g protein, clean pairings only, or it\'s off to nutrition jail for you!',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 2000, unitLabel: 'kcal' },
      { nutrientKey: 'protein', target: 70, unitLabel: 'g' },
    ],
    forbiddenComboIds: ['TanninsBlockIron', 'OxalatesBlockCalcium', 'SugarConfusesSlowCarbs'],
    unlocksFoods: [], coinsReward: 80,
  },
  {
    id: 'the-birthday-party', tier: 7, pathId: 'realworld',
    title: 'The Birthday Party',
    description: 'It\'s your mortal enemy\'s birthday, and you MUST eat a slice of cake to be polite. But you refuse to let them win the carb war. Keep total carbs under 100g while hitting 1500-1800 kcal. Vengeance is sweet, but your blood sugar is stable.',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 1500, maxValue: 1800, unitLabel: 'kcal' },
      { nutrientKey: 'carbs', target: 50, maxValue: 100, unitLabel: 'g' },
    ],
    unlocksFoods: [], coinsReward: 80,
  },
  {
    id: 'ultra-marathoner', tier: 7, pathId: 'master',
    title: 'The Ultra-Marathoner',
    description: 'You accidentally signed up to run 50km away from a bear. You need 2500-3000 kcal of pure energy with 200g carbs, but keep fat under 50g. Carbs are king; fat is the enemy of speed. Run!',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 2500, maxValue: 3000, unitLabel: 'kcal' },
      { nutrientKey: 'carbs', target: 200, unitLabel: 'g' },
      { nutrientKey: 'fat', maxValue: 50, unitLabel: 'g' },
    ],
    unlocksFoods: [], coinsReward: 80,
  },
  {
    id: 'iron-woman', tier: 7, pathId: 'master',
    title: 'Iron Woman',
    description: 'You\'ve been challenged to forge a sword using only the iron in your blood. Hit 25mg of iron in one day using ONLY vegan foods. Oh, and plant iron absorbs poorly, so you\'ll need Vit C combos to smelt it properly.',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [{ nutrientKey: 'iron', target: 25, unitLabel: 'mg' }],
    requiredFoodTags: ['vegan'],
    requiredComboIds: ['VitCBoostsIron'],
    unlocksFoods: [], coinsReward: 80,
  },
  {
    id: 'sodium-struggle', tier: 7, pathId: 'master',
    title: 'Sodium Struggle',
    description: 'You\'ve angered the Salt King and he has cursed your blood pressure. Defeat the curse by keeping sodium under 1500mg for the whole day, while simultaneously hitting 3000mg potassium to counter his dark magic.',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'sodium', maxValue: 1500, unitLabel: 'mg' },
      { nutrientKey: 'potassium', target: 3000, unitLabel: 'mg' },
    ],
    unlocksFoods: [], coinsReward: 80,
  },
  {
    id: 'ultimate-nutritionist', tier: 7, pathId: 'master',
    title: 'The Ultimate Nutritionist',
    description: 'The final boss of nutrition: a sentient kale smoothie. Defeat it by hitting perfect macros (70g P, 250g C, 65g F at 2000 kcal), triggering 3 good combos, and triggering ZERO bad combos. Earn your title!',
    activeMeals: ['breakfast', 'lunch', 'dinner', 'snacks'],
    primaryGoals: [
      { nutrientKey: 'calories', target: 2000, unitLabel: 'kcal' },
      { nutrientKey: 'protein', target: 70, unitLabel: 'g' },
      { nutrientKey: 'carbs', target: 250, unitLabel: 'g' },
      { nutrientKey: 'fat', target: 65, unitLabel: 'g' },
    ],
    requiredComboIds: ['VitCBoostsIron', 'VitDBoostsCalcium', 'FatsUnlockVitamins'],
    forbiddenComboIds: ['TanninsBlockIron', 'OxalatesBlockCalcium', 'SugarConfusesSlowCarbs'],
    unlocksFoods: [], coinsReward: 100,
  },
];

// ============================================================================
// 6. NUTRITION CALCULATIONS
// ============================================================================
export function calculateMealNutrition(foodIds: string[], quantities: number[]): Nutrient & Micronutrients & { calories: number } {
  let totals = {
    calories: 0,
    // Macros
    protein: 0, carbs: 0, fat: 0, fiber: 0, water: 0,
    // Minerals
    ironMg: 0, calciumMg: 0, potassiumMg: 0, sodiumMg: 0, magnesiumMg: 0, zincMg: 0,
    // Vitamins
    vitaminCMg: 0, vitaminDMcg: 0, vitaminBMcg: 0, vitaminKMcg: 0, folateMcg: 0, vitaminAMcg: 0, vitaminEMg: 0,
    // Fatty Acids & Bioactives
    omega3Mg: 0, omega6Mg: 0, oleicAcidG: 0,
    lycopeneMcg: 0, betaCaroteneMcg: 0, luteinMcg: 0, anthocyaninsMg: 0, probioticsCFU: 0, prebioticFiberG: 0,
  };

  foodIds.forEach((foodId, idx) => {
    const food = FOOD_LIBRARY.find((f: Food) => f.id === foodId);
    if (!food) return;

    const multiplier = quantities[idx] || 1;

    totals.calories += food.calories * multiplier;
    totals.protein += food.macronutrients.protein * multiplier;
    totals.carbs += food.macronutrients.carbs * multiplier;
    totals.fat += food.macronutrients.fat * multiplier;
    totals.fiber += food.macronutrients.fiber * multiplier;
    totals.water += food.macronutrients.water * multiplier;

    totals.ironMg += food.micronutrients.ironMg * multiplier;
    totals.calciumMg += food.micronutrients.calciumMg * multiplier;
    totals.potassiumMg += food.micronutrients.potassiumMg * multiplier;
    totals.sodiumMg += food.micronutrients.sodiumMg * multiplier;
    totals.magnesiumMg += food.micronutrients.magnesiumMg * multiplier;
    totals.zincMg += food.micronutrients.zincMg * multiplier;

    totals.vitaminCMg += food.micronutrients.vitaminCMg * multiplier;
    totals.vitaminDMcg += food.micronutrients.vitaminDMcg * multiplier;
    totals.vitaminBMcg += food.micronutrients.vitaminBMcg * multiplier;
    totals.vitaminKMcg += food.micronutrients.vitaminKMcg * multiplier;
    totals.folateMcg += food.micronutrients.folateMcg * multiplier;
    totals.vitaminAMcg += food.micronutrients.vitaminAMcg * multiplier;
    totals.vitaminEMg += food.micronutrients.vitaminEMg * multiplier;

    totals.omega3Mg += food.micronutrients.omega3Mg * multiplier;
    totals.omega6Mg += food.micronutrients.omega6Mg * multiplier;
    totals.oleicAcidG += food.micronutrients.oleicAcidG * multiplier;
    totals.lycopeneMcg += food.micronutrients.lycopeneMcg * multiplier;
    totals.betaCaroteneMcg += food.micronutrients.betaCaroteneMcg * multiplier;
    totals.luteinMcg += food.micronutrients.luteinMcg * multiplier;
    totals.anthocyaninsMg += food.micronutrients.anthocyaninsMg * multiplier;
    totals.probioticsCFU += food.micronutrients.probioticsCFU * multiplier;
    totals.prebioticFiberG += food.micronutrients.prebioticFiberG * multiplier;
  });

  return totals;
}


// ============================================================================
// 7. GAME STATE (What player saves in localStorage)
// ============================================================================
export interface GameState {
  character: Character;
  selectedTier: number;
  scenarioId: string | null;
  selectedMealType: MealType;
  dailyMeals: Record<string, { breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[] }>;
  unlockedFoods: string[];
  achievements: string[];
  completedScenarios: string[];
  purchasedHints: Record<string, Record<string, boolean | number>>;
  discoveredCombos: string[];
  pendingComboDiscoveries: { comboId: string; foodIds: string[] }[];
}

export const DEFAULT_GAME_STATE: GameState = {
  character: {
    id: 'player-1',
    name: 'Player',
    coins: 50,
  },
  selectedTier: 1,
  scenarioId: null,
  selectedMealType: 'breakfast',
  dailyMeals: {},
  unlockedFoods: STARTING_FOODS,
  achievements: [],
  completedScenarios: [],
  purchasedHints: {},
  discoveredCombos: [],
  pendingComboDiscoveries: [],
};