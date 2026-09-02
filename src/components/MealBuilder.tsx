import { useGameStore } from '../store/gameStore';
import { FOOD_LIBRARY, CATEGORY_LABELS, SCENARIOS } from '../data/nutritionModels';
import type { FoodCategory, Food } from '../data/nutritionModels';
import { useState } from 'react';

export function MealBuilder() {
  const { dailyMeals, selectedMealType, addMealToDay, unlockedFoods, scenarioId } = useGameStore();
  if (!scenarioId) return null;
  const meals = dailyMeals[scenarioId] || { breakfast: [], lunch: [], dinner: [], snacks: [] };
  const currentMealFoods = meals[selectedMealType] || [];
  const [hoveredFood, setHoveredFood] = useState<Food | null>(null);

  const scenario = SCENARIOS.find(s => s.id === scenarioId);

  // Sets to track which tags are helpful or harmful for the active scenario
  const goalTags = new Set<string>();
  const warningTags = new Set<string>();

  // Check Primary Goals
  scenario?.primaryGoals?.forEach(g => {
    if (g.maxValue != null) {
      if (g.nutrientKey === 'fat') warningTags.add('high-fat');
      if (g.nutrientKey === 'sugar') warningTags.add('high-sugar');
      if (g.nutrientKey === 'sodium') warningTags.add('high-sodium');
      if (g.nutrientKey === 'saturated-fat') warningTags.add('high-saturated-fat');
    } else {
      goalTags.add(`high-${g.nutrientKey}`);
    }
  });

  // Check Meal Goals (for scenarios like Tier 4)
  scenario?.mealGoals && Object.values(scenario.mealGoals).forEach(goals => {
    goals?.forEach(g => {
      if (g.maxValue != null) {
        if (g.nutrientKey === 'fat') warningTags.add('high-fat');
        if (g.nutrientKey === 'sugar') warningTags.add('high-sugar');
        if (g.nutrientKey === 'sodium') warningTags.add('high-sodium');
        if (g.nutrientKey === 'saturated-fat') warningTags.add('high-saturated-fat');
      } else {
        goalTags.add(`high-${g.nutrientKey}`);
      }
    });
  });

  // Check Strict Diets & Forbidden Tags
  scenario?.requiredFoodTags?.forEach(t => goalTags.add(t));
  scenario?.mustIncludeFoodTags?.forEach(t => goalTags.add(t));
  scenario?.forbiddenFoodTags?.forEach(t => warningTags.add(t));

  const categories: FoodCategory[] = [
    'meat-fish', 'dairy', 'grains', 'vegetables', 'fruits',
    'nuts-legumes', 'snacks', 'drinks', 'seasonings-fats'
  ];

  // Calculate Slot Limits for UI feedback
  const MAIN_CATEGORIES = ['meat-fish', 'dairy', 'grains', 'vegetables', 'fruits', 'nuts-legumes', 'snacks'];
  const CONDIMENT_CATEGORIES = ['seasonings-fats'];
  const DRINK_CATEGORIES = ['drinks'];

  const mainCount = currentMealFoods.filter(id => {
    const f = FOOD_LIBRARY.find(x => x.id === id);
    return f && MAIN_CATEGORIES.includes(f.category);
  }).length;

  const drinkCount = currentMealFoods.filter(id => {
    const f = FOOD_LIBRARY.find(x => x.id === id);
    return f && DRINK_CATEGORIES.includes(f.category);
  }).length;

  const condimentCount = currentMealFoods.filter(id => {
    const f = FOOD_LIBRARY.find(x => x.id === id);
    return f && CONDIMENT_CATEGORIES.includes(f.category);
  }).length;

  return (
    <>
      <style>{`.builder-scroll::-webkit-scrollbar { display: none; }`}</style>
      <div className="flex flex-col h-full min-h-0">
        {/* ── Food Grid (Scrollable) ── */}
        <div className="flex-1 overflow-x-auto overflow-y-auto pb-2 min-h-0 builder-scroll">
          <div className="grid gap-1 min-w-full h-max" style={{ gridTemplateColumns: 'repeat(9, minmax(60px, 1fr))', alignContent: 'start' }}>
            {categories.map((category) => {
              const foods = FOOD_LIBRARY.filter((f) => f.category === category)
                .sort((a, b) => {
                  const aIndex = unlockedFoods.indexOf(a.id);
                  const bIndex = unlockedFoods.indexOf(b.id);

                  const aIsUnlocked = aIndex !== -1;
                  const bIsUnlocked = bIndex !== -1;

                  if (aIsUnlocked && !bIsUnlocked) return -1;
                  if (!aIsUnlocked && bIsUnlocked) return 1;

                  if (aIsUnlocked && bIsUnlocked) {
                    return aIndex - bIndex;
                  }
                  return 0;
                });

              return (
                <div key={category} className="flex flex-col gap-1">
                  <h6
                    className="text-[9px] text-center font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif" }}
                  >
                    {CATEGORY_LABELS[category]}
                  </h6>
                  <div className="flex flex-col gap-0">
                    {foods.map((food) => {
                      const isPermanentlyUnlocked = unlockedFoods.includes(food.id);

                      const MAX_PORTIONS = 3;
                      const count = currentMealFoods.filter((id: string) => id === food.id).length;
                      const atMax = count >= MAX_PORTIONS;

                      const isMain = MAIN_CATEGORIES.includes(food.category);
                      const isDrink = DRINK_CATEGORIES.includes(food.category);
                      const isCondiment = CONDIMENT_CATEGORIES.includes(food.category);

                      let slotsFull = false;
                      if (isMain) slotsFull = mainCount >= 6;
                      else if (isDrink) slotsFull = drinkCount >= 2;
                      else if (isCondiment) slotsFull = condimentCount >= 3;

                      const isDisabled = !isPermanentlyUnlocked || atMax || slotsFull;

                      return (
                        <button
                          key={food.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isDisabled) return;
                            addMealToDay(scenarioId, selectedMealType, food.id);
                            useGameStore.getState().simulateDayNow();
                          }}
                          className="relative flex flex-col items-center justify-center rounded-lg transition-all h-9 w-full"
                          style={{
                            backgroundColor: isDisabled ? 'var(--bg-dark)' : 'var(--bg-interactive)',
                            borderWidth: '1px',
                            borderColor: 'var(--border-light)',
                            opacity: !isPermanentlyUnlocked ? 0.4 : isDisabled ? 0.6 : 1,
                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                            filter: !isPermanentlyUnlocked ? 'grayscale(100%)' : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (!isDisabled) {
                              e.currentTarget.style.borderColor = 'var(--accent-orange)';
                            }
                            setHoveredFood(food);
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-light)';
                            setHoveredFood(null);
                          }}
                          disabled={isDisabled}
                        >
                          <div className="flex flex-col items-center justify-center h-full relative">
                            {count > 0 && (
                              <span className="absolute top-0 right-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--accent-cream)', color: 'var(--text-primary)' }}>
                                {count}
                              </span>
                            )}
                            <img
                              src={`/food/${food.id}.svg`}
                              alt={food.name}
                              className="w-7 h-7 object-contain"
                            />
                            {!isPermanentlyUnlocked && (
                              <span className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg">🔒</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Ultra-Compact Reserved Footer (Tooltip) ── */}
        <div 
          className="shrink-0 mt-2 pt-2 flex flex-col gap-1.5" 
          style={{ borderTop: '1px solid var(--border-light)', minHeight: '70px' }}
        >
          {hoveredFood ? (
            <>
              {/* Row 1: Header & Macros */}
              <div className="flex items-center justify-between gap-3">
                {/* Header */}
                <div className="flex items-center gap-2 min-w-0">
                  <img src={`/food/${hoveredFood.id}.svg`} alt={hoveredFood.name} className="w-8 h-8 object-contain shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate" style={{ color: 'var(--text-primary)' }}>
                      {hoveredFood.name}
                    </p>
                    <p className="text-[10px] whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                      {hoveredFood.servingSize}{hoveredFood.servingSizeLabel} • {hoveredFood.calories} kcal
                    </p>
                  </div>
                </div>

                {/* Macros (Limits Style Frames) */}
                <div className="flex gap-1 shrink-0">
                  {[
                    { label: 'Pro', val: hoveredFood.macronutrients.protein },
                    { label: 'Carb', val: hoveredFood.macronutrients.carbs },
                    { label: 'Fat', val: hoveredFood.macronutrients.fat },
                    { label: 'Fib', val: hoveredFood.macronutrients.fiber }
                  ].map(m => (
                    <div 
                      key={m.label} 
                      className="flex flex-col items-center justify-center px-1.5 py-0.5 rounded" 
                      style={{ backgroundColor: 'var(--bg-dark)', minWidth: '36px' }}
                    >
                      <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{m.val}g</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: Tags (Strict fixed height to prevent expansion) */}
              <div className="flex flex-wrap gap-1 overflow-hidden h-5">
                {!unlockedFoods.includes(hoveredFood.id) ? (
                  <span className="text-[10px] font-bold" style={{ color: 'var(--feedback-warn-text)' }}>🔒 Complete more scenarios to unlock!</span>
                ) : (
                  hoveredFood.tags.map(tag => {
                    let bgColor = 'var(--bg-dark)';
                    let textColor = 'var(--text-secondary)';

                    if (warningTags.has(tag)) {
                      bgColor = 'rgba(220, 38, 38, 0.15)';
                      textColor = 'var(--feedback-bad-text)';
                    } else if (goalTags.has(tag)) {
                      bgColor = 'rgba(34, 197, 94, 0.15)';
                      textColor = 'var(--accent-green)';
                    }

                    return (
                      <span
                        key={tag}
                        className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold capitalize"
                        style={{ backgroundColor: bgColor, color: textColor }}
                      >
                        {tag.replace(/-/g, ' ')}
                      </span>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-xs italic" style={{ color: 'var(--text-secondary)' }}>
                Hover over a food to inspect its macros and benefits.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}