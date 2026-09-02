import type { MealType, GoodCombo, BadCombo, ScenarioGoal, Food } from '../data/nutritionModels';
import {
  SCENARIOS,
  calculateMealNutrition,
  detectGoodCombos,
  detectBadCombos,
  detectThresholdPenalties,
  FOOD_LIBRARY,
  GOOD_COMBOS,
  BAD_COMBOS,
} from '../data/nutritionModels';
import { useGameStore } from '../store/gameStore';

const resolveNutrientValue = (nutritionResult: any, key: string): number => {
  const pathMap: Record<string, string> = {
    calories: 'calories', water: 'water', protein: 'protein', carbs: 'carbs', fat: 'fat', fiber: 'fiber',
    iron: 'ironMg', calcium: 'calciumMg', potassium: 'potassiumMg', sodium: 'sodiumMg', magnesium: 'magnesiumMg', zinc: 'zincMg',
    vitaminC: 'vitaminCMg', vitaminD: 'vitaminDMcg', vitaminB: 'vitaminBMcg', vitaminK: 'vitaminKMcg', folate: 'folateMcg', vitaminA: 'vitaminAMcg', vitaminE: 'vitaminEMg',
    omega3: 'omega3Mg', omega6: 'omega6Mg', oleicAcid: 'oleicAcidG',
    lycopene: 'lycopeneMcg', betaCarotene: 'betaCaroteneMcg', lutein: 'luteinMcg', anthocyaninsMg: 'anthocyaninsMg', probiotics: 'probioticsCFU', prebioticFiber: 'prebioticFiberG',
  };
  const realKey = pathMap[key];
  return realKey ? (nutritionResult[realKey] || 0) : 0;
};

const NUTRIENT_DISPLAY_NAMES: Record<string, string> = {
  calories: 'Calories', water: 'Water', protein: 'Protein', carbs: 'Carbs', fat: 'Fat', fiber: 'Fiber',
  iron: 'Iron', calcium: 'Calcium', potassium: 'Potassium', sodium: 'Sodium', magnesium: 'Magnesium', zinc: 'Zinc',
  vitaminC: 'Vitamin C', vitaminD: 'Vitamin D', vitaminB: 'Vitamin B', vitaminK: 'Vitamin K', folate: 'Folate', vitaminA: 'Vitamin A', vitaminE: 'Vitamin E',
  omega3: 'Omega-3', omega6: 'Omega-6', oleicAcid: 'Oleic Acid',
  probiotics: 'Probiotics', prebioticFiber: 'Prebiotic Fiber',
};

const MEALTYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks',
};

// Dynamic lookup map for combos
const ALL_COMBOS_MAP = Object.fromEntries([...GOOD_COMBOS, ...BAD_COMBOS].map(c => [c.id, c]));

// Helper to generate tooltip text for combo triggers
const getTriggerTooltip = (comboData: { mealType: MealType; triggers: string[] }[]): string => {
  if (comboData.length === 0) return '';
  const mealStrings = comboData.map(cd => {
    const names = cd.triggers.map(id => FOOD_LIBRARY.find(f => f.id === id)?.shortName).filter(Boolean).join(', ');
    return `${MEALTYPE_LABELS[cd.mealType]} (${names})`;
  });
  return `Triggered in: ${mealStrings.join(' & ')}`;
};

