import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { SCENARIOS, FOOD_LIBRARY, type Food, type MealType } from '../data/nutritionModels';

export function MealSummary() {
  const { dailyMeals, selectedMealType, selectMealType, removeMealFromDay, scenarioId } = useGameStore();
  const [expandedMeals, setExpandedMeals] = useState<Set<MealType>>(new Set(['breakfast', 'lunch', 'dinner', 'snacks']));

  // Fetch scenario safely at the top
  const scenario = SCENARIOS.find(s => s.id === scenarioId);

  // Safe lookup using optional chaining
  const meals = (scenarioId && dailyMeals[scenarioId]) || { breakfast: [], lunch: [], dinner: [], snacks: [] };

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const mealLabels: Record<MealType, string> = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',
  };

  // Slot Category Definitions (matching gameStore logic)
  const MAIN_CATEGORIES = ['meat-fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts-legumes', 'snacks'];
  const CONDIMENT_CATEGORIES = ['seasonings-fats'];
  const DRINK_CATEGORIES = ['drinks'];

  // Auto-expand ONLY the active meals for the scenario
  useEffect(() => {
    if (!scenarioId || !scenario) return;
    setExpandedMeals(new Set(scenario.activeMeals));
  }, [scenarioId, scenario]);

  // Early return after hooks so TS knows scenarioId is a string below
  if (!scenarioId || !scenario) return null;

  const toggleExpand = (meal: MealType) => {
    const newExpanded = new Set(expandedMeals);
    if (newExpanded.has(meal)) {
      newExpanded.delete(meal);
    } else {
      newExpanded.add(meal);
    }
    setExpandedMeals(newExpanded);
  };

  const handleSelectMeal = (meal: MealType) => {
    selectMealType(meal);
  };

  // Helper to render individual slots with consistent sizing
  const renderSlots = (foods: Food[], maxSlots: number, mealType: MealType) => {
    return Array.from({ length: maxSlots }).map((_, index) => {
      const food = foods[index];

      if (food) {
        return (
          <button
            key={`${food.id}-${index}`}
            type="button"
            title={`${food.shortName}\nClick to remove`}
            onClick={() => {
              removeMealFromDay(scenarioId, mealType, food.id);
              useGameStore.getState().simulateDayNow();
            }}
            className="aspect-square w-full flex items-center justify-center text-2xl leading-none rounded-lg transition-all hover:bg-red-500/20 shadow-sm focus:outline-none"
            style={{
              backgroundColor: 'var(--bg-interactive)',
              cursor: 'pointer'
            }}
          >
            <img
              src={`/food/${food.id}.svg`}
              alt={food.shortName}
              className="w-6 h-6 object-contain"
            />
          </button>
        );
      }

      // Empty Slot Placeholder
      return (
        <div
          key={`empty-${index}`}
          className="aspect-square w-full flex items-center justify-center rounded-lg leading-none"
          style={{
            border: '1px dashed var(--border-light)',
            backgroundColor: 'var(--bg-dark)',
            opacity: 0.6
          }}
        >
          <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>+</span>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {mealTypes.map((mealType) => {
        const foodIds = meals[mealType] || [];
        const foods = foodIds
          .map((id: string) => FOOD_LIBRARY.find((f) => f.id === id))
          .filter((f): f is Food => f !== undefined);

        const mainFoods = foods.filter(f => MAIN_CATEGORIES.includes(f.category));
        const condimentFoods = foods.filter(f => CONDIMENT_CATEGORIES.includes(f.category));
        const drinkFoods = foods.filter(f => DRINK_CATEGORIES.includes(f.category));

        const isExpanded = expandedMeals.has(mealType);
        const isSelected = selectedMealType === mealType;

        // Use the scenario object we already fetched at the top
        const isActiveMeal = scenario.activeMeals.includes(mealType);

        return (
          <div key={mealType} className={isActiveMeal ? '' : 'opacity-50 pointer-events-none'}>
            {/* Meal Button + Expand Arrow */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => isActiveMeal && handleSelectMeal(mealType)}
                className="flex-1 py-2 px-3 text-left text-sm font-bold rounded-lg transition-all flex justify-between items-center shadow-sm"
                style={{
                  fontFamily: "'Nunito', sans-serif",
                  backgroundColor: isSelected && isActiveMeal ? 'var(--accent-orange)' : 'var(--bg-dark)',
                  color: isSelected && isActiveMeal ? 'white' : 'var(--text-primary)',
                  border: `1px solid ${isSelected && isActiveMeal ? 'var(--accent-rust)' : 'var(--border-light)'}`,
                  cursor: isActiveMeal ? 'pointer' : 'not-allowed',
                }}
              >
                <span>{mealLabels[mealType]}</span>

                {/* Collapsed Badge - Simplified Total Count */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isSelected && isActiveMeal ? 'rgba(0,0,0,0.2)' : 'var(--bg-interactive)',
                    color: isSelected && isActiveMeal ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  {mainFoods.length + drinkFoods.length + condimentFoods.length}/11
                </span>
              </button>

              {/* Only show expand button for active meals */}
              {isActiveMeal && (
                <button
                  type="button"
                  onClick={() => toggleExpand(mealType)}
                  className="px-3 py-2 rounded-lg transition-all shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-dark)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-light)',
                  }}
                >
                  {isExpanded ? '▼' : '▶'}
                </button>
              )}
            </div>

            {/* Chosen Foods - Collapsible Visual Slots */}
            {isExpanded && isActiveMeal && (
              <div className="mt-2 p-3 space-y-3 rounded-xl" style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}>

                {/* Mains */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-secondary)' }}>Mains</div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {renderSlots(mainFoods, 6, mealType)}
                  </div>
                </div>

                {/* Drinks & Condiments (Split Labels) */}
                <div>
                  <div className="grid grid-cols-6 gap-1.5 mb-1">
                    <div className="col-span-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Drinks</div>
                    <div className="col-span-1" /> {/* Spacer column for alignment */}
                    <div className="col-span-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Condiments</div>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {renderSlots(drinkFoods, 2, mealType)}
                    <div /> {/* Spacer column */}
                    {renderSlots(condimentFoods, 3, mealType)}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}