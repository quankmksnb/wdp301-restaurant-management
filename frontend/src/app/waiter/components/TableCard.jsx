"use client";

import { useState } from "react";
import {Utensils} from "lucide-react";

export default function TableCard({ table, isSelected, isUsed, tTotal, tQty, tDishes, onClick }) {
  const [h, setH] = useState(false);
  let bd, bg, txt, sub, iconColor;
  if (isSelected)   { bd="#1d4ed8"; bg="#1d4ed8"; txt="#fff";    sub="rgba(255,255,255,.8)"; iconColor="rgba(255,255,255,.6)"; }
  else if (isUsed)  { bd="#7eb8f7"; bg="#dbeafe"; txt="#1e3a8a"; sub="#3b82f6"; iconColor="#3b82f6"; }
  else if (h)       { bd="#b0b8c4"; bg="#e5e8ed"; txt="#1e293b"; sub="#64748b"; iconColor="#7ba7d4"; }
  else              { bd="#c5cdd8"; bg="#ffffff"; txt="#1e293b"; sub="#64748b"; iconColor="#7ba7d4"; }

 const bar = (pos) => ({
  position:"absolute",
  [pos]:0,
  left:"50%",
  transform:"translateX(-50%)",
  width:"52%",
  height:9,
  background:bg,

  borderTop:`1.5px solid ${bd}`,
  borderLeft:`1.5px solid ${bd}`,
  borderRight:`1.5px solid ${bd}`,
  borderBottom:`1.5px solid ${bd}`,

  ...(pos==="top"
    ? { borderBottom:"none", borderRadius:"4px 4px 0 0" }
    : { borderTop:"none", borderRadius:"0 0 4px 4px" }),

  zIndex:1,
  transition:"all .12s",
});

  return (
    <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ position:"relative", paddingTop:8, paddingBottom:8, cursor:"pointer", userSelect:"none" }}>
      <div style={bar("top")}/>
      <div style={{
        position:"relative", zIndex:2, height:80, borderRadius:18,
        border:`1.5px solid ${bd}`, background:bg,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3,
        boxShadow: isSelected?"0 4px 14px rgba(29,78,216,.3)":isUsed?"0 2px 8px rgba(30,64,175,.15)":h?"0 2px 8px rgba(0,0,0,.12)":"0 1px 4px rgba(0,0,0,.08)",
        transition:"all .12s",
      }}>
        {(isUsed||isSelected)&&tTotal>0 ? (
          <>
            <div style={{fontSize:11.5,fontWeight:700,color:isSelected?"#fff":"#1d4ed8",display:"flex",alignItems:"baseline",gap:3}}>
              {tTotal.toLocaleString("vi-VN")}
              <span style={{fontSize:10,fontWeight:400,color:sub}}>{tQty}p</span>
            </div>
            <div style={{fontSize:10,color:sub,display:"flex",gap:5}}><span>✦ {tDishes}</span><span>•</span><span>👤 1</span></div>
            <div style={{fontSize:12,fontWeight:600,color:txt}}>{table.name}</div>
          </>
        ) : (
          <>
            <Utensils size={20} color={iconColor}/>
            <span style={{fontSize:12,color:txt,fontWeight:500,marginTop:2}}>{table.name}</span>
          </>
        )}
      </div>
      <div style={bar("bottom")}/>
    </div>
  );
}