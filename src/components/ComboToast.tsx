import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GOOD_COMBOS, BAD_COMBOS, FOOD_LIBRARY } from '../data/nutritionModels';

export function ComboToast() {
  const { pendingComboDiscoveries, dismissComboPopup } = useGameStore();
  const [isExiting, setIsExiting] = useState(false);

  const currentDiscovery = pendingComboDiscoveries[0];

  useEffect(() => {
    if (currentDiscovery) {
      setIsExiting(false);
      const visibleTimer = setTimeout(() => setIsExiting(true), 2500);
      const removeTimer = setTimeout(() => dismissComboPopup(), 2800);

      return () => {
        clearTimeout(visibleTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [currentDiscovery, dismissComboPopup]);

  if (!currentDiscovery) return null;

  const { comboId, foodIds } = currentDiscovery;
  const goodCombo = GOOD_COMBOS.find(c => c.id === comboId);
  const badCombo = BAD_COMBOS.find(c => c.id === comboId);
  const comboData = goodCombo || badCombo;

  if (!comboData) return null;

  const isGood = !!goodCombo;
  const symbol = isGood ? '✓' : '⚠';
  const shortName = comboData.shortLabel;
  const triggerFoods = foodIds
    .map(id => FOOD_LIBRARY.find(f => f.id === id))
    .filter((food): food is NonNullable<typeof food> => Boolean(food));

  const discoveryReward = 100;
  const accentColor = isGood ? 'var(--accent-green)' : 'var(--feedback-bad-text)';

  const handleManualDismiss = () => {
    setIsExiting(true);
    setTimeout(() => dismissComboPopup(), 300);
  };

  return (
    <div
      className="flex items-center gap-2 transition-all duration-300 ease-in-out"
      style={{
        transform: isExiting ? 'scale(0.9)' : 'scale(1)',
        opacity: isExiting ? 0 : 1,
        cursor: 'pointer',
        fontFamily: "'Nunito', sans-serif",
      }}
      onClick={handleManualDismiss}
    >
      {/* Symbol Icon */}
      <span
        className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shrink-0"
        style={{
          backgroundColor: isGood ? 'var(--feedback-good-bg)' : 'var(--feedback-bad-bg)',
          color: accentColor
        }}
      >
        {symbol}
      </span>

      {/* Combo Name */}
      <p className="text-sm font-bold whitespace-nowrap" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>
        {shortName}
      </p>

      {/* Food SVGs */}
      <div className="flex gap-1 shrink-0">
        {triggerFoods.map(food => (
          <img
            key={food.id}
            src={`/food/${food.id}.svg`}
            alt={food.shortName}
            className="w-5 h-5 object-contain"
          />
        ))}
      </div>

      {/* Discovery Reward */}
      <div className="flex items-center gap-1 pl-1 shrink-0">
        <span className="font-bold text-sm" style={{ color: 'var(--accent-cream)' }}>
          +{discoveryReward}
        </span>
        <span className="text-sm">💰</span>
      </div>
    </div>
  );
}