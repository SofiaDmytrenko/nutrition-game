// HintPopover.tsx — 4-Tier Hint System (Rewritten)
import type { Scenario, Food, ScenarioGoal, MealType } from '../data/nutritionModels';
import { FOOD_LIBRARY, calculateMealNutrition, detectGoodCombos, GOOD_COMBOS } from '../data/nutritionModels';
import { useGameStore } from '../store/gameStore';
import { Popover } from './Popover';
import type { RefObject } from 'react';

const GOLD = '#D4AF37';

interface HintPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  scenario: Scenario;
  purchasedHints: Record<string, boolean | number>;
  onPurchase: (hintType: string, cost: number) => void;
}

const HINT_COSTS = {
  A: 50,
  B: 100,
  C: 150,
  D: 200,
};

// Create a quick lookup for combo labels
const COMBO_MAP = Object.fromEntries(GOOD_COMBOS.map(c => [c.id, c.shortLabel]));

// Helper to map nutrient keys to object paths
const resolveNutrientValue = (nutritionResult: any, key: string): number => {
  const pathMap: Record<string, string> = {
    calories: 'calories', water: 'water', protein: 'protein', carbs: 'carbs', fat: 'fat', fiber: 'fiber',
    iron: 'ironMg', calcium: 'calciumMg', potassium: 'potassiumMg', sodium: 'sodiumMg', magnesium: 'magnesiumMg', zinc: 'zincMg',
    vitaminC: 'vitaminCMg', vitaminD: 'vitaminDMcg', vitaminB: 'vitaminBMcg', vitaminK: 'vitaminKMcg', folate: 'folateMcg', vitaminA: 'vitaminAMcg', vitaminE: 'vitaminEMg',
    omega3: 'omega3Mg', omega6: 'omega6Mg', oleicAcid: 'oleicAcidG',
    probiotics: 'probioticsCFU', prebioticFiber: 'prebioticFiberG',
  };
  const realKey = pathMap[key];
  return realKey ? (nutritionResult[realKey] || 0) : 0;
};

// ─── Organic food mini-card ───────────────────────────────────────
function FoodMiniCard({ food }: { food: Food }) {
  return (
    <div className="flex flex-col items-center text-center p-1" style={{
      backgroundColor: 'var(--bg-dark)',
      borderRadius: '8px 3px 8px 3px',
      border: `1px solid ${GOLD}66`,
      minWidth: '64px',
    }}>
      <img
        src={`/food/${food.id}.svg`}
        alt={food.name}
        className="w-6 h-6 object-contain mb-0.5"
      />
      <span className="text-[10px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{food.shortName}</span>
    </div>
  );
}

