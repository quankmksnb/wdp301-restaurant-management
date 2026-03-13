"use client";

import { useState, useEffect } from "react";
import { Search} from "lucide-react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import WaiterHeader from "./components/WaiterHeader";
import OrderPanel from "./components/OrderPanel";
import TableCard from "./components/TableCard";
import FoodCard from "./components/FoodCard";

const ALL_TABLES = [
  { id:1,  name:"Bàn 1",        floor:"all"  },
  { id:2,  name:"Bàn 2",        floor:"all"  },
  { id:3,  name:"Bàn 3",        floor:"all"  },
  { id:4,  name:"Bàn 4",        floor:"all"  },
  { id:5,  name:"Bàn 5",        floor:"all"  },
  { id:6,  name:"Bàn 6",        floor:"all"  },
  { id:7,  name:"Bàn 7",        floor:"all"  },
  { id:8,  name:"Bàn 8",        floor:"all"  },
  { id:9,  name:"Bàn 9",        floor:"all"  },
  { id:10, name:"Bàn 10",       floor:"all"  },
  { id:11, name:"Bàn 11",       floor:"all"  },
  { id:12, name:"Bàn 12",       floor:"all"  },
  { id:13, name:"Bàn 13",       floor:"lau2" },
  { id:14, name:"Bàn 14",       floor:"lau2" },
  { id:15, name:"Bàn 15",       floor:"lau3" },
  { id:16, name:"Bàn 16",       floor:"lau3" },
  { id:17, name:"Bàn 17",       floor:"lau3" },
  { id:18, name:"Bàn 18",       floor:"lau3" },
  { id:19, name:"Bàn 19",       floor:"all"  },
  { id:20, name:"Bàn 20",       floor:"all"  },
  { id:21, name:"Phòng VIP 1",  floor:"vip"  },
  { id:22, name:"Phòng VIP 10", floor:"vip"  },
  { id:23, name:"Phòng VIP 2",  floor:"vip"  },
  { id:24, name:"Phòng VIP 3",  floor:"vip"  },
  { id:25, name:"Phòng VIP 4",  floor:"vip"  },
  { id:26, name:"Phòng VIP 5",  floor:"vip"  },
];

const FLOORS = [
  { key:"all",  label:"Tất cả"    },
  { key:"lau2", label:"Lầu 2"     },
  { key:"lau3", label:"Lầu 3"     },
  { key:"vip",  label:"Phòng VIP" },
];

const CATEGORIES = [
  { key:"all",      label:"Tất cả"           },
  { key:"bia",      label:"BIA & THUỐC LÁ"   },
  { key:"cocktail", label:"CLASSIC COCKTAILS" },
  { key:"khai_vi",  label:"MÓN KHAI VỊ"      },
  { key:"sup",      label:"SÚP"              },
  { key:"tea",      label:"TEA"              },
];

