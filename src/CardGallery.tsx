import React, { useState } from 'react';
import { CardData } from './types';
import { RARITY_LABEL, RARITY_COLOR, CHAR_NAMES, PAGE_SIZE } from './constants';

interface Props {
  cards: CardData[];
  page: number;
  onPageChange: (p: number) => void;
  onCardClick: (card: CardData) => void;
}

export default function CardGallery({ cards, page, onPageChange, onCardClick }: Props) {
  const total = cards.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visible = cards.slice(start, start + PAGE_SIZE);
  const [gridSize, setGridSize] = useState<'small' | 'medium' | 'large'>('medium');
  const gridCols = {small: 'repeat(auto-fill, minmax(130px, 1fr))', medium: 'repeat(auto-fill, minmax(180px, 1fr))',large: 'repeat(auto-fill, minmax(260px, 1fr))',};

  if (!total) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#aaa' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🃏</div>
        <div>該当するカードが見つかりません</div>
      </div>
    );
  }

  return (
    <div>
      {/* Count */}
      <div style={{ padding: '0 0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: '#888', fontSize: 13 }}>
          <strong style={{ color: '#333' }}>{total.toLocaleString()}</strong> cards
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['small', 'medium', 'large'] as const).map(size => (
            <button
              key={size}
              onClick={() => setGridSize(size)}
              style={{
                padding: '4px 10px',
                borderRadius: 8,
                border: `1px solid ${gridSize === size ? '#e91e8c' : '#ddd'}`,
                background: gridSize === size ? '#e91e8c' : '#fff',
                color: gridSize === size ? '#fff' : '#888',
                fontSize: 12,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {size === 'small' ? '⊞ Small' : size === 'medium' ? '⊟ Medium' : '▭ Large'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: gridCols[gridSize],
        gap: 16,
      }}>
        {visible.map(card => (
          <CardItem key={card.id} card={card} onClick={() => onCardClick(card)} gridSize={gridSize} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          marginTop: 32,
          flexWrap: 'wrap',
        }}>
          <PageBtn label="←" onClick={() => onPageChange(page - 1)} disabled={page <= 1} />
          {getRange(page, totalPages).map((p, i) =>
            p === '...'
              ? <span key={`d${i}`} style={{ padding: '0 4px', color: '#aaa' }}>…</span>
              : <PageBtn key={p} label={String(p)} onClick={() => onPageChange(p as number)} active={p === page} />
          )}
          <PageBtn label="→" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} />
        </div>
      )}
    </div>
  );
}

function CardItem({ card, onClick, gridSize }: { card: CardData; onClick: () => void; gridSize: 'small' | 'medium' | 'large' }) {
  const rarityLabel = RARITY_LABEL[card.rarity] || String(card.rarity);
  const rarityColor = RARITY_COLOR[card.rarity] || '#999';
  const charName = CHAR_NAMES[card.charactersId] || card.description;
  const imageHeight = { small: 100, medium: 140, large: 200 };

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
      }}
    >
        {/* Image */}
        <div style={{
          height: imageHeight[gridSize],
          background: '#f0f0f5',
          display: 'flex',
          gap: 1,
        }}>
          <img
            src={`/images/image_card_full_${card.cardSeriesId}0.jpeg`}
            alt="card"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.includes('0.jpeg')) {
                img.src = `/images/image_card_full_${card.cardSeriesId}1.jpeg`;
              } else {
                img.style.display = 'none';
              }
            }}
          />
        </div>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{
            background: rarityColor,
            color: '#fff',
            borderRadius: 4,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            {rarityLabel}
          </span>
          <span style={{ fontSize: 11, color: '#999', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {charName}
          </span>
        </div>
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.35,
          color: card.name ? '#1a1a1a' : '#aaa',
          fontStyle: card.name ? 'normal' : 'italic',
        }}>
          {card.name || '？？？'}
        </div>
      </div>
    </div>
  );
}

function PageBtn({ label, onClick, disabled, active }: {
  label: string; onClick: () => void; disabled?: boolean; active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 12px',
        border: active ? '1px solid #e91e8c' : '1px solid #ddd',
        borderRadius: 8,
        background: active ? '#e91e8c' : '#fff',
        color: active ? '#fff' : disabled ? '#ccc' : '#333',
        fontSize: 13,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontWeight: active ? 700 : 400,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

function getRange(cur: number, total: number): (number | string)[] {
  const result: (number | string)[] = [1];
  if (cur > 3) result.push('...');
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) result.push(i);
  if (cur < total - 2) result.push('...');
  if (total > 1) result.push(total);
  return result;
}
