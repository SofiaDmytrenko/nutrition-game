import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { SCENARIOS, FOOD_LIBRARY, calculateMealNutrition, detectGoodCombos, detectBadCombos } from '../data/nutritionModels';
import { InfoPopover } from './InfoPopover';
import { HintPopover } from './HintPopover';
import { ComboToast } from './ComboToast';

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

export function TopBar({ onBackToMenu }: { onBackToMenu: () => void }) {
  const { scenarioId, dailyMeals, character, purchasedHints } = useGameStore();
  const [infoOpen, setInfoOpen] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [autoFading, setAutoFading] = useState(false);
  const hintRef = useRef<HTMLButtonElement>(null);

  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const startFadeOut = (delay = 4000) => {
    clearTimers();
    setAutoFading(false);
    fadeTimer.current = setTimeout(() => setAutoFading(true), delay);
    closeTimer.current = setTimeout(() => setInfoOpen(false), delay + 1500);
  };

  const handleHoverEnter = () => {
    clearTimers();
    setAutoFading(false);
  };

  const handleHoverLeave = () => {
    startFadeOut(1500);
  };

  useEffect(() => {
    if (!scenarioId) return;
    setInfoOpen(true);
    startFadeOut(2000);
    return () => clearTimers();
  }, [scenarioId]);

  const scenario = scenarioId ? SCENARIOS.find(s => s.id === scenarioId) : null;

  const meals = (scenarioId && dailyMeals[scenarioId]) || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  let currentMealFoods: string[] = [];
  let allGoalsMet = true;

  if (scenario) {
    scenario.activeMeals.forEach(mt => {
      currentMealFoods = [...currentMealFoods, ...(meals[mt] || [])];
    });

    const nutrition = calculateMealNutrition(currentMealFoods, currentMealFoods.map(() => 1));

    scenario.primaryGoals?.forEach(goal => {
      const val = resolveNutrientValue(nutrition, goal.nutrientKey);
      if (goal.target != null && val < goal.target) allGoalsMet = false;
      if (goal.maxValue != null && val > goal.maxValue) allGoalsMet = false;
    });

    if (scenario.mealGoals) {
      scenario.activeMeals.forEach(mt => {
        const goals = scenario.mealGoals?.[mt];
        if (goals) {
          const mealFoods = meals[mt] || [];
          const mealNutrition = calculateMealNutrition(mealFoods, mealFoods.map(() => 1));
          goals.forEach(goal => {
            const val = resolveNutrientValue(mealNutrition, goal.nutrientKey);
            if (goal.target != null && val < goal.target) allGoalsMet = false;
            if (goal.maxValue != null && val > goal.maxValue) allGoalsMet = false;
          });
        }
      });
    }

    if (scenario.mustIncludeFoodTags && scenario.mustIncludeFoodTags.length > 0) {
      const hasAllRequiredTags = scenario.mustIncludeFoodTags.every(tag =>
        currentMealFoods.some(foodId => {
          const food = FOOD_LIBRARY.find(f => f.id === foodId);
          return food?.tags.includes(tag);
        })
      );
      if (!hasAllRequiredTags) allGoalsMet = false;
    }

    if (scenario.requiredFoodTags && scenario.requiredFoodTags.length > 0) {
      const allFoodsMatchStrictDiet = currentMealFoods.every(foodId => {
        const food = FOOD_LIBRARY.find(f => f.id === foodId);
        return food ? scenario.requiredFoodTags!.every(tag => food.tags.includes(tag)) : false;
      });
      if (!allFoodsMatchStrictDiet) allGoalsMet = false;
    }

    if (scenario.forbiddenFoodTags && scenario.forbiddenFoodTags.length > 0) {
      const hasForbiddenTag = currentMealFoods.some(foodId => {
        const food = FOOD_LIBRARY.find(f => f.id === foodId);
        return food ? scenario.forbiddenFoodTags!.some(tag => food.tags.includes(tag)) : false;
      });
      if (hasForbiddenTag) allGoalsMet = false;
    }

    if (scenario.requiredComboIds && scenario.requiredComboIds.length > 0) {
      const activeGoodCombos = detectGoodCombos(currentMealFoods).map(c => c.id);
      const hasAllRequiredCombos = scenario.requiredComboIds.every(id => activeGoodCombos.includes(id));
      if (!hasAllRequiredCombos) allGoalsMet = false;
    }

    if (scenario.forbiddenComboIds && scenario.forbiddenComboIds.length > 0) {
      const activeBadCombos = detectBadCombos(currentMealFoods).map(c => c.id);
      const hasTriggeredForbidden = scenario.forbiddenComboIds.some(id => activeBadCombos.includes(id));
      if (hasTriggeredForbidden) allGoalsMet = false;
    }

    if (currentMealFoods.length === 0) {
      allGoalsMet = false;
    }
  }

  if (!scenarioId || !scenario) return null;

  const scenarioHints = purchasedHints?.[scenario.id] ?? {};
  const boughtRichest = scenarioHints.topRichest ?? false;
  const boughtCombo = scenarioHints.comboPartner ?? false;
  const anyHintBought = boughtRichest || boughtCombo;

  const handleComplete = () => {
    if (!scenarioId || !allGoalsMet) return;
    useGameStore.getState().completeScenario(scenarioId);
    closeAll();
    onBackToMenu();
  };

  const openInfo = () => {
    clearTimers();
    setHintOpen(false);
    setInfoOpen(true);
    setAutoFading(false);
  };
  const openHint = () => {
    clearTimers();
    setInfoOpen(false);
    setAutoFading(false);
    setHintOpen(true);
  };
  const closeAll = () => {
    clearTimers();
    setInfoOpen(false);
    setHintOpen(false);
    setAutoFading(false);
  };

  const handlePurchaseHint = (hintType: string, cost: number) => {
    useGameStore.getState().purchaseHint(scenario.id, hintType, cost);
  };

  return (
    <>
      {/* ── Sticky Header ── */}
      <div
        className="sticky top-0 z-20 flex items-center px-6 py-3"
        style={{
          backgroundColor: 'var(--bg-interactive)',
          borderBottom: '2px solid var(--border-light)',
          boxShadow: '0 4px 6px -4px rgba(0,0,0,0.05)',
          fontFamily: "'Nunito', sans-serif"
        }}
      >
        {/* Left: Back + Title + ℹ️ (flex-1) */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={() => { closeAll(); onBackToMenu(); }}
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all shrink-0 shadow-sm"
            style={{
              backgroundColor: 'var(--bg-dark)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              border: '1px solid var(--border-light)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'var(--feedback-warn-bg)';
              e.currentTarget.style.color = 'var(--feedback-warn-text)';
              e.currentTarget.style.borderColor = 'var(--accent-cream)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-light)';
            }}
          >
            ← Back
          </button>

          <h2 className="text-base font-bold min-w-0 truncate uppercase tracking-wider" style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif", letterSpacing: '0.05em' }}>
            {scenario.title}
          </h2>

          <button
            type="button"
            onClick={openInfo}
            className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all"
            style={{
              backgroundColor: infoOpen ? 'var(--feedback-warn-bg)' : 'var(--bg-dark)',
              color: infoOpen ? 'var(--feedback-warn-text)' : 'var(--text-secondary)',
              cursor: 'pointer',
              border: `1px solid ${infoOpen ? 'var(--accent-cream)' : 'var(--border-light)'}`,
            }}
            onMouseEnter={e => {
              if (!infoOpen) {
                e.currentTarget.style.backgroundColor = 'var(--feedback-warn-bg)';
                e.currentTarget.style.color = 'var(--feedback-warn-text)';
                e.currentTarget.style.borderColor = 'var(--accent-cream)';
              }
            }}
            onMouseLeave={e => {
              if (!infoOpen) {
                e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }
            }}
          >
            ?
          </button>
        </div>

        {/* Center: Combo Toast (flex-1) */}
        <div className="flex-1 flex justify-center items-center">
          <ComboToast />
        </div>

        {/* Right: Coins + Hint + Complete (flex-1) */}
        <div className="flex items-center gap-3 justify-end shrink-0 flex-1">
          <div className="text-sm font-bold px-4 py-2 flex items-center gap-2"
            style={{ color: 'var(--feedback-warn-text)' }}>
            <span className="text-base">💰</span> {character.coins}
          </div>

          <button
            ref={hintRef}
            type="button"
            onClick={openHint}
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
            style={{
              backgroundColor: anyHintBought ? 'var(--accent-green)' : 'var(--bg-dark)',
              color: anyHintBought ? 'white' : 'var(--accent-cream)',
              cursor: 'pointer',
              border: `1px solid ${anyHintBought ? 'var(--accent-green)' : 'var(--border-light)'}`,
            }}
          >
            💡 {anyHintBought ? '✓' : ''}
          </button>

          <button
            type="button"
            onClick={handleComplete}
            disabled={!allGoalsMet}
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            style={{
              backgroundColor: allGoalsMet ? 'var(--accent-green)' : 'var(--bg-dark)',
              color: allGoalsMet ? 'white' : 'var(--text-secondary)',
              cursor: allGoalsMet ? 'pointer' : 'not-allowed',
              opacity: allGoalsMet ? 1 : 0.5,
              border: `1px solid ${allGoalsMet ? 'var(--accent-green)' : 'var(--border-light)'}`,
            }}
          >
            {allGoalsMet ? '✓ Complete' : 'Complete'}
          </button>
        </div>
      </div>

      <InfoPopover
        isOpen={infoOpen}
        onClose={() => { setInfoOpen(false); setAutoFading(false); }}
        scenario={scenario}
        fadingOut={autoFading}
        animateIn={true}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      />

      <HintPopover
        isOpen={hintOpen}
        onClose={() => setHintOpen(false)}
        anchorRef={hintRef}
        scenario={scenario}
        purchasedHints={scenarioHints}
        onPurchase={handlePurchaseHint}
      />
    </>
  );
}