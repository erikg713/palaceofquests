import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * InventoryTabs
 * A highly flexible and accessible tab component for inventory management.
 * 
 * Usage:
 * <InventoryTabs
 *   tabs={[
 *     { label: 'All', icon: <AllIcon />, key: 'all' },
 *     { label: 'Weapons', icon: <WeaponIcon />, key: 'weapons' },
 *     { label: 'Armor', icon: <ArmorIcon />, key: 'armor' },
 *     { label: 'Potions', icon: <PotionIcon />, key: 'potions' },
 *     { label: 'Quest Items', icon: <QuestIcon />, key: 'quest' }
 *   ]}
 *   onTabChange={handleTabChange}
 *   theme="dark"
 * />
 */

const tabThemes = {
  light: {
    tab: 'px-4 py-2 text-gray-700 bg-gray-100 hover:bg-white border-b-2 border-transparent focus:outline-none',
    tabActive: 'border-blue-600 bg-white text-blue-700 font-semibold',
    bar: 'flex border-b border-gray-300 bg-gray-50',
  },
  dark: {
    tab: 'px-4 py-2 text-gray-200 bg-gray-800 hover:bg-gray-700 border-b-2 border-transparent focus:outline-none',
    tabActive: 'border-indigo-400 bg-gray-900 text-indigo-200 font-bold',
    bar: 'flex border-b border-gray-700 bg-gray-900',
  }
};

function InventoryTabs({
  tabs,
  initialTabKey,
  onTabChange,
  theme = 'light',
  style = {}
}) {
  const [active, setActive] = useState(() =>
    initialTabKey || (tabs.length ? tabs[0].key : null)
  );
  const tabRefs = useRef([]);

  useEffect(() => {
    if (onTabChange) onTabChange(active);
  }, [active, onTabChange]);

  const handleKeyDown = (e, idx) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    let nextIdx = idx;
    if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
    if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') nextIdx = 0;
    if (e.key === 'End') nextIdx = tabs.length - 1;
    tabRefs.current[nextIdx]?.focus();
  };

  const currentTheme = tabThemes[theme] || tabThemes.light;

  return (
    <nav
      className={currentTheme.bar}
      style={style}
      aria-label="Inventory Tabs"
      data-testid="inventory-tabs"
    >
      {tabs.map((tab, idx) => (
        <button
          key={tab.key}
          ref={el => (tabRefs.current[idx] = el)}
          className={[
            currentTheme.tab,
            active === tab.key ? currentTheme.tabActive : ''
          ].join(' ')}
          aria-selected={active === tab.key}
          aria-controls={`inventory-panel-${tab.key}`}
          id={`inventory-tab-${tab.key}`}
          tabIndex={active === tab.key ? 0 : -1}
          role="tab"
          onClick={() => setActive(tab.key)}
          onKeyDown={e => handleKeyDown(e, idx)}
          type="button"
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}

InventoryTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      icon: PropTypes.node,
      key: PropTypes.string.isRequired
    })
  ).isRequired,
  initialTabKey: PropTypes.string,
  onTabChange: PropTypes.func,
  theme: PropTypes.oneOf(['light', 'dark']),
  style: PropTypes.object
};

export default InventoryTabs;
