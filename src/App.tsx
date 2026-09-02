import { TopBar } from './components/TopBar';
import { MealBuilder } from './components/MealBuilder';
import { useGameStore } from './store/gameStore';
import { useState } from 'react';
import { ScenarioMenu } from './components/ScenarioMenu';
import { GoalsPanel } from './components/GoalsPanel';
import { MealSummary } from './components/MealSummary';

// ─── Import matching SVGs for ambient background ──────────────────
import Leaf0 from './assets/plant-leaf-garden-0.svg';
import Leaf11 from './assets/plant-leaf-garden-10.svg';
import Leaf12 from './assets/plant-leaf-garden-11.svg';
import Leaf21 from './assets/plant-leaf-garden-21.svg';

export function App() {
  const [showMenu, setShowMenu] = useState(true);

  if (showMenu) {
    return (
      <div className="min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="overflow-y-auto" style={{ height: '100vh' }}>
          <ScenarioMenu
            onSelectScenario={(id: string) => {
              useGameStore.getState().selectScenario(id);
              setShowMenu(false);
            }}
          />
        </div>
      </div>
    );
  }

  const leafStyle: React.CSSProperties = {
    position: 'absolute',
    width: '450px',
    height: 'auto',
    opacity: 0.03,
    pointerEvents: 'none',
    zIndex: 0,
    filter: 'brightness(0) saturate(100%) invert(74%) sepia(21%) saturate(580%) hue-rotate(10deg) brightness(92%)',
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--bg-dark)' }}>
      <img src={Leaf0} style={{ ...leafStyle, top: '-80px', left: '-80px' }} alt="decorative-leaf" />
      <img src={Leaf11} style={{ ...leafStyle, bottom: '-80px', right: '-80px', transform: 'scale(-1, -1)' }} alt="decorative-leaf" />
      <img src={Leaf12} style={{ ...leafStyle, top: '-80px', right: '-80px', transform: 'scale(-1, 1)' }} alt="decorative-leaf" />
      <img src={Leaf21} style={{ ...leafStyle, bottom: '-80px', left: '-80px', transform: 'scale(1, -1)' }} alt="decorative-leaf" />

      <TopBar onBackToMenu={() => setShowMenu(true)} />

      <div className="flex-1 w-full max-w-[1600px] mx-auto overflow-hidden min-h-0 relative z-10">
        <div className="grid h-full min-h-0" style={{
          color: 'var(--text-primary)',
          gridTemplateColumns: '4fr 10fr 5fr'
        }}>
          {/* Column 1 */}
          <div className="flex flex-col min-h-0 overflow-hidden py-4 px-4" style={{ borderRight: '1px solid var(--border-light)' }}>
            <p className="text-xs uppercase mb-3 tracking-widest shrink-0" style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif" }}>
              Select Meal
            </p>
            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              <MealSummary />
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col min-h-0 overflow-hidden py-4 px-4" style={{
            backgroundColor: 'var(--bg-interactive)',
            borderRight: '1px solid var(--border-light)',
          }}>
            <p className="text-xs uppercase mb-3 tracking-widest shrink-0" style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif" }}>
              Food Browser
            </p>
            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              <MealBuilder />
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col min-h-0 overflow-hidden py-4 px-4">
            <p className="text-xs uppercase mb-3 tracking-widest shrink-0" style={{ color: 'var(--text-secondary)', fontFamily: "'Nunito', sans-serif" }}>
              Progress
            </p>
            <div className="flex-1 overflow-y-auto min-h-0 pr-2">
              <GoalsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}