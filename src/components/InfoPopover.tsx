import type { Scenario } from '../data/nutritionModels';
import { FOOD_LIBRARY } from '../data/nutritionModels';
import { Popover } from './Popover';
import { useGameStore } from '../store/gameStore';

const GOLD = '#D4AF37';

interface InfoPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: Scenario;
  fadingOut?: boolean;
  animateIn?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function InfoPopover({ isOpen, onClose, scenario, fadingOut = false, animateIn = false, onMouseEnter, onMouseLeave }: InfoPopoverProps) {
  const handleReset = () => {
    useGameStore.getState().resetScenario();
    onClose();
  };

  const unlocks = scenario.unlocksFoods ?? [];

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      width={250}
      fadingOut={fadingOut}
      animateIn={animateIn}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      positionMode="top-left"
    >
      <div className="relative p-4 space-y-3">
        {/* Removed border and background on X button */}
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-sm font-bold transition-all absolute top-3 right-3"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          onMouseEnter={e => { e.currentTarget.style.color = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          ✕
        </button>

        {/* Updated Fonts */}
        <h3 className="text-sm font-bold pr-6" style={{ color: 'var(--text-primary)', fontFamily: "'Fraunces', serif" }}>
          {scenario.title}
        </h3>

        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif" }}>
          {scenario.description}
        </p>

        {/* Restructured Rewards Block */}
        <div className="pt-3 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <p className="text-xs font-bold uppercase mb-2 tracking-widest" style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif" }}>
            Rewards
          </p>
          <div className="flex justify-between items-center w-full pr-2 mt-1">
            {/* Left Column: Unlocked Foods (Vertical list with SVGs) */}
            <div className="flex flex-col gap-1.5">
              {unlocks.length > 0 ? unlocks.map(fid => {
                const food = FOOD_LIBRARY.find(f => f.id === fid);
                return (
                  <div key={fid} className="flex items-center gap-1.5">
                    {food && (
                      <img 
                        src={`/food/${food.id}.svg`} 
                        alt={food.shortName} 
                        className="w-4 h-4 object-contain" 
                      />
                    )}
                    <span className="text-xs font-bold" style={{ color: 'var(--accent-green)', fontFamily: "'Nunito', sans-serif" }}>
                      {food ? food.shortName : fid}
                    </span>
                  </div>
                );
              }) : (
                <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>No new foods</span>
              )}
            </div>

            {/* Right Column: Coins (Vertically centered, right aligned) */}
            <span className="text-sm font-bold ml-auto" style={{ color: 'var(--feedback-warn-text)', fontFamily: "'Nunito', sans-serif" }}>
              +{scenario.coinsReward} 💰
            </span>
          </div>
        </div>

        {/* Reset button */}
        <div className="pt-3 border-t flex justify-center" style={{ borderColor: 'var(--border-light)' }}>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold px-3 py-1.5 transition-all"
            style={{
              backgroundColor: 'var(--feedback-bad-bg)',
              color: 'var(--feedback-bad-text)',
              border: '1px solid var(--feedback-bad-text)',
              borderRadius: '10px 4px 10px 4px',
              cursor: 'pointer',
              fontFamily: "'Nunito', sans-serif"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--feedback-bad-text)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--feedback-bad-bg)';
              e.currentTarget.style.color = 'var(--feedback-bad-text)';
            }}
          >
            Reset scenario
          </button>
        </div>
      </div>
    </Popover>
  );
}