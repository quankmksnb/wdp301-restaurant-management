import React from "react";
import { Search, Plus } from "lucide-react";
export default function WaiterHeader({ activeTab, setActiveTab, selTable, setSelTable }) {
  const TAB_ICONS = {
    phonban:  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><rect x="3" y="11" width="18" height="2" rx="1"/><rect x="5" y="7" width="14" height="2" rx="1"/><rect x="5" y="15" width="3" height="5" rx="1"/><rect x="16" y="15" width="3" height="5" rx="1"/></svg>,
    thucdon:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1" fill="white"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
    giaodich: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  };
  const TABS = [
    { key:"phonban",  label:"Phòng bàn" },
    { key:"thucdon",  label:"Thực đơn"  },
  ];

  return (
    <div style={{ height:46, flexShrink:0, display:"flex", background:"linear-gradient(90deg,#1340b2 0%,#2d6fdc 55%,#3b82f6 100%)" }}>
      <div style={{ flex:"0 0 67%", display:"flex", alignItems:"center", padding:"0 10px", gap:0 }}>
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)} style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"5px 12px", borderRadius:6, border:"none",
            background: activeTab===t.key ? "rgba(255,255,255,.22)" : "transparent",
            color:"white", fontWeight: activeTab===t.key ? 700 : 400,
            fontSize:13, cursor:"pointer",
          }}>
            {TAB_ICONS[t.key]}{t.label}
          </button>
        ))}
        <div style={{ flex:1, marginLeft:6, display:"flex", alignItems:"center", gap:7, background:"rgba(255,255,255,.2)", borderRadius:20, padding:"5px 14px" }}>
          <Search size={13} color="rgba(255,255,255,.75)" strokeWidth={2.5}/>
          <input placeholder="Tìm món (F3)" style={{ background:"transparent", border:"none", outline:"none", color:"white", fontSize:13, width:"100%" }}/>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", padding:"0 10px", gap:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.3)", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:600, color:"white", cursor:"pointer" }}>
          {selTable ? `${selTable.id}-${selTable.id+1}` : "Chọn bàn"}
          {selTable && <span onClick={e=>{e.stopPropagation();setSelTable(null);}} style={{ background:"rgba(255,255,255,.25)", borderRadius:"50%", width:14, height:14, display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, cursor:"pointer" }}>×</span>}
        </div>
        <div style={{ width:26, height:26, borderRadius:6, background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.25)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <Plus size={13} color="white"/>
        </div>
        <div style={{flex:1}}/>
        {[
          <svg key="s" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="15.54" y1="8.46" x2="19.07" y2="12"/><line x1="19.07" y1="8.46" x2="15.54" y2="12"/></svg>,
          <svg key="b" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
          <svg key="r" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
          <svg key="p" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
        ].map((ic,i)=><span key={i} style={{cursor:"pointer",display:"flex",alignItems:"center"}}>{ic}</span>)}
        <div style={{width:20,height:14,background:"#da251d",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#ffcd00",fontWeight:900}}>★</div>
        <span style={{color:"rgba(255,255,255,.85)",fontSize:12}}>▾</span>
        <span style={{color:"rgba(255,255,255,.85)",fontSize:12}}>09126217...</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.8)" strokeWidth="2" style={{cursor:"pointer"}}><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </div>
    </div>
  );
}