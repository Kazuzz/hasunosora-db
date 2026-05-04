import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { DB, CardData } from './types';
import { RARITY_LABEL, CHAR_NAMES } from './constants';
import CardGallery from './CardGallery';
import CardModal from './CardModal';

const CHAR_IDS = [1011,1021,1022,1023,1031,1032,1033,1041,1042,1043,1051,1052,1020,1030,1044];

const sectionTitle: React.CSSProperties = {
  fontSize:10, fontWeight:700, letterSpacing:'0.1em',
  textTransform:'uppercase', color:'#aaa', marginBottom:8,
};

function Chip({ label, active, onClick }: { label:string; active:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      padding:'3px 10px', borderRadius:20,
      border:`1px solid ${active ? '#e91e8c' : '#ddd'}`,
      background: active ? '#e91e8c' : '#fff',
      color: active ? '#fff' : '#555',
      fontSize:12, cursor:'pointer', fontFamily:'inherit',
      fontWeight: active ? 700 : 400, transition:'all 0.15s',
    }}>{label}</button>
  );
}

export default function App() {
  const [db, setDb] = useState<DB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRarity, setFilterRarity] = useState<Set<number>>(new Set());
  const [filterChar, setFilterChar] = useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = useState<'order'|'rarity_desc'|'rarity_asc'>('order');
  const [page, setPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  useEffect(() => {
    fetch('/db.json')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data: DB) => { setDb(data); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    if (!db) return [];
    let cards = db.cards.filter(c => c.orderId !== 99999999);
    const q = search.toLowerCase().trim();
    if (q) cards = cards.filter(c =>
      (c.name||'').toLowerCase().includes(q) ||
      (c.description||'').toLowerCase().includes(q) ||
      (CHAR_NAMES[c.charactersId]||'').toLowerCase().includes(q) ||
      String(c.id).includes(q)
    );
    if (filterRarity.size) cards = cards.filter(c => filterRarity.has(c.rarity));
    if (filterChar.size) cards = cards.filter(c => filterChar.has(c.charactersId));
    return [...cards].sort((a,b) => {
      if (sortBy==='rarity_desc') return b.rarity-a.rarity || a.orderId-b.orderId;
      if (sortBy==='rarity_asc') return a.rarity-b.rarity || a.orderId-b.orderId;
      return b.orderId-a.orderId;
    });
  }, [db, search, filterRarity, filterChar, sortBy]);

  const toggleRarity = useCallback((r:number) => {
    setFilterRarity(prev => { const s=new Set(prev); s.has(r)?s.delete(r):s.add(r); return s; });
    setPage(1);
  }, []);
  const toggleChar = useCallback((c:number) => {
    setFilterChar(prev => { const s=new Set(prev); s.has(c)?s.delete(c):s.add(c); return s; });
    setPage(1);
  }, []);

  const rarities = db ? Array.from(new Set(db.cards.map(c=>c.rarity))).sort((a,b)=>a-b) : [];

  if (loading) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',gap:16,color:'#888'}}>
      <div style={{width:32,height:32,border:'3px solid #eee',borderTopColor:'#e91e8c',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
      データを読み込み中…
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',gap:12,color:'#888'}}>
      <div style={{fontSize:40}}>⚠️</div>
      <div>読み込みエラー: {error}</div>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'#f5f5f7'}}>
      {/* Header */}
      <header style={{background:'#fff',borderBottom:'1px solid #e8e8e8',padding:'0 24px',height:56,display:'flex',alignItems:'center',gap:16,position:'sticky',top:0,zIndex:100,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight:800,fontSize:18,color:'#e91e8c',letterSpacing:'-0.02em',whiteSpace:'nowrap'}}>Hasunosora DB</div>
        <input type="text" value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
          placeholder="カード名・キャラ名で検索…"
          style={{flex:1,maxWidth:400,border:'1px solid #e0e0e0',borderRadius:8,padding:'7px 14px',fontSize:13,outline:'none',fontFamily:'inherit',background:'#fafafa'}}
        />
      </header>

      <div style={{display:'flex'}}>
        {/* Sidebar */}
        <aside style={{width:220,flexShrink:0,padding:'20px 16px',position:'sticky',top:56,height:'calc(100vh - 56px)',overflowY:'auto',borderRight:'1px solid #eee',background:'#fff'}}>
          <div style={{marginBottom:20}}>
            <div style={sectionTitle}>Sort</div>
            <select value={sortBy} onChange={e=>{setSortBy(e.target.value as any);setPage(1);}}
              style={{width:'100%',border:'1px solid #ddd',borderRadius:8,padding:'6px 10px',fontSize:13,fontFamily:'inherit',background:'#fafafa',outline:'none'}}>
              <option value="order">デフォルト順</option>
              <option value="rarity_desc">レアリティ (高→低)</option>
              <option value="rarity_asc">レアリティ (低→高)</option>
            </select>
          </div>
          <div style={{marginBottom:20}}>
            <div style={sectionTitle}>Rarity</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
              {rarities.map(r => (
                <Chip key={r} label={RARITY_LABEL[r] || String(r)} active={filterRarity.has(r)} onClick={() => toggleRarity(r)} />
              ))}
            </div>
          </div>
          <div>
            <div style={sectionTitle}>Character</div>
            <div style={{display:'flex',flexDirection:'column',gap:3}}>
              {CHAR_IDS.filter(id=>db?.cards.some(c=>c.charactersId===id)).map(id=>(
                <button key={id} onClick={()=>toggleChar(id)} style={{
                  textAlign:'left',padding:'5px 10px',borderRadius:8,border:'none',
                  background:filterChar.has(id)?'#fce4f3':'transparent',
                  color:filterChar.has(id)?'#e91e8c':'#555',
                  fontSize:12,cursor:'pointer',fontFamily:'inherit',
                  fontWeight:filterChar.has(id)?700:400,transition:'all 0.1s',
                }}>{CHAR_NAMES[id]||id}</button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{flex:1,padding:'24px 28px',minWidth:0}}>
          <CardGallery cards={filtered} page={page} onPageChange={p=>{setPage(p);window.scrollTo(0,0);}} onCardClick={setSelectedCard}/>
        </main>
      </div>

      {selectedCard && db && (
        <CardModal card={selectedCard} db={db} onClose={()=>setSelectedCard(null)}/>
      )}
    </div>
  );
}