const ALL_FOODS = [
  { id:1,  name:"MILANO",                                  price:30000,  cat:"cocktail", img:"https://images.unsplash.com/photo-1560508180-03f285f67ded?w=300&h=200&fit=crop" },
  { id:2,  name:"APEROL SPRITZ",                          price:30000,  cat:"cocktail", img:"https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=300&h=200&fit=crop" },
  { id:3,  name:"CUBA LIBRE",                             price:30000,  cat:"cocktail", img:"https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=300&h=200&fit=crop" },
  { id:4,  name:"GIN FIZZ",                               price:30000,  cat:"cocktail", img:"https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?w=300&h=200&fit=crop" },
  { id:5,  name:"BLOODY MARY",                            price:30000,  cat:"cocktail", img:"https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1?w=300&h=200&fit=crop" },
  { id:6,  name:"CBánh mì bò lò đậm bông & phomai",      price:125000, cat:"khai_vi",  img:"https://images.unsplash.com/photo-1509722747041-616f39b57569?w=300&h=200&fit=crop" },
  { id:7,  name:"Thịt nguội & phomai viên chiên kiểu Tây Ba Nha", price:125000, cat:"khai_vi", img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop" },
  { id:8,  name:"Đĩa thịt nguội Tây Ba Nha hảo hạng",    price:125000, cat:"khai_vi",  img:"https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop" },
  { id:9,  name:"Phomai dây Nga",                         price:125000, cat:"khai_vi",  img:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=200&fit=crop" },
  { id:10, name:"Xúc xích Đức nướng mù tạt vàng",        price:125000, cat:"khai_vi",  img:"https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=300&h=200&fit=crop" },
  { id:11, name:"Súp kem rau 4 mùa",                      price:125000, cat:"sup",      img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop" },
  { id:12, name:"Súp kem gà nữ hoàng",                    price:125000, cat:"sup",      img:"https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=300&h=200&fit=crop" },
  { id:13, name:"Súp hành tây kiểu Pháp",                 price:125000, cat:"sup",      img:"https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=300&h=200&fit=crop" },
  { id:14, name:"Súp kem bí đỏ với sữa dừa",              price:125000, cat:"sup",      img:"https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300&h=200&fit=crop" },
  { id:15, name:"Súp kem kiểu Paris",                     price:125000, cat:"sup",      img:"https://images.unsplash.com/photo-1571167530149-c1105da4c2c0?w=300&h=200&fit=crop" },
  { id:16, name:"Lemon Tea",                               price:15000,  cat:"tea",      img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop" },
  { id:17, name:"Peach Tea",                               price:15000,  cat:"tea",      img:"https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop" },
  { id:18, name:"Mint Tea",                                price:15000,  cat:"tea",      img:"https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=300&h=200&fit=crop" },
  { id:19, name:"Lipton with milk",                        price:15000,  cat:"tea",      img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop" },
  { id:20, name:"Lemon Juice",                             price:15000,  cat:"tea",      img:"https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300&h=200&fit=crop" },
  { id:21, name:"Bia Heineken",                            price:30000,  cat:"bia",      img:"https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop" },
  { id:22, name:"Bia Hà Nội",                              price:30000,  cat:"bia",      img:"https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=300&h=200&fit=crop" },
  { id:23, name:"Thuốc lá Vinataba",                       price:30000,  cat:"bia",      img:"https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=300&h=200&fit=crop" },
  { id:24, name:"Thuốc lá Marlboro",                       price:30000,  cat:"bia",      img:"https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=300&h=200&fit=crop" },
];

export default function WaiterPage() {
  const [activeTab,   setActiveTab  ] = useState("phonban");
  const [selTable,    setSelTable   ] = useState(null);
  const [tOrders,     setTOrders    ] = useState({});
  const [activeFloor, setActiveFloor] = useState("all");
  const [filter,      setFilter     ] = useState("all");
  const [activeCat,   setActiveCat  ] = useState("all");
  const [kitchenDone, setKitchenDone] = useState([]);

  const cart       = selTable ? (tOrders[selTable.id] || []) : [];
  const setCart    = (c) => { if(selTable) setTOrders(p=>({...p,[selTable.id]:c})); };
  const addFood    = (f) => {
    if (!selTable) { alert("Vui lòng chọn bàn trước!"); return; }
    const ex = cart.find(i=>i.id===f.id);
    setCart(ex ? cart.map(i=>i.id===f.id?{...i,qty:i.qty+1}:i) : [...cart,{...f,qty:1}]);
  };
  const inc        = (id) => setCart(cart.map(i=>i.id===id?{...i,qty:i.qty+1}:i));
  const dec        = (id) => setCart(cart.map(i=>i.id===id?{...i,qty:i.qty-1}:i).filter(i=>i.qty>0));
  const removeItem = (id) => setCart(cart.filter(i=>i.id!==id));

  const total   = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const usedIds = Object.keys(tOrders).filter(id=>(tOrders[id]?.length||0)>0).map(Number);
  const fmt     = n => n.toLocaleString("vi-VN");
  const floorLabel = FLOORS.find(f=>f.key===selTable?.floor)?.label || "Tất cả";

  // demo bep làm xong món sau 8s kể từ khi món đó được thêm vào giỏ
  useEffect(()=>{
    if (cart.length===0) return;
    const t = setTimeout(()=>{
      const notDone = cart.filter(i=>!kitchenDone.includes(i.id));
      if(notDone.length>0) {
        const pick = notDone[Math.floor(Math.random()*notDone.length)];
        setKitchenDone(p=>[...p,pick.id]);
      }
    }, 8000);
    return ()=>clearTimeout(t);
  }, [cart, kitchenDone]);

  const visible = ALL_TABLES.filter(t => {
    const ok = activeFloor==="all" || t.floor===activeFloor || t.floor==="all";
    if(filter==="used")  return ok && usedIds.includes(t.id);
    if(filter==="empty") return ok && !usedIds.includes(t.id);
    return ok;
  });

  const menuFoods = ALL_FOODS.filter(f => activeCat==="all" || f.cat===activeCat);

  return (
    <ProtectedRoute role="waiter">
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:"#e8ecf1",fontFamily:"'Segoe UI',system-ui,sans-serif",fontSize:13,overflow:"hidden"}}>

      <WaiterHeader activeTab={activeTab} setActiveTab={setActiveTab} selTable={selTable} setSelTable={setSelTable}/>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>

        {/* ── PHÒNG BÀN ── */}
        {activeTab==="phonban" && <>
          <div style={{flex:"0 0 67%",display:"flex",flexDirection:"column",background:"#e8ecf1",overflow:"hidden"}}>
            {/* Sub-header */}
            <div style={{background:"white",padding:"0 14px",borderBottom:"1px solid #dde2e8"}}>
              <div style={{display:"flex",alignItems:"center",paddingTop:7,gap:2}}>
                {FLOORS.map(f=>(
                  <button key={f.key} onClick={()=>setActiveFloor(f.key)} style={{padding:"4px 14px",border:"none",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:activeFloor===f.key?700:400,background:activeFloor===f.key?"#1d4ed8":"transparent",color:activeFloor===f.key?"white":"#374151"}}>{f.label}</button>
                ))}
                <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                  <Search size={15} color="#6b7280" style={{cursor:"pointer"}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:20,padding:"7px 0 8px"}}>
                {[{key:"all",label:`Tất cả (${ALL_TABLES.length+2})`},{key:"used",label:`Sử dụng (${usedIds.length})`},{key:"empty",label:`Còn trống (${ALL_TABLES.length+2-usedIds.length})`}].map(s=>(
                  <label key={s.key} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
                    <input type="radio" name="filter" checked={filter===s.key} onChange={()=>setFilter(s.key)} style={{accentColor:"#2563eb",margin:0}}/>
                    <span style={{color:filter===s.key?"#2563eb":"#6b7280",fontWeight:filter===s.key?600:400}}>{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Grid */}
            <div style={{flex:1,overflowY:"auto",padding:"14px 12px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:10}}>
                {visible.map(t=>{
                  const tc=tOrders[t.id]||[];
                  return <TableCard key={t.id} table={t} isSelected={selTable?.id===t.id} isUsed={usedIds.includes(t.id)&&selTable?.id!==t.id} tTotal={tc.reduce((s,i)=>s+i.price*i.qty,0)} tQty={tc.reduce((s,i)=>s+i.qty,0)} tDishes={tc.length} onClick={()=>setSelTable(t)}/>;
                })}
              </div>
            </div>
            {/* Bottom */}
            <div style={{background:"white",borderTop:"1px solid #dde2e8",padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6b7280",cursor:"pointer"}}><input type="checkbox" style={{accentColor:"#2563eb"}}/> Mở thực đơn khi chọn bàn</label>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#6b7280"}}><span style={{cursor:"pointer",fontSize:14}}>‹</span><span>1 / 2</span><span style={{cursor:"pointer",fontSize:14}}>›</span></div>
            </div>
          </div>
          <OrderPanel selTable={selTable} floorLabel={floorLabel} cart={cart} inc={inc} dec={dec} removeItem={removeItem} fmt={fmt} total={total} kitchenDone={kitchenDone} markKitchenDone={setKitchenDone}/>
        </>}

        {/* ── THỰC ĐƠN ── */}
        {activeTab==="thucdon" && <>
          <div style={{flex:"0 0 67%",display:"flex",flexDirection:"column",background:"#f8fafc",overflow:"hidden"}}>
            {/* Category tabs */}
            <div style={{background:"white",borderBottom:"1px solid #e5e7eb",padding:"0 14px",display:"flex",alignItems:"center",overflowX:"auto"}}>
              {CATEGORIES.map(c=>(
                <button key={c.key} onClick={()=>setActiveCat(c.key)} style={{
                  padding:"10px 14px",border:"none",
                  borderBottom: activeCat===c.key ? "2.5px solid #1d4ed8" : "2.5px solid transparent",
                  background:"transparent",cursor:"pointer",fontSize:13,
                  fontWeight:activeCat===c.key?700:400,
                  color:activeCat===c.key?"#1d4ed8":"#374151",
                  whiteSpace:"nowrap",transition:"color .15s",
                }}>{c.label}</button>
              ))}
            </div>
            {/* Food grid */}
            <div style={{flex:1,overflowY:"auto",padding:"14px"}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>
                {menuFoods.map(f=>{
                  const cartItem = cart.find(i=>i.id===f.id);
                  return <FoodCard key={f.id} food={f} onAdd={addFood} cartQty={cartItem?.qty||0}/>;
                })}
              </div>
            </div>
            {/* Bottom */}
            <div style={{background:"white",borderTop:"1px solid #e5e7eb",padding:"7px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#3b82f6",cursor:"pointer"}}><span>☰</span> Hướng dẫn</div>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#6b7280"}}><span style={{cursor:"pointer",fontSize:14}}>‹</span><span>1 / 2</span><span style={{cursor:"pointer",fontSize:14}}>›</span></div>
            </div>
          </div>
          <OrderPanel selTable={selTable} floorLabel={floorLabel} cart={cart} inc={inc} dec={dec} removeItem={removeItem} fmt={fmt} total={total} kitchenDone={kitchenDone} markKitchenDone={setKitchenDone}/>
        </>}

      </div>
    </div>
    </ProtectedRoute>
  );
}