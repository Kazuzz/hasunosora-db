import React, { useEffect } from 'react';
import { CardData, DB } from './types';
import { RARITY_LABEL, RARITY_COLOR, CHAR_NAMES } from './constants';
import SkillBlock from './SkillBlock';

interface Props {
  card: CardData;
  db: DB;
  onClose: () => void;
}

export default function CardModal({ card, db, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const rarityLabel = RARITY_LABEL[card.rarity] || String(card.rarity);
  const rarityColor = RARITY_COLOR[card.rarity] || '#999';
  const charName = CHAR_NAMES[card.charactersId] || card.description;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backdropFilter: 'blur(3px)',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 680,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.2s ease',
      }}>
        {/* Image placeholder */}
        <div style={{
          background: '#f0f0f5',
          height: 220,
          borderRadius: '16px 16px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          overflow: 'hidden',
        }}>
          <img
            src={`/images/image_card_full_${card.cardSeriesId}0.jpeg`}
            alt="card base"
            style={{
              flex: 1,
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.includes('0.jpeg')) {
                img.src = `/images/image_card_full_${card.cardSeriesId}1.jpeg`;
              } else {
                img.style.display = 'none';
              }
            }}
          />

          <img
            src={`/images/image_card_full_${card.cardSeriesId}1.jpeg`}
            alt="card evolved"
            style={{
              flex: 1,
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '20px 24px 28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  background: rarityColor,
                  color: '#fff',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}>
                  {rarityLabel}
                </span>
                <span style={{ fontSize: 13, color: '#888' }}>{charName}</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>{card.name || '？？？'}</h2>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32, height: 32,
                border: '1px solid #ddd',
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                fontSize: 16,
                color: '#666',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >✕</button>
          </div>

          {/* Skills */}
          <SkillBlock
            label="Special Appeal"
            seriesId={card.specialAppealSeriesId}
            skillSeries={db.skillSeries}
            skills={db.skills}
          />
          <SkillBlock
            label="Skill"
            seriesId={card.skillSeriesId}
            skillSeries={db.skillSeries}
            skills={db.skills}
          />
          <SkillBlock
            label="Passive"
            seriesId={card.attributeId}
            skillSeries={db.skillSeries}
            skills={db.skills}
          />

          {/* Sub Cards */}
          {card.subCards && card.subCards.length > 0 && (
            <div style={{ marginTop: 20, borderTop: '1px solid #eee', paddingTop: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Sub Cards</div>
              {card.subCards.map(subSkillId => {
                const subPassiveId = parseInt('9' + String(subSkillId).slice(1));
                const subSeries = db.skillSeries[String(subSkillId)];
                const imageId = subSeries ? subSeries.skillIcon + 1 : null;

                return (
                  <details key={subSkillId} style={{ marginBottom: 12, background: '#fafafa', borderRadius: 10, padding: '10px 14px' }}>
                    <summary style={{
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: 13,
                      color: '#e91e8c',
                      listStyle: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}>
                      ▶ {subSeries?.name || String(subSkillId)}
                    </summary>
                    <div style={{ marginTop: 12 }}>
                      {/* Sub-card image */}
                      {imageId && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                          <img
                            src={`/images/image_card_middle_vertical_${imageId}.jpeg`}
                            alt={subSeries?.name}
                            style={{ 
                              width: 200,
                              borderRadius: 8,
                              objectFit: 'cover',
                            }}
                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <SkillBlock
                        label="Skill"
                        seriesId={subSkillId}
                        skillSeries={db.skillSeries}
                        skills={db.skills}
                      />
                      <SkillBlock
                        label="Passive"
                        seriesId={subPassiveId}
                        skillSeries={db.skillSeries}
                        skills={db.skills}
                      />
                    </div>
                  </details>
                );
              })}
            </div>
          )}
          
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
