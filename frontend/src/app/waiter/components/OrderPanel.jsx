import React from "react";
import {
  Bell,
  CreditCard,
  Edit2,
  Minus,
  Plus,
  RefreshCcw,
  Search,
  ShoppingCart,
  Trash2,
  ArrowLeftRight,
    RotateCcw,
} from "lucide-react";
export default function OrderPanel({ selTable, floorLabel, cart, inc, dec, removeItem, fmt, total, kitchenDone, markKitchenDone }) {
  return (
    <div style={{ flex:1, background:"white", borderLeft:"1px solid #dde2e8", display:"flex", flexDirection:"column", minWidth:0 }}>

      {/* Table name + customer search */}
      <div style={{ padding:"9px 14px", borderBottom:"1px solid #eaecf0", display:"flex", alignItems:"center", gap:8 }}>
        <RefreshCcw size={15}/>
        <span style={{ fontWeight:700, color:"#1e293b", fontSize:13, whiteSpace:"nowrap" }}>
          {selTable ? `${selTable.name} / ${floorLabel}` : "Chọn bàn"}
        </span>
        <div style={{ flex:1, display:"flex", alignItems:"center", gap:5, border:"1px solid #e2e6ea", borderRadius:6, padding:"4px 10px", fontSize:12, color:"#94a3b8" }}>
          <Search size={12} color="#94a3b8"/> Tìm khách hàng (F4)
        </div>
        <button style={ICON_BTN}><Plus size={14} color="#6b7280"/></button>
        <button style={ICON_BTN}><ShoppingCart size={14} color="#6b7280"/></button>
        <button style={ICON_BTN}><ArrowLeftRight size={13} color="#6b7280"/></button>
      </div>

      {/* Cart */}
      <div style={{flex:1, overflowY:"auto"}}>
        {cart.length===0 ? (
          /* ── Empty state ── */
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", paddingBottom:40, color:"#94a3b8" }}>
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{marginBottom:12}}>
              <rect x="5" y="2" width="14" height="20" rx="2" stroke="#93c5fd" strokeWidth="1.5"/>
              <line x1="9" y1="7"  x2="15" y2="7"  stroke="#93c5fd" strokeWidth="1.5"/>
              <line x1="9" y1="11" x2="15" y2="11" stroke="#93c5fd" strokeWidth="1.5"/>
              <line x1="9" y1="15" x2="12" y2="15" stroke="#93c5fd" strokeWidth="1.5"/>
              <circle cx="17" cy="17" r="5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
              <line x1="17" y1="15" x2="17" y2="17" stroke="#3b82f6" strokeWidth="1.5"/>
              <circle cx="17" cy="19" r=".5" fill="#3b82f6"/>
            </svg>
            <div style={{fontSize:13, fontWeight:600, color:"#64748b", marginBottom:4}}>Chưa có món trong đơn</div>
            <div style={{fontSize:12, color:"#94a3b8", textAlign:"center"}}>Vui lòng chọn món trong thực đơn bên trái màn hình</div>
          </div>
        ) : cart.map((item,idx)=>{
          const done = kitchenDone.includes(item.id);
          return (
            <div key={item.id} style={{
              display:"flex", alignItems:"center",
              padding:"8px 12px", borderBottom:"1px solid #f1f4f8", gap:4,
              background: done ? "#f0fdf4" : "white",
              transition:"background .3s",
            }}>
              {/* Index */}
              <span style={{color:"#3b82f6",fontWeight:600,minWidth:20,fontSize:13,flexShrink:0}}>{idx+1}.</span>

              {/* Name + note */}
              <div style={{flex:1,minWidth:0}}>
                <div style={{
                  fontSize:13, fontWeight:500,
                  color: done ? "#16a34a" : "#1e293b",
                  display:"flex", alignItems:"center", gap:5,
                  transition:"color .3s",
                }}>
                  {/* Bell icon only when kitchen marks done */}
                  {done && <Bell size={13} color="#16a34a" style={{flexShrink:0}}/>}
                  <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</span>
                </div>
                {/* Note badge */}
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:4, marginTop:2,
                  background:"#f8fafc", border:"1px solid #e2e8f0",
                  borderRadius:4, padding:"1px 6px", fontSize:10, color:"#64748b", cursor:"pointer",
                }}>
                  <span>▲ {idx+1}</span>
                  <span style={{color:"#94a3b8"}}>|</span>
                  <span>☰ Ghi chú/Món thêm</span>
                </div>
              </div>

              {/* — qty + */}
              <button onClick={()=>dec(item.id)} style={QTY_BTN}><Minus size={11}/></button>
              <span style={{minWidth:18,textAlign:"center",fontSize:13,fontWeight:500}}>{item.qty}</span>
              <button onClick={()=>inc(item.id)} style={QTY_BTN}><Plus size={11}/></button>

              {/* Add more (+) */}
              <button onClick={()=>inc(item.id)} style={{...ICON_BTN, width:22, height:22, borderColor:"#d1d5db"}}>
                <Plus size={11} color="#6b7280"/>
              </button>

              {/* Delete (red) */}
              <button onClick={()=>removeItem(item.id)} style={{...ICON_BTN, width:22, height:22, border:"none", background:"transparent"}}>
                <Trash2 size={13} color="#ef4444"/>
              </button>

              {/* Unit price */}
              <span style={{minWidth:52,textAlign:"right",color:"#94a3b8",fontSize:12,flexShrink:0}}>
                {fmt(item.price)}
              </span>
              {/* Line total */}
              <span style={{minWidth:58,textAlign:"right",fontWeight:600,fontSize:13,color:"#0f172a",flexShrink:0}}>
                {fmt(item.qty*item.price)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{borderTop:"1px solid #eaecf0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",padding:"7px 12px",gap:5}}>
          {/* Branch */}
          <div style={{display:"flex",alignItems:"center",gap:3,background:"#f1f5f9",borderRadius:6,padding:"3px 8px",fontSize:12,cursor:"pointer"}}>
            <span style={{color:"#374151"}}>bonghoadepnhat</span>
            <span style={{fontSize:9,color:"#94a3b8"}}>▾</span>
          </div>
          {/* Person badge */}
          <div style={{background:"#2563eb",borderRadius:"50%",width:26,height:26,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          {/* Action icons */}
          {[
            <Edit2 size={12}/>, <RotateCcw size={12}/>,
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
            <Trash2 size={12}/>,
          ].map((ic,i)=>(
            <button key={i} style={{width:26,height:26,border:"1px solid #e2e6ea",borderRadius:5,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#6b7280",flexShrink:0}}>{ic}</button>
          ))}
          <div style={{flex:1}}/>
          <span style={{color:"#64748b",fontSize:13}}>Tổng tiền</span>
          <div style={{background:"#e2e8f0",borderRadius:4,padding:"1px 7px",fontSize:11,fontWeight:700,color:"#334155"}}>{cart.length}</div>
          <span style={{fontWeight:700,fontSize:15,color:"#0f172a"}}>{fmt(total)}</span>
        </div>

        <div style={{padding:"8px 12px 12px",display:"flex",gap:8}}>
          <button style={{flex:1,padding:"12px 0",borderRadius:8,border:"1px solid #3b82f6",background:"white",color:"#1d4ed8",display:"flex",alignItems:"center",justifyContent:"center",gap:7,cursor:"pointer",fontWeight:600,fontSize:14}}>
            <Bell size={15}/> Thông báo bếp
          </button>
          <button style={{flex:2,padding:"12px 0",borderRadius:8,border:"none",background:"#1d4ed8",color:"white",display:"flex",alignItems:"center",justifyContent:"center",gap:7,cursor:"pointer",fontWeight:600,fontSize:14}}>
            <CreditCard size={15}/> Thanh toán
          </button>
        </div>

        <div style={{background:"#1e3a8a",color:"rgba(255,255,255,.6)",fontSize:11,padding:"5px 14px",display:"flex",justifyContent:"space-between"}}>
          <span>☎ Hỗ trợ 1900 6522</span>
          <span>📍 Chi nhánh trung tâm</span>
        </div>
      </div>
    </div>
  );
}
const ICON_BTN = {
  width:28,height:28,border:"1px solid #e2e6ea",borderRadius:5,
  background:"#f8fafc",display:"flex",alignItems:"center",
  justifyContent:"center",cursor:"pointer",flexShrink:0,
};
const QTY_BTN = {
  width:23,height:23,borderRadius:4,
  border:"1px solid #d1d9e0",background:"white",
  display:"flex",alignItems:"center",justifyContent:"center",
  cursor:"pointer",color:"#374151",padding:0,flexShrink:0,
};