export function GoalsPanel() {
  const { scenarioId, dailyMeals } = useGameStore();
  if (!scenarioId) return null;

  const scenario = SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) return null;

  const meals = dailyMeals[scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  // Aggregate foods for general checks
  let currentMealFoods: string[] = [];
  scenario.activeMeals.forEach(mt => {
    currentMealFoods = [...currentMealFoods, ...(meals[mt] || [])];
  });

  // ─── PER-MEAL COMBO DETECTION ──────────────────────────────────
  // Returns an array of unique combo IDs triggered, plus data for tooltips
  let allActiveCombos: { id: string; type: 'good' | 'bad'; mealType: MealType; triggers: string[] }[] = [];

  scenario.activeMeals.forEach(mt => {
    const foodsInMeal = meals[mt] || [];
    const goodCombos = detectGoodCombos(foodsInMeal);
    const badCombos = detectBadCombos(foodsInMeal);

    [...goodCombos, ...badCombos].forEach(combo => {
      const triggers: string[] = [];
      combo.requiredGroups.forEach(group => {
        const foundInGroup = foodsInMeal.filter(fId => group.includes(fId));
        if (foundInGroup.length > 0) triggers.push(...foundInGroup);
      });

      allActiveCombos.push({
        id: combo.id,
        type: goodCombos.includes(combo as GoodCombo) ? 'good' : 'bad',
        mealType: mt,
        triggers: [...new Set(triggers)]
      });
    });
  });

  // Group by combo ID to avoid UI duplicates, but keep all trigger data for tooltip
  const groupedCombos: Record<string, typeof allActiveCombos> = {};
  allActiveCombos.forEach(c => {
    if (!groupedCombos[c.id]) groupedCombos[c.id] = [];
    groupedCombos[c.id].push(c);
  });

  const goodIds = Object.keys(groupedCombos).filter(id => groupedCombos[id][0].type === 'good');
  const badIds = Object.keys(groupedCombos).filter(id => groupedCombos[id][0].type === 'bad');

  const requiredIds = scenario.requiredComboIds ?? [];
  const forbiddenIds = scenario.forbiddenComboIds ?? [];

  const combos = {
    requiredTriggered: requiredIds.filter(id => goodIds.includes(id)),
    requiredMissing: requiredIds.filter(id => !goodIds.includes(id)),
    forbiddenTriggered: forbiddenIds.filter(id => badIds.includes(id)),
    forbiddenClean: forbiddenIds.filter(id => !badIds.includes(id)),
    bonusGood: goodIds.filter(id => !requiredIds.includes(id)),
    bonusBad: badIds.filter(id => !forbiddenIds.includes(id)),
  };

  const thresholdViolations = detectThresholdPenalties(meals, scenario.activeMeals);

  // ─── PER-MEAL VARIETY BONUS ────────────────────────────────────
  const SUBSTANTIVE_CATEGORIES = ['meat-fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts-legumes'];
  let varietyBase = 0;
  let hasBalanced = false;

  scenario.activeMeals.forEach(mt => {
    const foodsInMeal = meals[mt] || [];
    const categoriesIncluded = new Set(
      foodsInMeal
        .map(foodId => FOOD_LIBRARY.find((f: Food) => f.id === foodId)?.category)
        .filter(cat => cat && SUBSTANTIVE_CATEGORIES.includes(cat)) as string[]
    );

    if (categoriesIncluded.size >= 6) varietyBase += 6;
    else if (categoriesIncluded.size >= 5) varietyBase += 4;
    else if (categoriesIncluded.size >= 4) varietyBase += 2;

    const hasProtein = categoriesIncluded.has('meat-fish') || categoriesIncluded.has('nuts-legumes');
    const hasVeggies = categoriesIncluded.has('vegetables');
    const hasGrains = categoriesIncluded.has('grains');
    const hasDairy = categoriesIncluded.has('dairy');
    if (hasProtein && hasVeggies && hasGrains && hasDairy) hasBalanced = true;
  });

  const showRules = (scenario.requiredComboIds?.length ?? 0) > 0 || (scenario.forbiddenComboIds?.length ?? 0) > 0;
  const showBonus = combos.bonusGood.length > 0 || combos.bonusBad.length > 0 || varietyBase > 0 || hasBalanced || thresholdViolations.length > 0;

  // Dynamically generate header label based on active meals
  const activeMealLabels = scenario.activeMeals.map(mt => MEALTYPE_LABELS[mt]);
  let headerLabel = activeMealLabels.join(' & ');
  if (scenario.activeMeals.length === 4) headerLabel = 'Full Day Intake';
  else if (scenario.activeMeals.length === 2) headerLabel = `${activeMealLabels[0]} + ${activeMealLabels[1]}`;
  else if (scenario.activeMeals.length === 1) headerLabel = `${activeMealLabels[0]} (Single Meal)`;

  // Helper component for rendering a single goal row
  const renderGoalRow = (goal: ScenarioGoal, foods: string[]) => {
    const nutrition = calculateMealNutrition(foods, foods.map(() => 1));
    const currentVal = resolveNutrientValue(nutrition, goal.nutrientKey);
    const target = goal.target ?? 0;
    const displayName = NUTRIENT_DISPLAY_NAMES[goal.nutrientKey] ?? goal.nutrientKey;
    const unit = goal.unitLabel ?? '';

    let met = true;
    if (goal.target != null && currentVal < goal.target) met = false;
    if (goal.maxValue != null && currentVal > goal.maxValue) met = false;

    let progressPct = 0;
    if (goal.target != null && goal.maxValue == null) progressPct = Math.min(100, (currentVal / target) * 100);
    else if (goal.maxValue != null && goal.target == null) progressPct = Math.max(0, 100 - ((currentVal / goal.maxValue) * 100));
    else if (goal.target != null && goal.maxValue != null) progressPct = Math.min(100, (currentVal / target) * 100);

    let displayText = '';
    if (goal.target != null && goal.maxValue == null) displayText = `${currentVal.toFixed(1)} / ${target}${unit}`;
    else if (goal.maxValue != null && goal.target == null) displayText = `${currentVal.toFixed(1)} / max ${goal.maxValue}${unit}`;
    else if (goal.target != null && goal.maxValue != null) displayText = `${currentVal.toFixed(1)} / ${target}${unit} (max ${goal.maxValue}${unit})`;

    return (
      <div key={`${goal.nutrientKey}-${foods.length}`} className="space-y-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color: met ? 'var(--accent-green)' : 'var(--text-primary)' }}>
            {displayName}
          </span>
          <span className="text-xs font-bold" style={{ color: met ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
            {met ? '✓ ' : ''}{displayText}
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-dark)' }}>
          <div className="h-2 rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: met ? 'var(--accent-green)' : 'var(--accent-cream)' }} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4" style={{ backgroundColor: 'var(--bg-interactive)', fontFamily: "'Nunito', sans-serif" }}>

      {/* ── MEAL HEADER ── */}
      <div className="pb-1 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <h6
          className="text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap"
          style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif", borderColor: 'var(--border-light)' }}
        >
          🍽️ {headerLabel}
        </h6>
      </div>

      {/* ── GOALS ── */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-orange)', fontFamily: "'Fraunces', serif" }}>Goals</p>

        {/* Render Per-Meal Goals if they exist */}
        {scenario.mealGoals && (
          <div className="space-y-4">
            {scenario.activeMeals.map(mt => {
              const goals = scenario.mealGoals?.[mt];
              if (!goals || goals.length === 0) return null;
              const foods = meals[mt] || [];
              return (
                <div key={mt} className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>{MEALTYPE_LABELS[mt]}</p>
                  {goals.map(goal => renderGoalRow(goal, foods))}
                </div>
              );
            })}
          </div>
        )}

        {/* Render Primary (Total) Goals if they exist */}
        {scenario.primaryGoals && (
          <div>
            {scenario.mealGoals && <p className="text-[10px] font-bold uppercase mb-2 mt-2" style={{ color: 'var(--text-secondary)' }}>Total Combined</p>}
            {scenario.primaryGoals?.map(goal => renderGoalRow(goal, currentMealFoods))}
          </div>
        )}
      </div>

      {/* ── RULES (Combos & Tags) ── */}
      {(showRules || scenario.mustIncludeFoodTags?.length || scenario.requiredFoodTags?.length || scenario.forbiddenFoodTags?.length) ? (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-orange)', fontFamily: "'Fraunces', serif" }}>Rules</p>

          {/* Strict Diet Tags (ALL foods must have this) */}
          {scenario.requiredFoodTags?.map(tag => {
            const hasTag = currentMealFoods.length > 0 && currentMealFoods.every(foodId => FOOD_LIBRARY.find(f => f.id === foodId)?.tags.includes(tag));
            return (
              <div key={tag} className="flex items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: hasTag ? 'var(--accent-green)' : 'var(--feedback-bad-text)' }}>
                  {hasTag ? '✓' : '⚠'}
                </span>
                <span className="font-semibold" style={{ color: hasTag ? 'var(--accent-green)' : 'var(--feedback-bad-text)' }}>
                  Strict Diet: All foods must be {tag}
                </span>
              </div>
            );
          })}

          {/* Must Include Tags (At least one food must have this) */}
          {scenario.mustIncludeFoodTags?.map(tag => {
            const hasTag = currentMealFoods.some(foodId => FOOD_LIBRARY.find(f => f.id === foodId)?.tags.includes(tag));
            return (
              <div key={tag} className="flex items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: hasTag ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                  {hasTag ? '✓' : '○'}
                </span>
                <span className="font-semibold" style={{ color: hasTag ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                  Must include: {tag}
                </span>
              </div>
            );
          })}

          {/* Forbidden Tags (NO foods can have this) */}
          {scenario.forbiddenFoodTags?.map(tag => {
            const isClean = !currentMealFoods.some(foodId => FOOD_LIBRARY.find(f => f.id === foodId)?.tags.includes(tag));
            return (
              <div key={tag} className="flex items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: isClean ? 'var(--accent-green)' : 'var(--feedback-bad-text)' }}>
                  {isClean ? '✓' : '⚠'}
                </span>
                <span className="font-semibold" style={{ color: isClean ? 'var(--accent-green)' : 'var(--feedback-bad-text)' }}>
                  Must avoid: {tag}
                </span>
              </div>
            );
          })}

          {/* Required Good Combos */}
          {combos.requiredTriggered.map(id => {
            const combo = ALL_COMBOS_MAP[id] as GoodCombo;
            if (!combo) return null;
            const tooltipText = getTriggerTooltip(groupedCombos[id]);
            return (
              <div key={id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span title={tooltipText} className="font-bold cursor-help" style={{ color: 'var(--accent-green)' }}>✓</span>
                  <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>{combo.shortLabel}</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--accent-green)' }}>+{combo.coinsBonus} 💰</span>
              </div>
            );
          })}
          {combos.requiredMissing.map(id => {
            const combo = ALL_COMBOS_MAP[id] as GoodCombo;
            if (!combo) return null;
            return (
              <div key={id} className="flex items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: 'var(--text-secondary)' }}>○</span>
                <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>{combo.shortLabel} (Required)</span>
              </div>
            );
          })}

          {/* Required Bad Combos (Must Avoid) */}
          {combos.forbiddenClean.map(id => {
            const combo = ALL_COMBOS_MAP[id] as BadCombo;
            if (!combo) return null;
            return (
              <div key={id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: 'var(--accent-green)' }}>✓</span>
                  <span className="font-semibold" style={{ color: 'var(--accent-green)' }}>Avoid: {combo.shortLabel}</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--accent-green)' }}>+{combo.coinsPenalty} 💰</span>
              </div>
            );
          })}
          {combos.forbiddenTriggered.map(id => {
            const combo = ALL_COMBOS_MAP[id] as BadCombo;
            if (!combo) return null;
            const tooltipText = getTriggerTooltip(groupedCombos[id]);
            return (
              <div key={id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span title={tooltipText} className="font-bold cursor-help" style={{ color: 'var(--feedback-bad-text)' }}>⚠</span>
                  <span className="font-semibold" style={{ color: 'var(--feedback-bad-text)' }}>Triggered: {combo.shortLabel}</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--feedback-bad-text)' }}>-{combo.coinsPenalty} 💰</span>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ── BONUS ── */}
      {showBonus && (
        <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-orange)', fontFamily: "'Fraunces', serif" }}>Feedback</p>

          {/* Variety Bonus */}
          {varietyBase > 0 && (
            <div className="flex justify-between items-center text-xs">
              <span style={{ color: 'var(--text-primary)' }}>Variety Bonus</span>
              <span className="font-bold" style={{ color: 'var(--accent-cream)' }}>+{varietyBase} 💰</span>
            </div>
          )}
          {hasBalanced && (
            <div className="flex justify-between items-center text-xs">
              <span style={{ color: 'var(--text-primary)' }}>Balanced Plate (Prot/Veg/Grain/Dairy)</span>
              <span className="font-bold" style={{ color: 'var(--accent-cream)' }}>+5 💰</span>
            </div>
          )}

          {/* Extra Good Combos */}
          {combos.bonusGood.map(id => {
            const combo = ALL_COMBOS_MAP[id] as GoodCombo;
            if (!combo) return null;
            const tooltipText = getTriggerTooltip(groupedCombos[id]);
            return (
              <div key={id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span title={tooltipText} className="font-bold cursor-help" style={{ color: 'var(--accent-green)' }}>✓</span>
                  <span style={{ color: 'var(--text-primary)' }}>{combo.shortLabel}</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--accent-green)' }}>+{combo.coinsBonus} 💰</span>
              </div>
            );
          })}

          {/* Extra Bad Combos */}
          {combos.bonusBad.map(id => {
            const combo = ALL_COMBOS_MAP[id] as BadCombo;
            if (!combo) return null;
            const tooltipText = getTriggerTooltip(groupedCombos[id]);
            return (
              <div key={id} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span title={tooltipText} className="font-bold cursor-help" style={{ color: 'var(--feedback-bad-text)' }}>⚠</span>
                  <span style={{ color: 'var(--text-primary)' }}>{combo.shortLabel}</span>
                </div>
                <span className="font-bold" style={{ color: 'var(--feedback-bad-text)' }}>-{combo.coinsPenalty} 💰</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── WARNINGS (Thresholds) ── */}
      {thresholdViolations.length > 0 && (
        <div className="space-y-1.5">
          {thresholdViolations.map(v => (
            <div key={v.id} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: 'var(--feedback-bad-text)' }}>⚠</span>
                <span style={{ color: 'var(--text-primary)' }}>{v.label}</span>
              </div>
              <span className="font-bold" style={{ color: 'var(--feedback-bad-text)' }}>-{v.penalty} 💰</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}