export function HintPopover({ isOpen, onClose, anchorRef, scenario, purchasedHints, onPurchase }: HintPopoverProps) {
  const { dailyMeals, unlockedFoods, character } = useGameStore();

  const meals = dailyMeals[scenario.id] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  // Aggregate foods for general checks
  let currentMealFoods: string[] = [];
  scenario.activeMeals.forEach(mt => {
    currentMealFoods = [...currentMealFoods, ...(meals[mt] || [])];
  });

  const isAllowedByScenario = (food: Food) => {
    if (scenario.forbiddenFoodTags?.some(tag => food.tags.includes(tag))) return false;
    if (scenario.requiredFoodTags && scenario.requiredFoodTags.length > 0) {
      if (!scenario.requiredFoodTags.some(tag => food.tags.includes(tag))) return false;
    }
    return true;
  };
  const availableFoods = FOOD_LIBRARY.filter(f => unlockedFoods.includes(f.id) && isAllowedByScenario(f));

  const getFoodNutrientValue = (food: Food, key: string): number => {
    if (key === 'calories') return food.calories;
    if (key === 'protein') return food.macronutrients.protein;
    if (key === 'carbs') return food.macronutrients.carbs;
    if (key === 'fat') return food.macronutrients.fat;
    if (key === 'fiber') return food.macronutrients.fiber;
    if (key === 'water') return food.macronutrients.water;
    if (key === 'iron') return food.micronutrients.ironMg;
    if (key === 'calcium') return food.micronutrients.calciumMg;
    if (key === 'potassium') return food.micronutrients.potassiumMg;
    if (key === 'sodium') return food.micronutrients.sodiumMg;
    if (key === 'magnesium') return food.micronutrients.magnesiumMg;
    if (key === 'zinc') return food.micronutrients.zincMg;
    if (key === 'vitaminC') return food.micronutrients.vitaminCMg;
    if (key === 'vitaminD') return food.micronutrients.vitaminDMcg;
    if (key === 'vitaminB') return food.micronutrients.vitaminBMcg;
    if (key === 'vitaminK') return food.micronutrients.vitaminKMcg;
    if (key === 'folate') return food.micronutrients.folateMcg;
    if (key === 'vitaminA') return food.micronutrients.vitaminAMcg;
    if (key === 'vitaminE') return food.micronutrients.vitaminEMg;
    if (key === 'omega3') return food.micronutrients.omega3Mg;
    if (key === 'probiotics') return food.micronutrients.probioticsCFU;
    if (key === 'prebioticFiber') return food.micronutrients.prebioticFiberG;
    return 0;
  };

  // ─── Goal Checking Logic ───────────────────────────────────────
  const isGoalMet = (goal: ScenarioGoal, mealType?: MealType): boolean => {
    const foodsToCheck = mealType ? (meals[mealType] || []) : currentMealFoods;
    const nutrition = calculateMealNutrition(foodsToCheck, foodsToCheck.map(() => 1));
    const val = resolveNutrientValue(nutrition, goal.nutrientKey);

    if (goal.target != null && val < goal.target) return false;
    if (goal.maxValue != null && val > goal.maxValue) return false;
    return true;
  };

  // Aggregate ALL unmet goals (Primary + Meal Goals)
  let allUnmetGoals: { goal: ScenarioGoal; mealType?: MealType }[] = [];

  scenario.primaryGoals?.forEach(g => {
    if (!isGoalMet(g)) allUnmetGoals.push({ goal: g });
  });

  scenario.activeMeals.forEach(mt => {
    scenario.mealGoals?.[mt]?.forEach(g => {
      if (!isGoalMet(g, mt)) allUnmetGoals.push({ goal: g, mealType: mt });
    });
  });

  // Pick a RANDOM unmet goal to hint towards
  const selectedUnmetGoal = allUnmetGoals.length > 0
    ? allUnmetGoals[Math.floor(Math.random() * allUnmetGoals.length)]
    : null;

  // ─── Hint A: Top 3 Sources (Independent) ───────────────────────
  let hintAFoods: Food[] = [];
  if (selectedUnmetGoal) {
    const key = selectedUnmetGoal.goal.nutrientKey;
    hintAFoods = [...availableFoods]
      .sort((a, b) => getFoodNutrientValue(b, key) - getFoodNutrientValue(a, key))
      .slice(0, 3);
  }

  // ─── Hint B: Combo Partner (Independent) ───────────────────────
  let hintBTarget: Food | null = null;
  let hintBPartner: Food | null = null;
  let hintBAvailable = false;

  if (selectedUnmetGoal) {
    const key = selectedUnmetGoal.goal.nutrientKey;
    const sortedFoodsForGoal = [...availableFoods].sort((a, b) => getFoodNutrientValue(b, key) - getFoodNutrientValue(a, key));

    // Find the best food for the goal that ALSO has a combo partner
    for (const targetFood of sortedFoodsForGoal) {
      for (const partner of availableFoods) {
        if (partner.id === targetFood.id) continue;
        const testCombos = detectGoodCombos([targetFood.id, partner.id]);
        if (testCombos.length > 0) {
          hintBTarget = targetFood;
          hintBPartner = partner;
          hintBAvailable = true;
          break;
        }
      }
      if (hintBAvailable) break;
    }
  }

  // ─── Hint C: Tag Translator ────────────────────────────────────
  const tagsToCheck = [...(scenario.requiredFoodTags || []), ...(scenario.mustIncludeFoodTags || [])];
  const missingTags = tagsToCheck.filter(tag => !currentMealFoods.some(foodId => FOOD_LIBRARY.find(f => f.id === foodId)?.tags.includes(tag)));
  const hintCTag = missingTags[0];
  let hintCFoods: Food[] = [];
  if (hintCTag) {
    hintCFoods = availableFoods.filter(f => f.tags.includes(hintCTag)).slice(0, 3);
  }

  // ─── Hint D: Combo Solution ────────────────────────────────────
  const activeGoodCombos = detectGoodCombos(currentMealFoods).map(c => c.id);
  const missingRequiredCombos = (scenario.requiredComboIds || []).filter(id => !activeGoodCombos.includes(id));

  // We only allow buying D once, so we only solve the first missing combo
  const currentComboToSolve = missingRequiredCombos[0];

  let hintDTarget: Food | null = null;
  let hintDPartner: Food | null = null;

  if (currentComboToSolve) {
    for (const food1 of availableFoods) {
      for (const food2 of availableFoods) {
        if (food1.id === food2.id) continue;
        const triggeredCombos = detectGoodCombos([food1.id, food2.id]);
        if (triggeredCombos.some(c => c.id === currentComboToSolve)) {
          hintDTarget = food1;
          hintDPartner = food2;
          break;
        }
      }
      if (hintDTarget) break;
    }
  }

  // ─── Availability & Completion States ──────────────────────────
  const isHintAvailable = {
    A: !!selectedUnmetGoal,
    B: hintBAvailable,
    C: !!hintCTag,
    D: !!currentComboToSolve && !!hintDTarget,
  };

  const isHintCompleted = {
    A: !!selectedUnmetGoal && isGoalMet(selectedUnmetGoal.goal, selectedUnmetGoal.mealType),
    B: hintBAvailable && !!selectedUnmetGoal && isGoalMet(selectedUnmetGoal.goal, selectedUnmetGoal.mealType),
    C: missingTags.length === 0 && tagsToCheck.length > 0,
    D: missingRequiredCombos.length === 0 && (scenario.requiredComboIds || []).length > 0,
  };

  // ─── Render Logic ──────────────────────────────────────────────
  const renderHintButton = (type: 'A' | 'B' | 'C' | 'D', title: string, description: string, content: React.ReactNode) => {
    const isBought = purchasedHints[type] !== undefined;
    const isAvailable = isHintAvailable[type];
    const canAfford = character.coins >= HINT_COSTS[type];
    const isCompleted = isHintCompleted[type];

    if (!isAvailable && !isBought) return null;

    return (
      <div className="p-2 mb-2 relative" style={{
        backgroundColor: 'var(--bg-dark)',
        border: `1px solid ${GOLD}66`,
        borderRadius: '12px 4px 12px 4px',
        opacity: isCompleted ? 0.5 : 1,
        transition: 'opacity 0.3s ease',
      }}>
        {/* Completed Overlay Text */}
        {isCompleted && isBought && (
          <div className="absolute top-1 right-12 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--accent-green)', color: 'white' }}>
            DONE
          </div>
        )}

        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-bold" style={{ color: 'var(--text-secondary)', fontFamily: "'Fraunces', serif" }}>{title}</span>
          <button
            type="button"
            onClick={() => onPurchase(type, HINT_COSTS[type])}
            disabled={isBought || !canAfford || isCompleted}
            className="text-xs font-bold px-2.5 py-1 transition-all"
            style={{
              backgroundColor: isBought ? 'var(--accent-green)' : canAfford ? 'var(--feedback-warn-text)' : 'var(--bg-interactive)',
              color: isBought ? 'white' : canAfford ? 'white' : 'var(--text-secondary)',
              cursor: (isBought || !canAfford || isCompleted) ? 'not-allowed' : 'pointer',
              opacity: isBought ? 1 : canAfford ? 1 : 0.5,
              border: 'none',
              borderRadius: '10px 4px 10px 4px',
            }}
          >
            {isBought ? '✓' : `💰 ${HINT_COSTS[type]}`}
          </button>
        </div>
        <p className="text-[11px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>{description}</p>

        {/* Always show content if bought, even if completed */}
        {isBought && (
          <div className="mt-1.5 pt-1.5 border-t" style={{ borderColor: 'var(--border-light)' }}>
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <Popover isOpen={isOpen} onClose={onClose} anchorRef={anchorRef} width={340}>
      <div className="p-4 relative" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-sm font-bold transition-all absolute top-3 right-3"
          style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-light)', borderRadius: '10px 4px 10px 4px', cursor: 'pointer', color: 'var(--text-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >✕</button>

        <h3 className="text-base font-bold mb-3" style={{ color: 'var(--accent-orange)', fontFamily: "'Fraunces', serif" }}>💡 Hints & Assistance</h3>

        {renderHintButton('A', 'Top 3 Sources', `Shows 3 foods richest in your missing nutrient${selectedUnmetGoal?.mealType ? ` (${selectedUnmetGoal.mealType})` : ''}.`,
          <div className="flex gap-2 mt-2 justify-center">
            {hintAFoods.map(f => <FoodMiniCard key={f.id} food={f} />)}
          </div>
        )}

        {renderHintButton('B', 'Combo Partner', 'Shows a top food + its combo partner.',
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-xs text-center" style={{ color: 'var(--accent-green)' }}>
              Triggers a combo & rich in {selectedUnmetGoal?.goal.nutrientKey}!
            </p>
            <div className="flex gap-3 mt-1 justify-center items-center">
              {hintBTarget && <FoodMiniCard food={hintBTarget} />}
              <span className="text-lg font-bold" style={{ color: GOLD }}>+</span>
              {hintBPartner && <FoodMiniCard food={hintBPartner} />}
            </div>
          </div>
        )}

        {renderHintButton('C', 'Tag Translator', 'Shows 3 foods that satisfy a required diet tag.',
          <div className="flex flex-col gap-2 mt-1.5">
            <span className="text-xs text-center" style={{ color: 'var(--accent-green)' }}>For {hintCTag} diet, try:</span>
            <div className="flex gap-2 justify-center">
              {hintCFoods.map(f => <FoodMiniCard key={f.id} food={f} />)}
            </div>
          </div>
        )}

        {renderHintButton('D', 'Combo Solution', 'Reveals two specific foods that trigger the required combo.',
          <div className="flex flex-col gap-2 mt-1.5">
            <p className="text-xs text-center" style={{ color: 'var(--accent-green)' }}>
              Triggers: {COMBO_MAP[currentComboToSolve!] || 'Required Combo'}
            </p>
            <div className="flex gap-3 mt-1 justify-center items-center">
              {hintDTarget && <FoodMiniCard food={hintDTarget} />}
              <span className="text-lg font-bold" style={{ color: GOLD }}>+</span>
              {hintDPartner && <FoodMiniCard food={hintDPartner} />}
            </div>
          </div>
        )}

        {!isHintAvailable.A && !isHintAvailable.C && !isHintAvailable.D && (
          <p className="text-xs text-center mt-4" style={{ color: 'var(--text-secondary)' }}>No hints available for this scenario.</p>
        )}
      </div>
    </Popover>
  );
}