"use client";

import { useState } from "react";

export default function FoodCard({ food, onAdd, cartQty }) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={() => onAdd(food)}
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      style={{
        background:"white", borderRadius:10,
        border: h ? "2px solid #3b82f6" : "1.5px solid #e5e7eb",
        cursor:"pointer", overflow:"hidden",
        boxShadow: h ? "0 6px 20px rgba(37,99,235,.2)" : "0 1px 4px rgba(0,0,0,.08)",
        transition:"all .15s",
        transform: h ? "translateY(-3px) scale(1.02)" : "none",
        position:"relative",
      }}
    >
      {/* Image */}
      <div style={{ position:"relative", paddingTop:"68%", overflow:"hidden", background:"#f1f5f9" }}>
        <img src={food.img} alt={food.name}
          style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", objectFit:"cover", transition:"transform .15s", transform: h?"scale(1.06)":"scale(1)" }}
          onError={e=>{ e.target.style.display="none"; }}
        />
        {/* Blue overlay on hover */}
        {h && (
          <div style={{ position:"absolute", inset:0, background:"rgba(37,99,235,.12)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ background:"#2563eb", borderRadius:"50%", width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Plus size={18} color="white"/>
            </div>
          </div>
        )}
        {/* Price badge */}
        <div style={{
          position:"absolute", bottom:0, left:0, right:0,
          background: h ? "rgba(37,99,235,.9)" : "rgba(29,78,216,.82)",
          color:"white", fontSize:11, fontWeight:700,
          textAlign:"center", padding:"3px 0",
        }}>
          {food.price.toLocaleString("vi-VN")}
        </div>
        {/* Cart qty badge */}
        {cartQty > 0 && (
          <div style={{
            position:"absolute", top:6, right:6,
            background:"#ef4444", color:"white", borderRadius:"50%",
            width:20, height:20, fontSize:11, fontWeight:700,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>{cartQty}</div>
        )}
      </div>
      {/* Name */}
      <div style={{
        padding:"7px 8px 8px",
        fontSize:12, fontWeight: h ? 600 : 500,
        color: h ? "#1d4ed8" : "#1e293b",
        textAlign:"center", lineHeight:1.35,
        minHeight:38, display:"flex", alignItems:"center", justifyContent:"center",
        transition:"color .15s",
      }}>
        {food.name}
      </div>
    </div>
  );
}