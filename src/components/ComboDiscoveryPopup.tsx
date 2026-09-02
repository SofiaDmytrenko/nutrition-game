import { useGameStore } from '../store/gameStore';
import { GOOD_COMBOS, BAD_COMBOS, FOOD_LIBRARY } from '../data/nutritionModels';

export function ComboDiscoveryPopup() {
  const { pendingComboDiscoveries, dismissComboPopup } = useGameStore();

  if (pendingComboDiscoveries.length === 0) return null;

  // Get the first discovery in the queue
  const currentDiscovery = pendingComboDiscoveries[0];
  const { comboId, foodIds } = currentDiscovery;

  const goodCombo = GOOD_COMBOS.find(c => c.id === comboId);
  const badCombo = BAD_COMBOS.find(c => c.id === comboId);
  const comboData = goodCombo || badCombo;

  if (!comboData) {
    dismissComboPopup();
    return null;
  }

  const isGood = !!goodCombo;
  const accentColor = isGood ? 'var(--accent-green)' : 'var(--feedback-bad-text)';
  const emoji = isGood ? '✨' : '⚠️';
  const typeLabel = isGood ? 'Synergy Discovered!' : 'Antagonist Discovered!';

  // Get emojis for the triggering foods
  const triggerEmojis = foodIds.map(id => FOOD_LIBRARY.find(f => f.id === id)?.emoji).filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={dismissComboPopup}
    >
      <div
        className="relative w-full max-w-sm p-6 rounded-2xl shadow-2xl text-center"
        style={{
          backgroundColor: 'var(--bg-interactive)',
          border: `2px solid ${accentColor}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismissComboPopup}
          className="absolute top-3 right-3 text-lg"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          ✕
        </button>

        <div className="text-4xl mb-2">{emoji}</div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
          {typeLabel}
        </h3>
        <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
          {comboData.message}
        </h2>

        {/* --- NEW: Triggering Foods Emojis --- */}
        <div className="flex justify-center gap-2 mb-4 text-3xl">
          {triggerEmojis.map((emoji, idx) => (
            <span key={idx}>{emoji}</span>
          ))}
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          {comboData.explanation}
        </p>

        <div
          className="inline-block px-4 py-2 rounded-full font-bold text-sm mb-4"
          style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--accent-cream)' }}
        >
          +100 💰 Added to Guide!
        </div>

        <button
          type="button"
          onClick={dismissComboPopup}
          className="w-full py-2.5 rounded-lg font-bold text-sm transition-all"
          style={{
            backgroundColor: accentColor,
            color: 'white',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}