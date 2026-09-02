import { create } from 'zustand';
import type { GameState, MealType, CoinBreakdown, BadCombo, GoodCombo } from '../data/nutritionModels';
import { DEFAULT_GAME_STATE, SCENARIOS, detectBadCombos, detectGoodCombos, detectThresholdPenalties, FOOD_LIBRARY, NO_HINT_BONUS } from '../data/nutritionModels';
import { saveGameState, loadGameState } from '../utils/localStorage';

interface GameStore extends GameState {
  addMealToDay: (scenarioId: string, mealType: MealType, foodId: string) => void;
  removeMealFromDay: (scenarioId: string, mealType: MealType, foodId: string) => void;
  selectScenario: (scenarioId: string | null) => void;
  completeScenario: (scenarioId: string) => void;
  saveState: () => void;
  loadState: () => void;
  simulateDayNow: () => void;
  resetScenario: () => void;
  selectMealType: (mealType: MealType) => void;
  earnedCoins: Record<string, CoinBreakdown>;
  purchaseHint: (scenarioId: string, hintType: string, cost: number) => void;
  spendCoins: (amount: number) => void;
  dismissComboPopup: () => void;
  selectedTier: number;
  setSelectedTier: (tier: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...DEFAULT_GAME_STATE,
  earnedCoins: {},
  purchasedHints: {},

  addMealToDay: (scenarioId, mealType, foodId) => {
    const food = FOOD_LIBRARY.find(f => f.id === foodId);
    if (!food) return;

    const MAIN_CATEGORIES = ['meat-fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts-legumes', 'snacks'];
    const CONDIMENT_CATEGORIES = ['seasonings-fats'];
    const DRINK_CATEGORIES = ['drinks'];

    const isMain = MAIN_CATEGORIES.includes(food.category);
    const isCondiment = CONDIMENT_CATEGORIES.includes(food.category);
    const isDrink = DRINK_CATEGORIES.includes(food.category);

    const currentMeals = get().dailyMeals[scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const currentFoods = currentMeals[mealType] || [];

    // Hard limit: Max 3 of the exact same food
    if (currentFoods.filter(id => id === foodId).length >= 3) return;

    // Count current slots
    let mainCount = 0;
    let condimentCount = 0;
    let drinkCount = 0;

    currentFoods.forEach(id => {
      const f = FOOD_LIBRARY.find(x => x.id === id);
      if (!f) return;
      if (MAIN_CATEGORIES.includes(f.category)) mainCount++;
      else if (CONDIMENT_CATEGORIES.includes(f.category)) condimentCount++;
      else if (DRINK_CATEGORIES.includes(f.category)) drinkCount++;
    });

    // Enforce limits based on category
    if (isMain && mainCount >= 6) return;
    if (isCondiment && condimentCount >= 3) return;
    if (isDrink && drinkCount >= 2) return;

    set((state) => ({
      dailyMeals: {
        ...state.dailyMeals,
        [scenarioId]: {
          ...currentMeals,
          [mealType]: [...currentFoods, foodId],
        },
      },
    }));
  },

  removeMealFromDay: (scenarioId: string, mealType: MealType, foodId: string) =>
    set((state) => {
      const current = state.dailyMeals[scenarioId]?.[mealType] || [];
      const index = current.indexOf(foodId);
      const updated = index !== -1
        ? [...current.slice(0, index), ...current.slice(index + 1)]
        : current;
      return {
        dailyMeals: {
          ...state.dailyMeals,
          [scenarioId]: {
            ...state.dailyMeals[scenarioId],
            [mealType]: updated,
          },
        },
      };
    }),

  selectScenario: (scenarioId: string | null) =>
    set((state) => {
      if (!scenarioId) return { scenarioId: null };

      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return { scenarioId: null };

      const targetMealType = scenario.activeMeals[0] || 'breakfast';

      // ACCURATE DEBUG UNLOCK: Unlock all foods from scenarios BEFORE this one in the array
      const scenarioIndex = SCENARIOS.findIndex(s => s.id === scenarioId);
      const debugUnlockedFoods = new Set(state.unlockedFoods); // Starts with the 11 base foods

      for (let i = 0; i < scenarioIndex; i++) {
        const prevScenario = SCENARIOS[i];
        prevScenario.unlocksFoods?.forEach(fid => debugUnlockedFoods.add(fid));
      }

      return {
        scenarioId,
        selectedMealType: targetMealType,
        unlockedFoods: Array.from(debugUnlockedFoods),
      };
    }),

  completeScenario: (scenarioId: string) =>
    set((state) => {
      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (!scenario) return state;
      if (state.completedScenarios.includes(scenarioId)) return state;

      const meals = state.dailyMeals[scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

      let mealFoods: string[] = [];
      scenario.activeMeals.forEach(mt => {
        mealFoods = [...mealFoods, ...(meals[mt] || [])];
      });

      // Combo detection (PER MEAL)
      let badCombos: BadCombo[] = [];
      let goodCombos: GoodCombo[] = [];
      scenario.activeMeals.forEach(mt => {
        const foodsInMeal = meals[mt] || [];
        badCombos = [...badCombos, ...detectBadCombos(foodsInMeal)];
        goodCombos = [...goodCombos, ...detectGoodCombos(foodsInMeal)];
      });

      const totalPenalty = badCombos.reduce((sum, c) => sum + c.coinsPenalty, 0);
      const thresholdViolations = detectThresholdPenalties(meals, scenario.activeMeals);
      const totalThresholdPenalty = thresholdViolations.reduce((sum, v) => sum + v.penalty, 0);
      const totalBonus = goodCombos.reduce((sum, c) => sum + c.coinsBonus, 0);

      // Variety bonus (PER MEAL)
      const SUBSTANTIVE_CATEGORIES = ['meat-fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts-legumes'];
      let varietyBonus = 0;

      scenario.activeMeals.forEach(mt => {
        const foodsInMeal = meals[mt] || [];
        const categoriesIncluded = new Set(
          foodsInMeal.map((foodId: string) => FOOD_LIBRARY.find(f => f.id === foodId)?.category)
            .filter((cat: any) => cat && SUBSTANTIVE_CATEGORIES.includes(cat))
        );

        if (categoriesIncluded.size >= 6) varietyBonus += 6;
        else if (categoriesIncluded.size >= 5) varietyBonus += 4;
        else if (categoriesIncluded.size >= 4) varietyBonus += 2;

        const hasProtein = categoriesIncluded.has('meat-fish') || categoriesIncluded.has('nuts-legumes');
        const hasVeggies = categoriesIncluded.has('vegetables');
        const hasGrains = categoriesIncluded.has('grains');
        const hasDairy = categoriesIncluded.has('dairy');
        if (hasProtein && hasVeggies && hasGrains && hasDairy) varietyBonus += 5;
      });

      // No-Hint Bonus 
      const hintsForScenario = state.purchasedHints[scenarioId];
      const hasUsedHint = hintsForScenario && Object.keys(hintsForScenario).length > 0;
      const noHintBonus = hasUsedHint ? 0 : NO_HINT_BONUS;

      // Final coins: base floor of 0, then add no-hint bonus on top
      const baseCoins = Math.max(scenario.coinsReward - totalPenalty - totalThresholdPenalty + varietyBonus + totalBonus, 0);
      const finalCoins = baseCoins + noHintBonus;

      // Build breakdown
      const breakdown: CoinBreakdown = {
        base: scenario.coinsReward,
        variety: varietyBonus,
        goodCombos: goodCombos.map(c => ({ id: c.id, label: c.shortLabel, amount: c.coinsBonus })),
        badCombos: badCombos.map(c => ({ id: c.id, label: c.shortLabel, amount: c.coinsPenalty })),
        thresholds: thresholdViolations.map(v => ({ id: v.id, label: v.label, amount: -v.penalty })),
        noHintBonus,
        total: finalCoins,
      };

      // Unlock foods (regular scenario reward)
      const newUnlockedFoods = scenario.unlocksFoods
        ? [...state.unlockedFoods, ...scenario.unlocksFoods]
        : state.unlockedFoods;

      // Clear plates
      let updatedDailyMeals = { ...state.dailyMeals };
      let dayMeals = { ...(updatedDailyMeals[scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] }) };

      scenario.activeMeals.forEach(mt => {
        dayMeals[mt] = [];
      });

      updatedDailyMeals[scenarioId] = dayMeals;

      return {
        completedScenarios: [...state.completedScenarios, scenarioId],
        earnedCoins: { ...state.earnedCoins, [scenarioId]: breakdown },
        dailyMeals: updatedDailyMeals,
        unlockedFoods: newUnlockedFoods,
        character: {
          ...state.character,
          coins: state.character.coins + finalCoins,
        },
      };
    }),

  purchaseHint: (scenarioId, hintType, cost) => {
    const state = get();
    const character = state.character;

    if (character.coins < cost) return;

    const currentScenarioHints = state.purchasedHints[scenarioId] ?? {};
    const existingValue = currentScenarioHints[hintType];

    if (existingValue !== undefined && hintType !== 'D') return;

    const existingCount = typeof existingValue === 'number' ? existingValue : 0;
    const newValue: boolean | number = hintType === 'D' ? existingCount + 1 : true;

    set({
      character: { ...character, coins: character.coins - cost },
      purchasedHints: {
        ...state.purchasedHints,
        [scenarioId]: {
          ...currentScenarioHints,
          [hintType]: newValue,
        },
      },
    });
  },

  spendCoins: (amount: number) =>
    set((state) => ({
      character: {
        ...state.character,
        coins: Math.max(state.character.coins - amount, 0),
      },
    })),

  resetScenario: () =>
    set((state) => {
      if (!state.scenarioId) return state;
      const scenario = SCENARIOS.find((s) => s.id === state.scenarioId);
      if (!scenario) return state;

      let updatedDailyMeals = { ...state.dailyMeals };
      let dayMeals = { ...(updatedDailyMeals[state.scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] }) };

      scenario.activeMeals.forEach(mt => {
        dayMeals[mt] = [];
      });

      updatedDailyMeals[state.scenarioId] = dayMeals;

      const updatedPurchasedHints = { ...state.purchasedHints };
      delete updatedPurchasedHints[state.scenarioId];

      return {
        dailyMeals: updatedDailyMeals,
        purchasedHints: updatedPurchasedHints,
      };
    }),

  simulateDayNow: () => {
    const state = get();
    if (!state.scenarioId) return;
    const scenario = SCENARIOS.find(s => s.id === state.scenarioId);
    if (!scenario) return;

    const meals = state.dailyMeals[state.scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

    let allActiveCombos: (GoodCombo | BadCombo)[] = [];
    let comboTriggersByMeal: Record<string, string[]> = {}; // Track which foods triggered which combo

    // Evaluate combos per-meal
    scenario.activeMeals.forEach(mt => {
      const foodsInMeal = meals[mt] || [];
      const goodCombos = detectGoodCombos(foodsInMeal);
      const badCombos = detectBadCombos(foodsInMeal);
      const mealCombos = [...goodCombos, ...badCombos];

      allActiveCombos = [...allActiveCombos, ...mealCombos];

      // Find triggers specifically within this meal
      mealCombos.forEach(combo => {
        if (!comboTriggersByMeal[combo.id]) {
          const triggers: string[] = [];
          combo.requiredGroups.forEach(group => {
            const foundInGroup = foodsInMeal.filter(fId => group.includes(fId));
            if (foundInGroup.length > 0) triggers.push(...foundInGroup);
          });
          comboTriggersByMeal[combo.id] = [...new Set(triggers)];
        }
      });
    });

    const newDiscoveries = [];
    for (const combo of allActiveCombos) {
      if (!state.discoveredCombos.includes(combo.id)) {
        newDiscoveries.push({
          comboId: combo.id,
          foodIds: comboTriggersByMeal[combo.id] || []
        });
      }
    }

    if (newDiscoveries.length > 0) {
      set({
        discoveredCombos: [...state.discoveredCombos, ...newDiscoveries.map(d => d.comboId)],
        pendingComboDiscoveries: [...state.pendingComboDiscoveries, ...newDiscoveries],
        character: {
          ...state.character,
          coins: state.character.coins + (newDiscoveries.length * 100)
        }
      });
    }
  },

  dismissComboPopup: () => {
    set(state => ({
      pendingComboDiscoveries: state.pendingComboDiscoveries.slice(1)
    }));
  },

  selectMealType: (mealType: MealType) =>
    set(() => ({
      selectedMealType: mealType,
    })),

  // NEW: Tab persistence action
  setSelectedTier: (tier: number) => set({ selectedTier: tier }),

  saveState: () => {
    saveGameState(get());
  },

  loadState: () => {
    const saved = loadGameState();
    if (saved) {
      // Migration: convert old earnedCoins (number) to new format (CoinBreakdown)
      const migratedEarnedCoins: Record<string, CoinBreakdown> = {};
      if (saved.earnedCoins) {
        for (const [key, value] of Object.entries(saved.earnedCoins)) {
          if (typeof value === 'number') {
            migratedEarnedCoins[key] = {
              base: value, variety: 0, goodCombos: [], badCombos: [], thresholds: [], noHintBonus: 0, total: value,
            };
          } else {
            migratedEarnedCoins[key] = value as CoinBreakdown;
          }
        }
      }
      set({ ...saved, earnedCoins: migratedEarnedCoins });
    }
  },
}));

// Load persisted state on app start
useGameStore.subscribe(
  (state: GameState) => {
    saveGameState(state);
  }
);