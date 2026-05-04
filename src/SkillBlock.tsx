import React, { useState } from 'react';
import { SkillSeries, SkillLevel } from './types';

interface Props {
  label: string;
  seriesId: number;
  skillSeries: Record<string, SkillSeries>;
  skills: Record<string, SkillLevel[]>;
}

// Format description: wrap $...$ values in a styled span
function formatDesc(desc: string): React.ReactNode[] {
  const parts = desc.split(/(\$[^$]+\$)/g);
  return parts.map((part, i) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      return (
        <span key={i} style={{ color: '#e91e8c', fontWeight: 700 }}>
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function SkillBlock({ label, seriesId, skillSeries, skills }: Props) {
  const [level, setLevel] = useState(1);

  const series = skillSeries[String(seriesId)];
  const levels = skills[String(seriesId)] || [];

  if (!series || levels.length === 0) return null;

  const maxLevel = levels.length;
  const clampedLevel = Math.min(level, maxLevel);
  const current = levels.find(l => l.level === clampedLevel) || levels[0];

  const handleMinus = () => setLevel(l => Math.max(1, l - 1));
  const handlePlus = () => setLevel(l => Math.min(maxLevel, l + 1));

  return (
    <div style={{
      borderTop: '1px solid #eee',
      paddingTop: 20,
      marginTop: 20,
    }}>
      {/* Section label */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
      }}>
        <img
          src={`/images/icon_skill_${series.skillIcon}.png`}
          alt={label}
          style={{ width: 48, height: 48, objectFit: 'cover', flexShrink: 0 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <span style={{ fontSize: 13, color: '#888', fontWeight: 600 }}>{label}</span>
      </div>

      {/* Skill name + cost + level selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{series.name}</span>
          {current.cost > 0 && (
            <span style={{
              background: '#e91e8c',
              color: '#fff',
              borderRadius: 12,
              padding: '2px 10px',
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}>
              {current.cost} AP
            </span>
          )}
        </div>

        {/* Level selector — hidden when there is only one level */}
        {maxLevel > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            border: '1px solid #e91e8c',
            borderRadius: 20,
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            <button
              onClick={handleMinus}
              disabled={clampedLevel <= 1}
              style={{
                width: 30,
                height: 28,
                background: 'transparent',
                border: 'none',
                cursor: clampedLevel <= 1 ? 'default' : 'pointer',
                color: clampedLevel <= 1 ? '#ccc' : '#e91e8c',
                fontWeight: 700,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >−</button>
            <span style={{
              padding: '0 8px',
              fontSize: 13,
              fontWeight: 600,
              color: '#e91e8c',
              borderLeft: '1px solid #e91e8c',
              borderRight: '1px solid #e91e8c',
              lineHeight: '28px',
              minWidth: 60,
              textAlign: 'center',
            }}>
              Level {clampedLevel}
            </span>
            <button
              onClick={handlePlus}
              disabled={clampedLevel >= maxLevel}
              style={{
                width: 30,
                height: 28,
                background: 'transparent',
                border: 'none',
                cursor: clampedLevel >= maxLevel ? 'default' : 'pointer',
                color: clampedLevel >= maxLevel ? '#ccc' : '#e91e8c',
                fontWeight: 700,
                fontSize: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >+</button>
          </div>
        )}
      </div>

      {/* Description */}
      <p style={{
        fontSize: 14,
        lineHeight: 1.75,
        color: '#333',
        background: '#fafafa',
        borderRadius: 8,
        padding: '10px 14px',
      }}>
        {formatDesc(current.description)}
      </p>
    </div>
  );
}