import { useState, useRef, useEffect } from "react";

/* ─── GOOGLE FONTS & GLOBAL STYLES ─── */
const GF = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'IBM Plex Sans',sans-serif;background:#F0F4F8;color:#0F1F3D}
    h1,h2,h3,h4,h5{font-family:'Sora',sans-serif}
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:#F0F4F8}
    ::-webkit-scrollbar-thumb{background:#93C5FD;border-radius:99px}
    .fade-in{animation:fadeIn 0.35s ease}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .card-hover{transition:box-shadow 0.2s,transform 0.2s;cursor:pointer}
    .card-hover:hover{box-shadow:0 8px 32px rgba(30,64,175,0.13);transform:translateY(-2px)}
    .btn-primary{background:linear-gradient(135deg,#1D4ED8,#2563EB);color:#fff;border:none;border-radius:10px;padding:10px 22px;font-family:'Sora',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:6px}
    .btn-primary:hover{background:linear-gradient(135deg,#1E40AF,#1D4ED8);transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,99,235,0.3)}
    .btn-outline{background:transparent;color:#1D4ED8;border:1.5px solid #1D4ED8;border-radius:10px;padding:9px 22px;font-family:'Sora',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:6px}
    .btn-outline:hover{background:#EFF6FF}
    .btn-danger{background:#FEF2F2;color:#DC2626;border:1.5px solid #FECACA;border-radius:10px;padding:9px 22px;font-family:'Sora',sans-serif;font-weight:600;font-size:14px;cursor:pointer}
    .btn-sm{padding:6px 14px;font-size:12px;border-radius:8px}
    .input{width:100%;padding:10px 14px;border:1.5px solid #DBEAFE;border-radius:10px;font-family:'IBM Plex Sans',sans-serif;font-size:14px;outline:none;background:#FAFCFF;color:#0F1F3D;transition:border 0.2s}
    .input:focus{border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,0.1)}
    .textarea{resize:vertical;min-height:90px}
    .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;font-family:'Sora',sans-serif;letter-spacing:0.3px}
    .tag-proveedor{background:#DBEAFE;color:#1E40AF}
    .tag-restaurante{background:#D1FAE5;color:#065F46}
    .tag-trabajador{background:#FEF3C7;color:#92400E}
    .tag-vacante{background:#FCE7F3;color:#831843}
    .tag-admin{background:#EDE9FE;color:#5B21B6}
    .tag-sub{background:#FEF9C3;color:#713F12}
    .sidebar-item{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;cursor:pointer;font-size:14px;font-weight:500;color:#64748B;transition:all 0.15s}
    .sidebar-item:hover{background:#EFF6FF;color:#1D4ED8}
    .sidebar-item.active{background:linear-gradient(135deg,#EFF6FF,#DBEAFE);color:#1D4ED8;font-weight:600}
    .modal-overlay{position:fixed;inset:0;background:rgba(15,31,61,0.45);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px;backdrop-filter:blur(2px)}
    .modal{background:#fff;border-radius:18px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(15,31,61,0.18)}
    .modal-wide{max-width:720px}
    .chat-bubble-me{background:linear-gradient(135deg,#1D4ED8,#2563EB);color:#fff;border-radius:16px 16px 4px 16px;padding:10px 14px;font-size:14px;line-height:1.5}
    .chat-bubble-other{background:#F1F5F9;color:#0F1F3D;border-radius:16px 16px 16px 4px;padding:10px 14px;font-size:14px;line-height:1.5}
    .cal-day{min-height:36px;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:background 0.15s;font-size:13px;padding:4px 2px}
    .cal-day:hover{background:#EFF6FF}
    .cal-day.today{background:#EFF6FF;border:2px solid #2563EB;font-weight:700}
    .cal-day.has-event{background:#FEF3C7}
    .cal-day.selected{background:#1D4ED8;color:#fff}
  `}</style>
);

/* ─── ICONS ─── */
const IC = ({ n, s = 18, c = "currentColor" }) => {
  const ic = {
    home: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    search: <><circle cx="11" cy="11" r="7" fill="none" stroke={c} strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    feed: <><rect x="3" y="4" width="18" height="4" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/><rect x="3" y="11" width="11" height="4" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/><rect x="3" y="18" width="7" height="3" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/></>,
    chat: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    star: <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    user: <><circle cx="12" cy="8" r="4" fill="none" stroke={c} strokeWidth="1.8"/><path d="M20 21a8 8 0 10-16 0" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    plus: <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" fill="none" stroke={c} strokeWidth="1.8"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" fill="none" stroke={c} strokeWidth="1.8"/></>,
    package: <><path d="M12 2l9 4.5v11L12 22l-9-4.5v-11L12 2z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 2v20M3 6.5l9 5 9-5" fill="none" stroke={c} strokeWidth="1.8"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke={c} strokeWidth="1.8"/><path d="M13.73 21a2 2 0 01-3.46 0" fill="none" stroke={c} strokeWidth="1.8"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    comment: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    x: <path d="M18 6L6 18M6 6l12 12" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>,
    check: <path d="M20 6L9 17l-5-5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="8.5" cy="8.5" r="1.5" fill={c}/><polyline points="21,15 16,10 5,21" fill="none" stroke={c} strokeWidth="1.8"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><polygon points="22,2 15,22 11,13 2,9" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={c} strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke={c} strokeWidth="1.8"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={c} strokeWidth="1.8"/></>,
    map: <><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="10" r="3" fill="none" stroke={c} strokeWidth="1.8"/></>,
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="9" cy="7" r="4" fill="none" stroke={c} strokeWidth="1.8"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" fill="none" stroke={c} strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" fill="none" stroke={c} strokeWidth="1.8"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></>,
    filter: <><line x1="4" y1="6" x2="20" y2="6" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="11" y1="18" x2="13" y2="18" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{ic[n]}</svg>;
};

/* ─── MOCK DATA ─── */
let USERS = [
  { id:"u1", name:"Distribuidora Fresca SA", type:"proveedor", email:"fresca@demo.com", password:"1234", rfc:"DFR920115AB2", avatar:"DF", rating:4.5, reviewCount:28, category:"Frutas y Verduras", location:"CDMX", description:"Distribuidora mayorista de frutas, verduras y hierbas frescas. Más de 15 años abasteciendo los mejores restaurantes.",
    billing:{razonSocial:"Distribuidora Fresca SA de CV",rfc:"DFR920115AB2",regimen:"Régimen General de Ley",cfdi:"G03 – Gastos en general",banco:"BBVA",cuenta:"012345678901",clabe:"012180012345678901",cp:"06600"} },
  { id:"u2", name:"Carnes Premium MX", type:"proveedor", email:"carnes@demo.com", password:"1234", rfc:"CPM101010XY9", avatar:"CP", rating:4.8, reviewCount:45, category:"Carnes y Embutidos", location:"Monterrey", description:"Proveedores de cortes premium nacionales e importados. Maduración controlada, entregas diarias.",
    billing:{razonSocial:"Carnes Premium MX SA de CV",rfc:"CPM101010XY9",regimen:"Régimen General de Ley",cfdi:"G03 – Gastos en general",banco:"Banorte",cuenta:"987654321",clabe:"072500009876543210",cp:"64000"} },
  { id:"u3", name:"Restaurante El Fogón", type:"restaurante", email:"fogon@demo.com", password:"1234", rfc:"REF150320CX3", avatar:"EF", rating:4.2, reviewCount:15, location:"CDMX",
    billing:{razonSocial:"Restaurante El Fogón SA de CV",rfc:"REF150320CX3",regimen:"Régimen General de Ley",cfdi:"D01 – Honorarios médicos",banco:"Santander",cuenta:"123456789",clabe:"014180001234567890",cp:"11560"} },
  { id:"u4", name:"Cocina Tradicional", type:"restaurante", email:"trad@demo.com", password:"1234", rfc:"COT200101AB1", avatar:"CT", rating:4.0, reviewCount:8, location:"Guadalajara", billing:null },
  { id:"u5", name:"Juan Pérez García", type:"trabajador", email:"juan@demo.com", password:"1234", curp:"PEGJ870522HDFRRN09", avatar:"JP", rating:4.7, reviewCount:12,
    skills:["Chef de Partida","Parrillero","Cocina Mexicana"], location:"CDMX", age:36, zone:"Benito Juárez, CDMX",
    description:"Chef con 8 años de experiencia en cocina mexicana contemporánea y tradicional.",
    workHistory:[{place:"El Bajío",position:"Chef de Partida",duration:"3 años"},{place:"Pujol",position:"Cocinero B",duration:"1 año"}] },
  { id:"admin", name:"Admin RestLink", type:"admin", email:"admin@restlink.mx", password:"admin2024", avatar:"AD" },
];

let PRODUCTS = [
  { id:"p1", providerId:"u1", name:"Jitomate Saladet", price:18.50, unit:"kg", description:"Jitomate fresco de temporada, seleccionado a mano.", category:"Frutas y Verduras", minOrder:"5 kg" },
  { id:"p2", providerId:"u1", name:"Aguacate Hass", price:45.00, unit:"kg", description:"Aguacate Hass premium, maduración controlada.", category:"Frutas y Verduras", minOrder:"3 kg" },
  { id:"p3", providerId:"u2", name:"Arrachera USDA Choice", price:285.00, unit:"kg", description:"Corte premium importado, empacado al vacío.", category:"Carnes y Embutidos", minOrder:"2 kg" },
  { id:"p4", providerId:"u2", name:"Rib Eye Nacional", price:320.00, unit:"kg", description:"Madurado 21 días, grasa marmoleada.", category:"Carnes y Embutidos", minOrder:"1 kg" },
];

let POSTS = [
  { id:"post1", authorId:"u3", authorName:"Restaurante El Fogón", authorAvatar:"EF", authorType:"restaurante", type:"general", content:"¡Renovamos nuestra cocina! Buscamos proveedores de gas LP con contrato mensual para zona norte CDMX. 🔥", audience:["proveedor","restaurante"], likes:12, likedBy:[], comments:[{id:"c1",authorId:"u2",authorName:"Carnes Premium MX",authorAvatar:"CP",content:"Trabajamos con GasMax, excelente servicio.",time:"1h"}], time:"2h", photos:[] },
  { id:"post2", authorId:"u4", authorName:"Cocina Tradicional", authorAvatar:"CT", authorType:"restaurante", type:"vacante", content:"🍳 BUSCAMOS CHEF DE PARTIDA\n\nPuesto: Chef de Partida — Área Caliente\nSueldo: $14,000–$18,000 MXN mensual\nHorario: Mar–Dom 2pm–12am\nUbicación: Polanco, CDMX", audience:["trabajador"], likes:8, likedBy:[], comments:[], time:"5h", photos:[], vacancyInfo:{position:"Chef de Partida",salary:"$14,000–$18,000",schedule:"Mar–Dom 2pm–12am",location:"Polanco, CDMX"} },
];

let REVIEWS = [
  { id:"r1", fromId:"u3", fromName:"Restaurante El Fogón", fromAvatar:"EF", toId:"u1", rating:5, comment:"Excelente calidad y puntualidad.", time:"hace 2 días" },
  { id:"r2", fromId:"u4", fromName:"Cocina Tradicional", fromAvatar:"CT", toId:"u2", rating:4, comment:"Buen producto, precios justos.", time:"hace 1 semana" },
];

let CHATS = {
  "u1-u3":[{from:"u3",text:"Hola! Me interesa el aguacate Hass.",time:"10:24"},{from:"u1",text:"¡Hola! Sí, tenemos stock. ¿Cuántos kilos?",time:"10:31"},{from:"u3",text:"Unos 15 kg para el fin de semana.",time:"10:33"},{from:"u1",text:"Perfecto, $45/kg. ¿Confirmamos?",time:"10:35"}],
};

let APPOINTMENTS = [
  { id:"apt1", participants:["u1","u3"], title:"Revisión de contrato anual", date:"2026-03-10", time:"10:00", status:"confirmed", createdBy:"u3", note:"Reunión en las instalaciones" },
  { id:"apt2", participants:["u4","u2"], title:"Cata de cortes nuevos", date:"2026-03-15", time:"14:00", status:"pending", createdBy:"u4", note:"" },
];

let SUBACCOUNTS = [
  { id:"sub1", parentId:"u3", name:"María González", email:"maria@fogon.com", password:"1234", position:"Gerente de Compras", avatar:"MG" },
];

const SERVICE_CATS = ["Frutas y Verduras","Carnes y Embutidos","Mariscos","Lácteos y Fríos","Abarrotes","Bebidas","Panadería","Limpieza e Higiene","Vajilla y Utensilios","Gas LP","Equipos de Cocina","Refrigeración","Electricistas","Técnicos de Gas","Plomeros","Reparadores de Equipo","Publicidad y Marketing","Diseño y Branding","Fotografía","Contabilidad","Recursos Humanos","Otros Servicios"];
const CAT_EMOJI = {"Frutas y Verduras":"🥦","Carnes y Embutidos":"🥩","Mariscos":"🦐","Lácteos y Fríos":"🧀","Abarrotes":"🛒","Bebidas":"🍶","Panadería":"🥐","Limpieza e Higiene":"🧹","Vajilla y Utensilios":"🍽️","Gas LP":"🔥","Equipos de Cocina":"🍳","Refrigeración":"❄️","Electricistas":"⚡","Técnicos de Gas":"🔧","Plomeros":"🔩","Reparadores de Equipo":"🛠️","Publicidad y Marketing":"📢","Diseño y Branding":"🎨","Fotografía":"📸","Contabilidad":"📊","Recursos Humanos":"👥","Otros Servicios":"💼"};

const TC = {proveedor:"#1E40AF",restaurante:"#065F46",trabajador:"#92400E",admin:"#5B21B6",sub:"#713F12"};
const TL = {proveedor:"Proveedor",restaurante:"Restaurante",trabajador:"Trabajador",admin:"Admin",sub:"Subcuenta"};

/* ─── SHARED HELPERS ─── */
const Av = ({initials,size=40,color="#1D4ED8"}) => (
  <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,${color},${color}AA)`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:size*0.35,flexShrink:0,letterSpacing:0.5}}>
    {initials}
  </div>
);

const Stars = ({rating,size=14}) => (
  <span style={{display:"inline-flex",gap:2}}>
    {[1,2,3,4,5].map(i=>(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={i<=Math.round(rating)?"#F59E0B":"none"} stroke={i<=Math.round(rating)?"#F59E0B":"#D1D5DB"} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ))}
  </span>
);

const Modal = ({open,onClose,title,children,wide}) => {
  if(!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal${wide?" modal-wide":""}`} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D"}}>{title}</h3>
          <button style={{background:"none",border:"none",cursor:"pointer",color:"#64748B"}} onClick={onClose}><IC n="x" s={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Field = ({label,children,full}) => (
  <div style={{gridColumn:full?"1/-1":"auto"}}>
    <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>{label}</label>
    {children}
  </div>
);

/* ══════════════════════════════════════════════════════
   LANDING
══════════════════════════════════════════════════════ */
const Landing = ({onLogin,onReg}) => (
  <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F1F3D 0%,#1E3A6E 50%,#1D4ED8 100%)",display:"flex",flexDirection:"column"}}>
    <style>{`.lcard{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:16px;padding:28px;backdrop-filter:blur(10px);transition:all 0.2s}.lcard:hover{background:rgba(255,255,255,0.13);transform:translateY(-4px)}`}</style>
    <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 48px"}}>
      <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:24,color:"#fff",letterSpacing:-0.5}}>Rest<span style={{color:"#60A5FA"}}>Link</span></div>
      <div style={{display:"flex",gap:12}}>
        <button className="btn-outline" style={{color:"#93C5FD",borderColor:"#93C5FD"}} onClick={onLogin}>Iniciar Sesión</button>
        <button className="btn-primary" onClick={onReg}>Crear Cuenta</button>
      </div>
    </nav>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",gap:24}}>
      <div style={{background:"rgba(96,165,250,0.15)",border:"1px solid rgba(96,165,250,0.3)",borderRadius:99,padding:"6px 20px",color:"#93C5FD",fontSize:13,fontWeight:600,fontFamily:"Sora,sans-serif"}}>
        🇲🇽 La plataforma B2B para la gastronomía y hospitalidad de México
      </div>
      <h1 style={{color:"#fff",fontSize:"clamp(36px,5vw,68px)",fontWeight:800,lineHeight:1.1,maxWidth:800,letterSpacing:-1.5}}>
        Conecta tu negocio con los mejores <span style={{color:"#60A5FA"}}>proveedores</span> y <span style={{color:"#34D399"}}>talento</span>
      </h1>
      <p style={{color:"#93C5FD",fontSize:18,maxWidth:560,lineHeight:1.7}}>
        RestLink une restaurantes, proveedores, técnicos y trabajadores del sector en un solo lugar.
      </p>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <button className="btn-primary" style={{padding:"14px 32px",fontSize:16}} onClick={onReg}>Comenzar Gratis</button>
        <button className="btn-outline" style={{padding:"14px 32px",fontSize:16,color:"#93C5FD",borderColor:"#93C5FD"}} onClick={onLogin}>Ver Demo</button>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,padding:"0 48px 64px",maxWidth:1100,margin:"0 auto",width:"100%"}}>
      {[{e:"🏪",t:"Proveedores y Servicios",d:"Publica tu catálogo, gestiona pedidos y conecta con restaurantes."},{e:"🍽️",t:"Restaurantes y Negocios",d:"Encuentra proveedores, publica vacantes y digitaliza tu operación."},{e:"👨‍🍳",t:"Trabajadores",d:"Descubre oportunidades laborales y muestra tu CV profesional."}].map(f=>(
        <div key={f.t} className="lcard"><div style={{fontSize:36,marginBottom:12}}>{f.e}</div><h3 style={{color:"#fff",fontWeight:700,marginBottom:8,fontSize:16}}>{f.t}</h3><p style={{color:"#93C5FD",fontSize:14,lineHeight:1.6}}>{f.d}</p></div>
      ))}
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════ */
const AuthPage = ({mode,onSwitch,onSuccess}) => {
  const [type,setType] = useState("restaurante");
  const [f,setF] = useState({name:"",email:"",password:"",rfc:"",curp:""});
  const [err,setErr] = useState("");

  const login = () => {
    // check main users
    let u = USERS.find(u=>u.email===f.email && u.password===f.password);
    // check subaccounts
    if(!u){ const sub = SUBACCOUNTS.find(s=>s.email===f.email && s.password===f.password); if(sub){ u={...sub,type:"sub",parentId:sub.parentId}; } }
    if(u) onSuccess(u);
    else setErr("Correo o contraseña incorrectos. Demo: fogon@demo.com / 1234");
  };

  const register = () => {
    if(!f.name||!f.email||!f.password){setErr("Completa los campos obligatorios.");return;}
    if(type!=="trabajador"&&!f.rfc){setErr("El RFC es obligatorio para negocios.");return;}
    if(type==="trabajador"&&!f.curp){setErr("La CURP es obligatoria para trabajadores.");return;}
    if(type!=="trabajador"&&f.rfc.length!==13){setErr("El RFC debe tener 13 caracteres.");return;}
    if(type==="trabajador"&&f.curp.length!==18){setErr("La CURP debe tener 18 caracteres.");return;}
    const nu={id:"u_"+Date.now(),name:f.name,email:f.email,password:f.password,type,rfc:f.rfc||"",curp:f.curp||"",avatar:f.name.slice(0,2).toUpperCase(),rating:0,reviewCount:0,location:"México",description:"",billing:null,skills:[],workHistory:[],age:null,zone:""};
    USERS.push(nu);
    onSuccess(nu);
  };

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F1F3D,#1E3A6E)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:40,width:"100%",maxWidth:460,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:28,color:"#0F1F3D",letterSpacing:-0.5}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
          <p style={{color:"#64748B",marginTop:8,fontSize:15}}>{mode==="login"?"Bienvenido de vuelta":"Crea tu cuenta profesional"}</p>
        </div>
        {err&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 14px",color:"#DC2626",fontSize:13,marginBottom:16}}>{err}</div>}

        {mode==="register"&&(
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:10}}>Tipo de cuenta</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
              {["restaurante","proveedor","trabajador"].map(t=>(
                <button key={t} onClick={()=>setType(t)} style={{padding:"10px 6px",border:`2px solid ${type===t?"#2563EB":"#E2E8F0"}`,borderRadius:10,background:type===t?"#EFF6FF":"#fff",color:type===t?"#1D4ED8":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:11,cursor:"pointer"}}>
                  {t==="restaurante"?"🍽️":t==="proveedor"?"📦":"👨‍🍳"}<br/>{TL[t]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {mode==="register"&&(
            <div>
              <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>{type==="trabajador"?"Nombre completo *":"Nombre del negocio *"}</label>
              <input className="input" placeholder={type==="trabajador"?"Ej: Juan Pérez García":"Ej: Restaurante El Fogón"} value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
            </div>
          )}
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>Correo electrónico *</label>
            <input className="input" type="email" placeholder="correo@empresa.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/>
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>Contraseña *</label>
            <input className="input" type="password" placeholder="••••••••" value={f.password} onChange={e=>setF({...f,password:e.target.value})}/>
          </div>
          {mode==="register"&&type!=="trabajador"&&(
            <div>
              <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>RFC del negocio * <span style={{fontWeight:400,color:"#94A3B8"}}>(13 caracteres)</span></label>
              <input className="input" placeholder="Ej: REF150320CX3" maxLength={13} value={f.rfc} onChange={e=>setF({...f,rfc:e.target.value.toUpperCase()})}/>
            </div>
          )}
          {mode==="register"&&type==="trabajador"&&(
            <div>
              <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>CURP * <span style={{fontWeight:400,color:"#94A3B8"}}>(18 caracteres)</span></label>
              <input className="input" placeholder="Ej: PEGJ870522HDFRRN09" maxLength={18} value={f.curp} onChange={e=>setF({...f,curp:e.target.value.toUpperCase()})}/>
            </div>
          )}
        </div>

        {mode==="login"&&<p style={{fontSize:12,color:"#94A3B8",margin:"14px 0"}}>Demo: fogon@demo.com | fresca@demo.com | juan@demo.com | admin@restlink.mx — pass: 1234 / admin2024</p>}

        <button className="btn-primary" style={{width:"100%",padding:13,marginTop:20,justifyContent:"center"}} onClick={mode==="login"?login:register}>
          {mode==="login"?"Iniciar Sesión":"Crear Cuenta"}
        </button>
        <p style={{textAlign:"center",marginTop:18,fontSize:14,color:"#64748B"}}>
          {mode==="login"?"¿No tienes cuenta? ":"¿Ya tienes cuenta? "}
          <span style={{color:"#2563EB",fontWeight:600,cursor:"pointer"}} onClick={onSwitch}>{mode==="login"?"Regístrate":"Inicia sesión"}</span>
        </p>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════════════ */
const Layout = ({user,view,setView,children}) => {
  const isAdmin = user.type==="admin";
  const isSub = user.type==="sub";
  const baseType = isSub ? "restaurante" : user.type;

  const navMap = {
    restaurante:[{id:"feed",l:"Feed",i:"feed"},{id:"search",l:"Buscar Proveedores",i:"search"},{id:"vacantes",l:"Vacantes",i:"briefcase"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"},{id:"ratings",l:"Calificaciones",i:"star"},{id:"subaccounts",l:"Subcuentas",i:"users"},{id:"profile",l:"Mi Perfil",i:"user"}],
    proveedor:[{id:"feed",l:"Feed",i:"feed"},{id:"catalog",l:"Mi Catálogo",i:"package"},{id:"search",l:"Directorio",i:"search"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"},{id:"ratings",l:"Calificaciones",i:"star"},{id:"subaccounts",l:"Subcuentas",i:"users"},{id:"profile",l:"Mi Perfil",i:"user"}],
    trabajador:[{id:"feed",l:"Vacantes & Feed",i:"briefcase"},{id:"search",l:"Directorio",i:"search"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"},{id:"ratings",l:"Calificaciones",i:"star"},{id:"profile",l:"Mi Perfil",i:"user"}],
    admin:[{id:"admin",l:"Dashboard",i:"trending"},{id:"admin_users",l:"Usuarios",i:"users"},{id:"admin_content",l:"Contenido",i:"feed"},{id:"admin_reports",l:"Reportes",i:"star"}],
  };

  const subNav = [{id:"feed",l:"Feed",i:"feed"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"}];
  const items = isAdmin ? navMap.admin : isSub ? subNav : (navMap[user.type]||navMap.restaurante);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#F0F4F8"}}>
      <aside style={{width:240,background:"#fff",borderRight:"1px solid #E2ECF8",display:"flex",flexDirection:"column",padding:"24px 16px",position:"fixed",top:0,left:0,bottom:0,zIndex:100,boxShadow:"2px 0 16px rgba(15,31,61,0.05)"}}>
        <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:"#0F1F3D",marginBottom:24,paddingLeft:6,letterSpacing:-0.5}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#F8FAFF",border:"1px solid #DBEAFE",borderRadius:12,padding:"10px 12px",marginBottom:22}}>
          <Av initials={user.avatar} size={34} color={TC[user.type]||"#1D4ED8"}/>
          <div style={{overflow:"hidden"}}>
            <div style={{fontWeight:700,fontSize:12,fontFamily:"Sora,sans-serif",color:"#0F1F3D",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
            <span className={`tag tag-${user.type}`} style={{fontSize:10}}>{TL[user.type]||user.type}</span>
          </div>
        </div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:3}}>
          {items.map(item=>(
            <div key={item.id} className={`sidebar-item${view===item.id?" active":""}`} onClick={()=>setView(item.id)}>
              <IC n={item.i} s={16}/><span style={{fontSize:13}}>{item.l}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-item" style={{marginTop:8,color:"#94A3B8"}} onClick={()=>window.location.reload()}>
          <IC n="logout" s={16}/><span style={{fontSize:13}}>Cerrar Sesión</span>
        </div>
      </aside>
      <main style={{marginLeft:240,flex:1,padding:"28px 32px",maxWidth:"calc(100vw - 240px)"}}>
        <div className="fade-in">{children}</div>
      </main>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SEARCH / DIRECTORIO
══════════════════════════════════════════════════════ */
const SearchPage = ({currentUser,onOpenProfile,onOpenChat}) => {
  const [q,setQ] = useState("");
  const [filterCat,setFilterCat] = useState("all");
  const providers = USERS.filter(u=>u.type==="proveedor"||u.type==="restaurante");

  const filteredProducts = PRODUCTS.filter(p=>{
    const prov = USERS.find(u=>u.id===p.providerId);
    const mq = !q||p.name.toLowerCase().includes(q.toLowerCase())||(prov?.name||"").toLowerCase().includes(q.toLowerCase());
    const mc = filterCat==="all"||p.category===filterCat;
    return mq&&mc;
  });

  return (
    <div>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Directorio</h2>
        <p style={{color:"#64748B",fontSize:14}}>Encuentra proveedores, servicios y productos para tu negocio</p>
      </div>
      <div style={{background:"#fff",border:"1px solid #DBEAFE",borderRadius:14,padding:18,marginBottom:24,boxShadow:"0 2px 12px rgba(30,64,175,0.06)"}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{flex:1,minWidth:220,position:"relative"}}>
            <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94A3B8"}}><IC n="search" s={16}/></div>
            <input className="input" placeholder="Buscar proveedor, producto, servicio..." style={{paddingLeft:40}} value={q} onChange={e=>setQ(e.target.value)}/>
          </div>
          <select className="input" style={{width:"auto",minWidth:180}} value={filterCat} onChange={e=>setFilterCat(e.target.value)}>
            <option value="all">Todas las categorías</option>
            {SERVICE_CATS.map(c=><option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>)}
          </select>
        </div>
      </div>

      <h3 style={{fontSize:15,fontWeight:700,color:"#1E3A6E",marginBottom:14}}>Proveedores y Negocios</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14,marginBottom:28}}>
        {providers.map(p=>(
          <div key={p.id} className="card-hover" style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:18,boxShadow:"0 2px 8px rgba(30,64,175,0.05)"}} onClick={()=>onOpenProfile(p)}>
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <Av initials={p.avatar} size={46} color={TC[p.type]}/>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:"#0F1F3D",marginBottom:3}}>{p.name}</div>
                <span className={`tag tag-${p.type}`}>{TL[p.type]}</span>
                {p.category&&<span className="tag" style={{background:"#F1F5F9",color:"#475569",marginLeft:4}}>{p.category}</span>}
              </div>
            </div>
            {p.rating>0&&<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><Stars rating={p.rating}/><span style={{fontSize:12,fontWeight:600}}>{p.rating}</span><span style={{fontSize:11,color:"#94A3B8"}}>({p.reviewCount})</span></div>}
            <p style={{fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:12}}>{(p.description||"").substring(0,80)}{(p.description||"").length>80?"...":""}</p>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-primary btn-sm" onClick={e=>{e.stopPropagation();onOpenChat(p);}}>💬 Contactar</button>
              <button className="btn-outline btn-sm" onClick={e=>{e.stopPropagation();onOpenProfile(p);}}>Ver perfil</button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{fontSize:15,fontWeight:700,color:"#1E3A6E",marginBottom:14}}>Productos y Servicios ({filteredProducts.length})</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {filteredProducts.map(p=>{
          const prov = USERS.find(u=>u.id===p.providerId);
          return (
            <div key={p.id} className="card-hover" style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,overflow:"hidden"}} onClick={()=>{if(prov)onOpenChat(prov);}}>
              <div style={{height:88,background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
                {CAT_EMOJI[p.category]||"📦"}
              </div>
              <div style={{padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#0F1F3D"}}>{p.name}</div>
                  <div style={{fontWeight:800,color:"#1D4ED8",fontSize:14}}>${p.price}<span style={{fontSize:10,fontWeight:500,color:"#64748B"}}>/{p.unit}</span></div>
                </div>
                <p style={{fontSize:11,color:"#64748B",lineHeight:1.5,marginBottom:8}}>{p.description}</p>
                <div style={{fontSize:10,color:"#94A3B8",marginBottom:8}}>Min: {p.minOrder} · {prov?.name}</div>
                <button className="btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={e=>{e.stopPropagation();if(prov)onOpenChat(prov);}}>💬 Contactar proveedor</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   FEED
══════════════════════════════════════════════════════ */
const FeedPage = ({currentUser,posts,setPosts,onOpenChat}) => {
  const [showCreate,setShowCreate] = useState(false);
  const [np,setNp] = useState({type:"general",content:"",audience:["proveedor","restaurante","trabajador"],vPos:"",vSal:"",vSch:"",vLoc:"",photo:null});
  const [commentInputs,setCommentInputs] = useState({});
  const fileRef = useRef();

  const canPost = currentUser.type==="restaurante"||currentUser.type==="proveedor";

  const visiblePosts = posts.filter(p=>{
    if(currentUser.type==="restaurante"||currentUser.type==="proveedor") return true;
    return p.audience.includes(currentUser.type);
  });

  const handleLike = id => setPosts(prev=>prev.map(p=>{
    if(p.id!==id)return p;
    const liked=p.likedBy.includes(currentUser.id);
    return{...p,likes:liked?p.likes-1:p.likes+1,likedBy:liked?p.likedBy.filter(x=>x!==currentUser.id):[...p.likedBy,currentUser.id]};
  }));

  const handleComment = id => {
    const txt=commentInputs[id]||"";
    if(!txt.trim())return;
    setPosts(prev=>prev.map(p=>p.id!==id?p:{...p,comments:[...p.comments,{id:"c"+Date.now(),authorId:currentUser.id,authorName:currentUser.name,authorAvatar:currentUser.avatar,content:txt,time:"ahora"}]}));
    setCommentInputs(prev=>({...prev,[id]:""}));
  };

  const handlePhoto = e => {
    const file=e.target.files[0]; if(!file)return;
    const r=new FileReader(); r.onload=ev=>setNp(p=>({...p,photo:ev.target.result})); r.readAsDataURL(file);
  };

  const submit = () => {
    if(!np.content.trim())return;
    const p={id:"post"+Date.now(),authorId:currentUser.id,authorName:currentUser.name,authorAvatar:currentUser.avatar,authorType:currentUser.type,type:np.type,content:np.content,audience:np.audience,likes:0,likedBy:[],comments:[],time:"ahora",photos:np.photo?[np.photo]:[],
      ...(np.type==="vacante"?{vacancyInfo:{position:np.vPos,salary:np.vSal,schedule:np.vSch,location:np.vLoc}}:{})};
    setPosts(prev=>[p,...prev]);
    setNp({type:"general",content:"",audience:["proveedor","restaurante","trabajador"],vPos:"",vSal:"",vSch:"",vLoc:"",photo:null});
    setShowCreate(false);
  };

  return (
    <div style={{maxWidth:700}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>{currentUser.type==="trabajador"?"Vacantes y Publicaciones":"Feed de la Comunidad"}</h2>
          <p style={{color:"#64748B",fontSize:14}}>Mantente al tanto del sector</p>
        </div>
        {canPost&&<button className="btn-primary" onClick={()=>setShowCreate(true)}><IC n="plus" s={15}/>Nueva Publicación</button>}
      </div>

      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Nueva Publicación" wide>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {["general","vacante"].map(t=>(
            <button key={t} onClick={()=>setNp(p=>({...p,type:t}))} style={{flex:1,padding:9,border:`2px solid ${np.type===t?"#2563EB":"#E2E8F0"}`,borderRadius:10,background:np.type===t?"#EFF6FF":"#fff",color:np.type===t?"#1D4ED8":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
              {t==="general"?"📢 General":"💼 Vacante"}
            </button>
          ))}
        </div>
        <textarea className="input textarea" placeholder="¿Qué quieres compartir?" value={np.content} onChange={e=>setNp(p=>({...p,content:e.target.value}))} style={{marginBottom:14}}/>
        {/* Photo upload */}
        <div style={{border:"2px dashed #DBEAFE",borderRadius:10,padding:14,textAlign:"center",marginBottom:14,cursor:"pointer",background:"#F8FAFF"}} onClick={()=>fileRef.current?.click()}>
          {np.photo?<img src={np.photo} style={{maxHeight:120,borderRadius:8,objectFit:"cover"}} alt="preview"/>:<><IC n="image" s={22} c="#93C5FD"/><p style={{color:"#64748B",fontSize:13,marginTop:6}}>Agregar foto (opcional)</p></>}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        </div>
        {np.type==="vacante"&&(
          <div style={{background:"#F8FAFF",border:"1px solid #DBEAFE",borderRadius:12,padding:14,marginBottom:14}}>
            <h4 style={{fontWeight:600,fontSize:13,marginBottom:10,color:"#1E3A6E"}}>Datos de la vacante</h4>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <input className="input" placeholder="Puesto" value={np.vPos} onChange={e=>setNp(p=>({...p,vPos:e.target.value}))}/>
              <input className="input" placeholder="Sueldo mensual" value={np.vSal} onChange={e=>setNp(p=>({...p,vSal:e.target.value}))}/>
              <input className="input" placeholder="Horario" value={np.vSch} onChange={e=>setNp(p=>({...p,vSch:e.target.value}))}/>
              <input className="input" placeholder="Ubicación" value={np.vLoc} onChange={e=>setNp(p=>({...p,vLoc:e.target.value}))}/>
            </div>
          </div>
        )}
        <div style={{marginBottom:16}}>
          <label style={{fontWeight:600,fontSize:13,color:"#374151",display:"block",marginBottom:8}}>Visible para:</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["proveedor","restaurante","trabajador"].map(t=>(
              <button key={t} onClick={()=>setNp(p=>({...p,audience:p.audience.includes(t)?p.audience.filter(x=>x!==t):[...p.audience,t]}))} style={{padding:"5px 13px",border:`2px solid ${np.audience.includes(t)?"#2563EB":"#E2E8F0"}`,borderRadius:8,background:np.audience.includes(t)?"#EFF6FF":"#fff",color:np.audience.includes(t)?"#1D4ED8":"#94A3B8",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                {np.audience.includes(t)&&<IC n="check" s={12}/>}{TL[t]}
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,justifyContent:"center"}} onClick={submit}>Publicar</button>
      </Modal>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {visiblePosts.map(post=>{
          const liked=post.likedBy.includes(currentUser.id);
          return (
            <PostCard key={post.id} post={post} currentUser={currentUser} liked={liked}
              onLike={()=>handleLike(post.id)}
              onComment={()=>handleComment(post.id)}
              commentInput={commentInputs[post.id]||""}
              setCommentInput={v=>setCommentInputs(p=>({...p,[post.id]:v}))}
              onOpenChat={onOpenChat}
            />
          );
        })}
      </div>
    </div>
  );
};

const PostCard = ({post,currentUser,liked,onLike,onComment,commentInput,setCommentInput,onOpenChat}) => {
  const [showComments,setShowComments] = useState(false);
  const author = USERS.find(u=>u.id===post.authorId);
  const canChat = author && currentUser.id!==post.authorId;
  return (
    <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:16,padding:22,boxShadow:"0 2px 8px rgba(30,64,175,0.05)"}}>
      {/* Header — solo nombre y tags, sin botón de chat */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <Av initials={post.authorAvatar} size={42} color={TC[post.authorType]}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{post.authorName}</span>
            <span className={`tag tag-${post.authorType}`}>{TL[post.authorType]}</span>
            {post.type==="vacante"&&<span className="tag tag-vacante">💼 Vacante</span>}
          </div>
          <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{post.time}</div>
        </div>
      </div>
      {post.type==="vacante"&&post.vacancyInfo&&(
        <div style={{background:"linear-gradient(135deg,#F0F9FF,#E0F2FE)",border:"1px solid #BAE6FD",borderRadius:12,padding:"12px 16px",marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["💼","Puesto",post.vacancyInfo.position],["💰","Sueldo",post.vacancyInfo.salary],["⏰","Horario",post.vacancyInfo.schedule],["📍","Ubicación",post.vacancyInfo.location]].map(([em,label,val])=>val&&(
            <div key={label}><span style={{fontSize:11,color:"#64748B"}}>{em} {label}</span><div style={{fontWeight:600,fontSize:12,color:"#0F1F3D"}}>{val}</div></div>
          ))}
        </div>
      )}
      <p style={{fontSize:14,color:"#374151",lineHeight:1.7,whiteSpace:"pre-line",marginBottom:12}}>{post.content}</p>
      {post.photos&&post.photos.length>0&&(
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {post.photos.map((ph,i)=>(
            <img key={i} src={ph} style={{maxHeight:200,maxWidth:"100%",borderRadius:10,objectFit:"cover"}} alt=""/>
          ))}
        </div>
      )}
      {/* Barra de acciones: Reacción | Comentario | Chat privado */}
      <div style={{display:"flex",alignItems:"stretch",margin:"0 0 0 0",borderTop:"1px solid #F1F5F9"}}>
        {/* Reacción */}
        <button onClick={onLike} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",borderRight:"1px solid #F1F5F9",cursor:"pointer",color:liked?"#EF4444":"#64748B",fontWeight:500,fontSize:13,padding:"11px 0",transition:"background 0.15s",borderRadius:"0 0 0 12px"}}
          onMouseEnter={e=>e.currentTarget.style.background="#FFF1F2"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <IC n="heart" s={15} c={liked?"#EF4444":"#9CA3AF"}/><span style={{fontSize:13}}>{post.likes}</span>
        </button>
        {/* Comentario */}
        <button onClick={()=>setShowComments(!showComments)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",borderRight:canChat?"1px solid #F1F5F9":"none",cursor:"pointer",color:showComments?"#2563EB":"#64748B",fontSize:13,padding:"11px 0",transition:"background 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#F0F6FF"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <IC n="comment" s={15} c={showComments?"#2563EB":"#9CA3AF"}/><span style={{fontSize:13}}>{post.comments.length} comentarios</span>
        </button>
        {/* Chat privado — solo si no es el autor */}
        {canChat&&(
          <button onClick={()=>onOpenChat(author)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#64748B",fontSize:13,padding:"11px 0",transition:"background 0.15s",borderRadius:"0 0 12px 0"}}
            onMouseEnter={e=>e.currentTarget.style.background="#F0F6FF"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
            <IC n="chat" s={15} c="#9CA3AF"/>Chat privado
          </button>
        )}
      </div>
      {showComments&&(
        <div style={{marginTop:14,borderTop:"1px solid #F1F5F9",paddingTop:14}}>
          {post.comments.map(c=>(
            <div key={c.id} style={{display:"flex",gap:10,marginBottom:10}}>
              <Av initials={c.authorAvatar||c.authorName?.slice(0,2)} size={28}/>
              <div style={{background:"#F8FAFF",border:"1px solid #EFF3FE",borderRadius:10,padding:"7px 12px",flex:1}}>
                <div style={{fontWeight:600,fontSize:12,color:"#0F1F3D",marginBottom:2}}>{c.authorName}</div>
                <div style={{fontSize:13,color:"#374151"}}>{c.content}</div>
              </div>
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <input className="input" placeholder="Escribe un comentario..." style={{flex:1,fontSize:13}} value={commentInput} onChange={e=>setCommentInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onComment()}/>
            <button className="btn-primary btn-sm" onClick={onComment}>Comentar</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   CATALOG
══════════════════════════════════════════════════════ */
const CatalogPage = ({currentUser}) => {
  const [products,setProducts] = useState(PRODUCTS.filter(p=>p.providerId===currentUser.id));
  const [showAdd,setShowAdd] = useState(false);
  const [f,setF] = useState({name:"",price:"",unit:"kg",description:"",category:"Frutas y Verduras",minOrder:"",photo:null});
  const fileRef = useRef();

  const handlePhoto = e => {
    const file=e.target.files[0]; if(!file)return;
    const r=new FileReader(); r.onload=ev=>setF(p=>({...p,photo:ev.target.result})); r.readAsDataURL(file);
  };

  const add = () => {
    if(!f.name||!f.price)return;
    const np={...f,id:"p"+Date.now(),price:parseFloat(f.price),providerId:currentUser.id};
    PRODUCTS.push(np); setProducts(prev=>[...prev,np]);
    setF({name:"",price:"",unit:"kg",description:"",category:"Frutas y Verduras",minOrder:"",photo:null}); setShowAdd(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Mi Catálogo</h2><p style={{color:"#64748B",fontSize:14}}>{products.length} producto(s)</p></div>
        <button className="btn-primary" onClick={()=>setShowAdd(true)}><IC n="plus" s={15}/>Agregar Producto</button>
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Nuevo Producto / Servicio">
        <div style={{border:"2px dashed #DBEAFE",borderRadius:12,padding:18,textAlign:"center",marginBottom:14,cursor:"pointer",background:"#F8FAFF"}} onClick={()=>fileRef.current?.click()}>
          {f.photo?<img src={f.photo} style={{maxHeight:100,borderRadius:8}} alt=""/>:<><IC n="image" s={26} c="#93C5FD"/><p style={{color:"#64748B",fontSize:13,marginTop:8}}>Subir imagen del producto</p></>}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Nombre *" full><input className="input" placeholder="Ej: Jitomate Saladet" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/></Field>
          <Field label="Precio (MXN) *"><input className="input" type="number" placeholder="0.00" value={f.price} onChange={e=>setF(x=>({...x,price:e.target.value}))}/></Field>
          <Field label="Unidad"><select className="input" value={f.unit} onChange={e=>setF(x=>({...x,unit:e.target.value}))}>{["kg","litro","pieza","caja","manojo","paquete","servicio","hora"].map(u=><option key={u}>{u}</option>)}</select></Field>
          <Field label="Categoría"><select className="input" value={f.category} onChange={e=>setF(x=>({...x,category:e.target.value}))}>{SERVICE_CATS.map(c=><option key={c}>{c}</option>)}</select></Field>
          <Field label="Pedido mínimo"><input className="input" placeholder="Ej: 5 kg" value={f.minOrder} onChange={e=>setF(x=>({...x,minOrder:e.target.value}))}/></Field>
          <Field label="Descripción" full><textarea className="input textarea" style={{minHeight:70}} placeholder="Describe tu producto..." value={f.description} onChange={e=>setF(x=>({...x,description:e.target.value}))}/></Field>
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,justifyContent:"center"}} onClick={add}>Publicar en catálogo</button>
      </Modal>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {products.map(p=>(
          <div key={p.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,overflow:"hidden"}}>
            <div style={{height:100,background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,position:"relative",overflow:"hidden"}}>
              {p.photo?<img src={p.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span>{CAT_EMOJI[p.category]||"📦"}</span>}
              <div style={{position:"absolute",top:8,right:8,background:"#1D4ED8",color:"#fff",borderRadius:99,padding:"3px 10px",fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:12}}>${p.price}/{p.unit}</div>
            </div>
            <div style={{padding:14}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{p.name}</div>
              <p style={{fontSize:12,color:"#64748B",lineHeight:1.5,marginBottom:8}}>{p.description}</p>
              {p.category&&<span className="tag" style={{background:"#EFF6FF",color:"#1E40AF",fontSize:10}}>{p.category}</span>}
              {p.minOrder&&<div style={{fontSize:11,color:"#94A3B8",marginTop:6}}>Min: {p.minOrder}</div>}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <button className="btn-outline btn-sm" style={{flex:1}}>Editar</button>
                <button className="btn-danger btn-sm" onClick={()=>setProducts(prev=>prev.filter(x=>x.id!==p.id))}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   CHAT  (punto 6 — botón "+" con opciones)
══════════════════════════════════════════════════════ */
const ChatPage = ({currentUser,initialContact,isSubView}) => {
  const cu = currentUser;
  const contacts = USERS.filter(u=>u.id!==cu.id&&u.type!=="admin"&&(u.type!==cu.type||(isSubView&&u.type!==cu.type)));
  const [active,setActive] = useState(initialContact||contacts[0]);
  const [chats,setChats] = useState({...CHATS});
  const [input,setInput] = useState("");
  const [showMenu,setShowMenu] = useState(false);
  const [showAptForm,setShowAptForm] = useState(false);
  const [aptF,setAptF] = useState({title:"",date:"",time:"",note:""});
  const bottomRef = useRef();
  const fileRef = useRef();

  const chatKey = [cu.id,active?.id].sort().join("-");
  const messages = chats[chatKey]||[];

  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,active]);

  const t = () => new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});

  const sendMsg = (msg) => {
    const updated=[...(CHATS[chatKey]||[]),msg];
    CHATS[chatKey]=updated;
    setChats(prev=>({...prev,[chatKey]:updated}));
  };

  const send = () => {
    if(!input.trim()||!active)return;
    sendMsg({from:cu.id,text:input,time:t()});
    setInput("");
  };

  const sendPhoto = e => {
    const file=e.target.files[0]; if(!file)return;
    const r=new FileReader();
    r.onload=ev=>sendMsg({from:cu.id,type:"image",src:ev.target.result,time:t()});
    r.readAsDataURL(file);
  };

  const proposeApt = () => {
    if(!aptF.title||!aptF.date)return;
    const apt={id:"apt"+Date.now(),participants:[cu.id,active.id],title:aptF.title,date:aptF.date,time:aptF.time,status:"pending",createdBy:cu.id,note:aptF.note};
    APPOINTMENTS.push(apt);
    sendMsg({from:cu.id,type:"appointment",aptId:apt.id,apt,time:t()});
    setAptF({title:"",date:"",time:"",note:""}); setShowAptForm(false);
  };

  const confirmApt = aptId => {
    const i=APPOINTMENTS.findIndex(a=>a.id===aptId);
    if(i>=0)APPOINTMENTS[i].status="confirmed";
    setChats(prev=>{
      const msgs=(prev[chatKey]||[]).map(m=>m.type==="appointment"&&m.aptId===aptId?{...m,apt:{...m.apt,status:"confirmed"}}:m);
      CHATS[chatKey]=msgs; return{...prev,[chatKey]:msgs};
    });
  };

  const isBiz = cu.type==="proveedor"||cu.type==="restaurante";

  const menuItems = [
    {icon:"📷",label:"Enviar foto",action:()=>{setShowMenu(false);setTimeout(()=>fileRef.current?.click(),100);}},
    {icon:"📅",label:"Proponer cita",action:()=>{setShowMenu(false);setShowAptForm(true);}},
    ...(isBiz?[
      {icon:"🔒",label:"Compartir datos de facturación",action:()=>{setShowMenu(false);sendMsg({from:cu.id,type:"billing_share",user:cu,time:t()});}},
      {icon:"👁️",label:"Solicitar datos de facturación",action:()=>{setShowMenu(false);sendMsg({from:cu.id,type:"billing_request",time:t()});}},
    ]:[]),
    ...(!isBiz?[{icon:"📄",label:"Enviar mi CV",action:()=>{setShowMenu(false);sendMsg({from:cu.id,type:"cv",user:cu,time:t()});}}]:[]),
  ];

  return (
    <div style={{display:"flex",height:"calc(100vh - 80px)",background:"#fff",borderRadius:16,border:"1px solid #E2ECF8",overflow:"hidden",boxShadow:"0 4px 20px rgba(30,64,175,0.07)"}}>
      {/* Contacts */}
      <div style={{width:270,borderRight:"1px solid #E2ECF8",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"18px 14px 12px",borderBottom:"1px solid #F1F5F9"}}>
          <h3 style={{fontWeight:700,fontSize:15,color:"#0F1F3D",marginBottom:10}}>Mensajes</h3>
        </div>
        <div style={{overflow:"auto",flex:1}}>
          {contacts.map(c=>(
            <div key={c.id} onClick={()=>setActive(c)} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",cursor:"pointer",background:active?.id===c.id?"#EFF6FF":"transparent",borderLeft:active?.id===c.id?"3px solid #2563EB":"3px solid transparent",transition:"all 0.15s"}}>
              <Av initials={c.avatar} size={38} color={TC[c.type]||"#1D4ED8"}/>
              <div style={{flex:1,overflow:"hidden"}}>
                <div style={{fontWeight:600,fontSize:13,color:"#0F1F3D",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                <span className={`tag tag-${c.type}`} style={{fontSize:10}}>{TL[c.type]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {active?(
        <div style={{flex:1,display:"flex",flexDirection:"column"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #F1F5F9",display:"flex",alignItems:"center",gap:12}}>
            <Av initials={active.avatar} size={38} color={TC[active.type]||"#1D4ED8"}/>
            <div><div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{active.name}</div><span className={`tag tag-${active.type}`} style={{fontSize:10}}>{TL[active.type]}</span></div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,background:"#10B981",borderRadius:"50%"}}/><span style={{fontSize:12,color:"#64748B"}}>En línea</span></div>
          </div>

          <div style={{flex:1,overflow:"auto",padding:18,display:"flex",flexDirection:"column",gap:10}}>
            {messages.length===0&&<div style={{textAlign:"center",color:"#94A3B8",marginTop:60}}><IC n="chat" s={40} c="#DBEAFE"/><p style={{marginTop:12,fontSize:14}}>Inicia la conversación con {active.name}</p></div>}
            {messages.map((m,i)=>{
              const isMe=m.from===cu.id;
              const sender=USERS.find(u=>u.id===m.from)||cu;
              if(m.type==="image") return (
                <div key={i} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                  <img src={m.src} style={{maxWidth:220,maxHeight:180,borderRadius:12,border:"1px solid #E2ECF8"}} alt=""/>
                </div>
              );
              if(m.type==="appointment") return (
                <div key={i} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                  <div style={{background:m.apt.status==="confirmed"?"#ECFDF5":"#F0F9FF",border:`1.5px solid ${m.apt.status==="confirmed"?"#A7F3D0":"#BAE6FD"}`,borderRadius:14,padding:"12px 16px",maxWidth:300}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><IC n="calendar" s={16} c={m.apt.status==="confirmed"?"#059669":"#0284C7"}/><span style={{fontWeight:700,fontSize:13,color:m.apt.status==="confirmed"?"#065F46":"#0C4A6E"}}>{m.apt.status==="confirmed"?"✓ Cita confirmada":"📅 Propuesta de cita"}</span></div>
                    <div style={{fontSize:13,fontWeight:600,color:"#0F1F3D",marginBottom:3}}>{m.apt.title}</div>
                    <div style={{fontSize:12,color:"#64748B"}}>{m.apt.date}{m.apt.time&&" · "+m.apt.time}</div>
                    {m.apt.note&&<div style={{fontSize:11,color:"#94A3B8",marginTop:4}}>{m.apt.note}</div>}
                    {!isMe&&m.apt.status==="pending"&&(
                      <button onClick={()=>confirmApt(m.aptId)} style={{marginTop:10,background:"#059669",color:"#fff",border:"none",borderRadius:8,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",width:"100%"}}>Confirmar cita ✓</button>
                    )}
                  </div>
                </div>
              );
              if(m.type==="billing_share") return (
                <div key={i} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                  <div style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0",borderRadius:14,padding:"12px 16px",maxWidth:300}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><IC n="lock" s={16} c="#059669"/><span style={{fontWeight:700,fontSize:13,color:"#065F46"}}>Datos de facturación compartidos</span></div>
                    <div style={{fontSize:12,color:"#374151"}}>{m.user?.name} ha compartido sus datos de facturación contigo.</div>
                  </div>
                </div>
              );
              if(m.type==="billing_request") return (
                <div key={i} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                  <div style={{background:"#EFF6FF",border:"1.5px solid #BFDBFE",borderRadius:14,padding:"12px 16px",maxWidth:300}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><IC n="eye" s={16} c="#1D4ED8"/><span style={{fontWeight:700,fontSize:13,color:"#1E40AF"}}>Solicitud de datos de facturación</span></div>
                    <div style={{fontSize:12,color:"#374151"}}>Se solicitaron los datos de facturación.</div>
                  </div>
                </div>
              );
              if(m.type==="cv") return (
                <div key={i} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start"}}>
                  <div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:14,padding:"12px 16px",maxWidth:300}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><IC n="briefcase" s={16} c="#D97706"/><span style={{fontWeight:700,fontSize:13,color:"#92400E"}}>CV enviado</span></div>
                    <div style={{fontWeight:600,fontSize:13,color:"#0F1F3D",marginBottom:3}}>{m.user?.name}</div>
                    {m.user?.skills&&<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{m.user.skills.map((s,si)=><span key={si} className="tag" style={{background:"#FEF3C7",color:"#92400E",fontSize:10}}>{s}</span>)}</div>}
                  </div>
                </div>
              );
              return (
                <div key={i} style={{display:"flex",justifyContent:isMe?"flex-end":"flex-start",gap:8}}>
                  {!isMe&&<Av initials={sender.avatar} size={28} color={TC[sender.type]||"#1D4ED8"}/>}
                  <div>
                    <div className={isMe?"chat-bubble-me":"chat-bubble-other"}>{m.text}</div>
                    <div style={{fontSize:10,color:"#94A3B8",marginTop:3,textAlign:isMe?"right":"left"}}>{m.time}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef}/>
          </div>

          {/* Appointment form */}
          {showAptForm&&(
            <div style={{padding:"14px 18px",background:"#F8FAFF",borderTop:"1px solid #E2ECF8"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontWeight:600,fontSize:13,color:"#1E3A6E"}}>📅 Proponer cita con {active.name}</span>
                <button onClick={()=>setShowAptForm(false)} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8"}}><IC n="x" s={16}/></button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <input className="input" placeholder="Título" value={aptF.title} onChange={e=>setAptF(x=>({...x,title:e.target.value}))} style={{gridColumn:"1/-1",fontSize:13}}/>
                <input className="input" type="date" value={aptF.date} onChange={e=>setAptF(x=>({...x,date:e.target.value}))} style={{fontSize:13}}/>
                <input className="input" type="time" value={aptF.time} onChange={e=>setAptF(x=>({...x,time:e.target.value}))} style={{fontSize:13}}/>
                <input className="input" placeholder="Nota (opcional)" value={aptF.note} onChange={e=>setAptF(x=>({...x,note:e.target.value}))} style={{gridColumn:"1/-1",fontSize:13}}/>
              </div>
              <button className="btn-primary btn-sm" onClick={proposeApt} style={{justifyContent:"center"}}>Enviar propuesta</button>
            </div>
          )}

          {/* Input bar */}
          <div style={{padding:"12px 14px",borderTop:"1px solid #F1F5F9",display:"flex",gap:8,alignItems:"center"}}>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={sendPhoto}/>
            <div style={{position:"relative"}}>
              <button onClick={()=>setShowMenu(!showMenu)} style={{width:38,height:38,borderRadius:10,background:"#EFF6FF",border:"1.5px solid #DBEAFE",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#1D4ED8",fontSize:20,fontWeight:700}}>+</button>
              {showMenu&&(
                <div style={{position:"absolute",bottom:48,left:0,background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,boxShadow:"0 8px 32px rgba(30,64,175,0.13)",minWidth:240,padding:8,zIndex:50}}>
                  {menuItems.map((item,i)=>(
                    <button key={i} onClick={item.action} style={{width:"100%",padding:"10px 14px",background:"none",border:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,borderRadius:10,fontSize:13,color:"#374151",fontFamily:"IBM Plex Sans,sans-serif"}}>
                      <span style={{fontSize:18}}>{item.icon}</span>{item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input className="input" placeholder="Escribe un mensaje..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} style={{flex:1}}/>
            <button className="btn-primary" onClick={send} style={{padding:"10px 14px"}}><IC n="send" s={16}/></button>
          </div>
        </div>
      ):<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#94A3B8"}}>Selecciona un contacto</div>}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   CALENDAR
══════════════════════════════════════════════════════ */
const CalendarPage = ({currentUser}) => {
  const [viewDate,setViewDate] = useState(new Date());
  const [showCreate,setShowCreate] = useState(false);
  const [f,setF] = useState({title:"",participantId:"",date:"",time:"",note:""});
  const myApts = APPOINTMENTS.filter(a=>a.participants.includes(currentUser.id));
  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year,month+1,0).getDate();
  const firstDay = new Date(year,month,1).getDay();
  const monthNames=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const dayHasApt = d => myApts.some(a=>{ const ad=new Date(a.date+"T12:00:00"); return ad.getFullYear()===year&&ad.getMonth()===month&&ad.getDate()===d; });
  const contacts = USERS.filter(u=>u.id!==currentUser.id&&u.type!=="admin");

  const create = () => {
    if(!f.title||!f.date||!f.participantId)return;
    const apt={id:"apt"+Date.now(),participants:[currentUser.id,f.participantId],title:f.title,date:f.date,time:f.time,status:"pending",createdBy:currentUser.id,note:f.note};
    APPOINTMENTS.push(apt);
    const key=[currentUser.id,f.participantId].sort().join("-");
    if(!CHATS[key])CHATS[key]=[];
    CHATS[key].push({from:currentUser.id,type:"appointment",aptId:apt.id,apt,time:new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})});
    setF({title:"",participantId:"",date:"",time:"",note:""}); setShowCreate(false);
  };

  const cancel = id => { const i=APPOINTMENTS.findIndex(a=>a.id===id); if(i>=0)APPOINTMENTS.splice(i,1); };
  const confirm = id => { const i=APPOINTMENTS.findIndex(a=>a.id===id); if(i>=0)APPOINTMENTS[i].status="confirmed"; };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Calendario</h2><p style={{color:"#64748B",fontSize:14}}>Tus citas y compromisos</p></div>
        <button className="btn-primary" onClick={()=>setShowCreate(true)}><IC n="plus" s={15}/>Nueva Cita</button>
      </div>

      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Agendar Cita">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Título" full><input className="input" placeholder="Ej: Revisión de contrato" value={f.title} onChange={e=>setF(x=>({...x,title:e.target.value}))}/></Field>
          <Field label="Persona a invitar" full>
            <select className="input" value={f.participantId} onChange={e=>setF(x=>({...x,participantId:e.target.value}))}>
              <option value="">Selecciona...</option>
              {contacts.map(c=><option key={c.id} value={c.id}>{c.name} ({TL[c.type]})</option>)}
            </select>
          </Field>
          <Field label="Fecha"><input className="input" type="date" value={f.date} onChange={e=>setF(x=>({...x,date:e.target.value}))}/></Field>
          <Field label="Hora"><input className="input" type="time" value={f.time} onChange={e=>setF(x=>({...x,time:e.target.value}))}/></Field>
          <Field label="Notas" full><textarea className="input" style={{minHeight:70}} placeholder="Notas adicionales..." value={f.note} onChange={e=>setF(x=>({...x,note:e.target.value}))}/></Field>
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,marginTop:16,justifyContent:"center"}} onClick={create}>Enviar invitación</button>
      </Modal>

      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20}}>
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:16,padding:22}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <button onClick={()=>setViewDate(new Date(year,month-1,1))} className="btn-outline btn-sm">‹</button>
            <h3 style={{fontWeight:700,fontSize:16}}>{monthNames[month]} {year}</h3>
            <button onClick={()=>setViewDate(new Date(year,month+1,1))} className="btn-outline btn-sm">›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
            {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map(d=><div key={d} style={{textAlign:"center",fontSize:11,fontWeight:700,color:"#94A3B8",padding:"4px 0"}}>{d}</div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const d=i+1;
              const isToday=today.getDate()===d&&today.getMonth()===month&&today.getFullYear()===year;
              const hasApt=dayHasApt(d);
              return (
                <div key={d} className={`cal-day${isToday?" today":""}${hasApt?" has-event":""}`}>
                  <div style={{fontWeight:isToday?700:400,fontSize:13}}>{d}</div>
                  {hasApt&&<div style={{fontSize:9,color:"#F59E0B",fontWeight:600,marginTop:2}}>●</div>}
                </div>
              );
            })}
          </div>
          <div style={{display:"flex",gap:12,marginTop:12,fontSize:12,color:"#64748B"}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"#EFF6FF",border:"1px solid #2563EB"}}/> Hoy</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:2,background:"#FEF3C7",border:"1px solid #F59E0B"}}/> Con cita</span>
          </div>
        </div>

        <div>
          <h3 style={{fontSize:15,fontWeight:700,color:"#1E3A6E",marginBottom:14}}>Mis Compromisos</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {myApts.length===0&&<p style={{color:"#94A3B8",fontSize:13}}>No tienes citas agendadas.</p>}
            {myApts.map(a=>{
              const other=a.participants.find(x=>x!==currentUser.id);
              const otherUser=USERS.find(u=>u.id===other);
              const isCreator=a.createdBy===currentUser.id;
              return (
                <div key={a.id} style={{background:"#fff",border:`1px solid ${a.status==="confirmed"?"#A7F3D0":"#FDE68A"}`,borderRadius:12,padding:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{a.title}</div>
                    <span style={{padding:"2px 8px",borderRadius:99,fontSize:10,fontWeight:700,fontFamily:"Sora,sans-serif",background:a.status==="confirmed"?"#D1FAE5":"#FEF3C7",color:a.status==="confirmed"?"#065F46":"#92400E"}}>
                      {a.status==="confirmed"?"✓ Confirmada":"⏳ Pendiente"}
                    </span>
                  </div>
                  <div style={{fontSize:12,color:"#64748B",marginBottom:4}}>📅 {a.date} {a.time&&`· ${a.time}`}</div>
                  {otherUser&&<div style={{fontSize:12,color:"#64748B",marginBottom:4}}>👤 {isCreator?"Con: ":"De: "}{otherUser.name}</div>}
                  {a.note&&<div style={{fontSize:11,color:"#94A3B8",marginBottom:8}}>{a.note}</div>}
                  <div style={{display:"flex",gap:6}}>
                    {!isCreator&&a.status==="pending"&&<button className="btn-primary btn-sm" onClick={()=>confirm(a.id)} style={{background:"#059669",justifyContent:"center"}}>Confirmar</button>}
                    <button className="btn-danger btn-sm" onClick={()=>cancel(a.id)}>Cancelar</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   RATINGS
══════════════════════════════════════════════════════ */
const RatingsPage = ({currentUser}) => {
  const [reviews,setReviews] = useState(REVIEWS);
  const [showAdd,setShowAdd] = useState(false);
  const [f,setF] = useState({toId:"",rating:5,comment:""});
  const canRevTypes={restaurante:["proveedor","trabajador"],proveedor:["restaurante"],trabajador:["restaurante"]};
  const targets=USERS.filter(u=>(canRevTypes[currentUser.type]||[]).includes(u.type));
  const myRevs=reviews.filter(r=>r.toId===currentUser.id);
  const iGave=reviews.filter(r=>r.fromId===currentUser.id);
  const avg=myRevs.length?(myRevs.reduce((s,r)=>s+r.rating,0)/myRevs.length).toFixed(1):"-";

  const submit=()=>{
    if(!f.toId||!f.comment.trim())return;
    const target=USERS.find(u=>u.id===f.toId);
    const nr={id:"r"+Date.now(),fromId:currentUser.id,fromName:currentUser.name,fromAvatar:currentUser.avatar,toId:f.toId,rating:f.rating,comment:f.comment,time:"ahora"};
    REVIEWS.push(nr); setReviews(prev=>[...prev,nr]);
    setF({toId:"",rating:5,comment:""}); setShowAdd(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Calificaciones</h2><p style={{color:"#64748B",fontSize:14}}>Reputación y reseñas</p></div>
        <button className="btn-primary" onClick={()=>setShowAdd(true)}><IC n="star" s={15}/>Dar Calificación</button>
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Nueva Calificación">
        <Field label="¿A quién calificar?"><select className="input" value={f.toId} onChange={e=>setF(x=>({...x,toId:e.target.value}))}><option value="">Selecciona...</option>{targets.map(u=><option key={u.id} value={u.id}>{u.name} ({TL[u.type]})</option>)}</select></Field>
        <div style={{margin:"14px 0"}}>
          <label style={{fontWeight:600,fontSize:13,color:"#374151",display:"block",marginBottom:8}}>Calificación</label>
          <div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(n=><button key={n} onClick={()=>setF(x=>({...x,rating:n}))} style={{background:"none",border:"none",cursor:"pointer",fontSize:28,opacity:n<=f.rating?1:0.3}}>⭐</button>)}</div>
        </div>
        <Field label="Comentario"><textarea className="input textarea" placeholder="Comparte tu experiencia..." value={f.comment} onChange={e=>setF(x=>({...x,comment:e.target.value}))}/></Field>
        <button className="btn-primary" style={{width:"100%",padding:13,marginTop:14,justifyContent:"center"}} onClick={submit}>Publicar Reseña</button>
      </Modal>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:26}}>
        {[{l:"Calificación promedio",v:avg,i:"star",c:"#F59E0B",bg:"#FFFBEB"},{l:"Reseñas recibidas",v:myRevs.length,i:"comment",c:"#2563EB",bg:"#EFF6FF"},{l:"Reseñas dadas",v:iGave.length,i:"check",c:"#10B981",bg:"#ECFDF5"}].map(s=>(
          <div key={s.l} style={{background:s.bg,border:`1px solid ${s.c}30`,borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,background:`${s.c}20`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}><IC n={s.i} s={20} c={s.c}/></div>
            <div><div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:26,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:12,color:"#64748B",marginTop:4}}>{s.l}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <h3 style={{fontWeight:700,fontSize:15,color:"#1E3A6E",marginBottom:14}}>Reseñas recibidas</h3>
          {myRevs.length===0?<p style={{color:"#94A3B8",fontSize:13}}>Aún no tienes reseñas.</p>:myRevs.map(r=>(
            <div key={r.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:16,marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Av initials={r.fromAvatar} size={32}/><div><div style={{fontWeight:600,fontSize:13}}>{r.fromName}</div><Stars rating={r.rating}/></div><span style={{marginLeft:"auto",fontSize:11,color:"#94A3B8"}}>{r.time}</span></div>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.5}}>{r.comment}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{fontWeight:700,fontSize:15,color:"#1E3A6E",marginBottom:14}}>Reseñas que di</h3>
          {iGave.length===0?<p style={{color:"#94A3B8",fontSize:13}}>No has dado reseñas aún.</p>:iGave.map(r=>(
            <div key={r.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:16,marginBottom:10}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:4}}>Para: {USERS.find(u=>u.id===r.toId)?.name}</div>
              <Stars rating={r.rating}/><p style={{fontSize:13,color:"#374151",marginTop:6}}>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   PROFILE  (punto 3 — edición con datos de facturación / CV)
══════════════════════════════════════════════════════ */
const ProfilePage = ({user,isOwn,onUpdate}) => {
  const [editInfo,setEditInfo] = useState(false);
  const [editWork,setEditWork] = useState(false);
  const [info,setInfo] = useState({description:user.description||"",location:user.location||"",age:user.age||"",zone:user.zone||""});
  const [billing,setBilling] = useState(user.billing||{razonSocial:"",rfc:"",regimen:"",cfdi:"",banco:"",cuenta:"",clabe:"",cp:""});
  const [skills,setSkills] = useState(user.skills||[]);
  const [skillInput,setSkillInput] = useState("");
  const [history,setHistory] = useState(user.workHistory||[]);
  const [newJob,setNewJob] = useState({place:"",position:"",duration:""});
  const myProducts = PRODUCTS.filter(p=>p.providerId===user.id);

  const saveInfo = () => {
    const updated={...user,...info,age:parseInt(info.age)||null};
    const i=USERS.findIndex(u=>u.id===user.id); if(i>=0)USERS[i]=updated;
    onUpdate&&onUpdate(updated); setEditInfo(false);
  };
  const saveBilling = () => {
    const updated={...user,billing};
    const i=USERS.findIndex(u=>u.id===user.id); if(i>=0)USERS[i]=updated;
    onUpdate&&onUpdate(updated);
  };
  const addSkill=()=>{if(skillInput.trim()){setSkills(p=>[...p,skillInput.trim()]);setSkillInput("");}};
  const addJob=()=>{if(newJob.place&&newJob.position){setHistory(p=>[...p,{...newJob}]);setNewJob({place:"",position:"",duration:""});}};
  const saveWork=()=>{
    const updated={...user,skills,workHistory:history};
    const i=USERS.findIndex(u=>u.id===user.id); if(i>=0)USERS[i]=updated;
    onUpdate&&onUpdate(updated); setEditWork(false);
  };

  return (
    <div style={{maxWidth:720}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F1F3D,#1D4ED8)",borderRadius:18,padding:"28px 28px 22px",marginBottom:18,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,width:180,height:180,background:"rgba(255,255,255,0.04)",borderRadius:"50%"}}/>
        <div style={{display:"flex",alignItems:"flex-end",gap:18,position:"relative"}}>
          <Av initials={user.avatar} size={68} color="rgba(255,255,255,0.15)"/>
          <div style={{flex:1}}>
            <span className={`tag tag-${user.type}`} style={{marginBottom:6,display:"inline-block"}}>{TL[user.type]}</span>
            <h2 style={{color:"#fff",fontWeight:800,fontSize:22,lineHeight:1.1}}>{user.name}</h2>
            {user.location&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:5,color:"#93C5FD",fontSize:13}}><IC n="map" s={13} c="#93C5FD"/> {user.location}</div>}
            {user.type==="trabajador"&&user.zone&&<div style={{fontSize:12,color:"#7DD3FC",marginTop:3}}>📍 {user.zone}</div>}
          </div>
          {user.rating>0&&(
            <div style={{textAlign:"center",background:"rgba(255,255,255,0.1)",borderRadius:12,padding:"10px 14px"}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:"#FCD34D"}}>{user.rating}</div>
              <Stars rating={user.rating} size={11}/>
              <div style={{fontSize:10,color:"#93C5FD",marginTop:2}}>{user.reviewCount} reseñas</div>
            </div>
          )}
        </div>
      </div>

      {/* Info general */}
      <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E"}}>Información general</h3>
          {isOwn&&<button className="btn-outline btn-sm" style={{display:"flex",alignItems:"center",gap:4}} onClick={()=>setEditInfo(!editInfo)}><IC n="edit" s={12}/>{editInfo?"Cancelar":"Editar"}</button>}
        </div>
        {editInfo?(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Descripción" full><textarea className="input textarea" style={{minHeight:70}} value={info.description} onChange={e=>setInfo(x=>({...x,description:e.target.value}))}/></Field>
            <Field label="Ciudad / Estado"><input className="input" placeholder="Ej: CDMX" value={info.location} onChange={e=>setInfo(x=>({...x,location:e.target.value}))}/></Field>
            {user.type==="trabajador"&&<>
              <Field label="Edad"><input className="input" type="number" placeholder="Ej: 28" value={info.age} onChange={e=>setInfo(x=>({...x,age:e.target.value}))}/></Field>
              <Field label="Zona / Colonia"><input className="input" placeholder="Ej: Benito Juárez, CDMX" value={info.zone} onChange={e=>setInfo(x=>({...x,zone:e.target.value}))}/></Field>
            </>}
            <div style={{gridColumn:"1/-1",display:"flex",gap:8,marginTop:4}}>
              <button className="btn-primary btn-sm" style={{justifyContent:"center"}} onClick={saveInfo}>Guardar</button>
            </div>
          </div>
        ):(
          <div>
            {info.description&&<p style={{fontSize:14,color:"#374151",lineHeight:1.7,marginBottom:10}}>{info.description}</p>}
            {user.type==="trabajador"&&(
              <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
                {user.age&&<span style={{fontSize:13,color:"#64748B"}}>🎂 {user.age} años</span>}
                {user.zone&&<span style={{fontSize:13,color:"#64748B"}}>📍 {user.zone}</span>}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Billing (negocios) */}
      {(user.type==="proveedor"||user.type==="restaurante")&&isOwn&&(
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20,marginBottom:14}}>
          <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E",marginBottom:14}}>🧾 Datos de Facturación</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            <Field label="Razón Social" full><input className="input" placeholder="Empresa SA de CV" value={billing.razonSocial} onChange={e=>setBilling(x=>({...x,razonSocial:e.target.value}))}/></Field>
            <Field label="RFC"><input className="input" placeholder="RFC con homoclave" value={billing.rfc} onChange={e=>setBilling(x=>({...x,rfc:e.target.value}))}/></Field>
            <Field label="Régimen Fiscal"><input className="input" placeholder="Régimen General" value={billing.regimen} onChange={e=>setBilling(x=>({...x,regimen:e.target.value}))}/></Field>
            <Field label="Uso de CFDI"><input className="input" placeholder="G03 – Gastos en general" value={billing.cfdi} onChange={e=>setBilling(x=>({...x,cfdi:e.target.value}))}/></Field>
            <Field label="Banco"><input className="input" placeholder="Ej: BBVA" value={billing.banco} onChange={e=>setBilling(x=>({...x,banco:e.target.value}))}/></Field>
            <Field label="Cuenta / CLABE"><input className="input" placeholder="CLABE interbancaria" value={billing.clabe} onChange={e=>setBilling(x=>({...x,clabe:e.target.value}))}/></Field>
            <Field label="Código Postal"><input className="input" placeholder="Ej: 06600" value={billing.cp} onChange={e=>setBilling(x=>({...x,cp:e.target.value}))}/></Field>
          </div>
          <button className="btn-primary btn-sm" style={{justifyContent:"center"}} onClick={saveBilling}>Actualizar datos de facturación</button>
        </div>
      )}

      {/* CV trabajador */}
      {user.type==="trabajador"&&(
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E"}}>🧑‍🍳 Habilidades e Historial</h3>
            {isOwn&&<button className="btn-outline btn-sm" style={{display:"flex",alignItems:"center",gap:4}} onClick={()=>setEditWork(!editWork)}><IC n="edit" s={12}/>{editWork?"Cancelar":"Editar"}</button>}
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontWeight:600,fontSize:13,color:"#374151",marginBottom:8}}>Habilidades</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:editWork?10:0}}>
              {skills.map((s,i)=><span key={i} className="tag" style={{background:"#EFF6FF",color:"#1D4ED8"}}>{s}{editWork&&<button onClick={()=>setSkills(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",marginLeft:2,fontSize:10}}>✕</button>}</span>)}
            </div>
            {editWork&&<div style={{display:"flex",gap:8}}><input className="input" placeholder="Ej: Bartender, Mesero..." value={skillInput} onChange={e=>setSkillInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addSkill()}/><button className="btn-primary btn-sm" onClick={addSkill}>+</button></div>}
          </div>
          <div style={{fontWeight:600,fontSize:13,color:"#374151",marginBottom:10}}>Historial Laboral</div>
          {history.map((j,i)=>(
            <div key={i} style={{display:"flex",gap:12,paddingBottom:10,borderBottom:"1px solid #F1F5F9",marginBottom:10,alignItems:"center"}}>
              <div style={{width:34,height:34,background:"#EFF6FF",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><IC n="briefcase" s={15} c="#1D4ED8"/></div>
              <div><div style={{fontWeight:600,fontSize:13}}>{j.position}</div><div style={{fontSize:12,color:"#64748B"}}>{j.place} · {j.duration}</div></div>
              {editWork&&<button onClick={()=>setHistory(p=>p.filter((_,k)=>k!==i))} style={{background:"none",border:"none",cursor:"pointer",color:"#DC2626",marginLeft:"auto"}}>✕</button>}
            </div>
          ))}
          {editWork&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:10}}>
              <input className="input" placeholder="Empresa" value={newJob.place} onChange={e=>setNewJob(x=>({...x,place:e.target.value}))} style={{fontSize:12}}/>
              <input className="input" placeholder="Puesto" value={newJob.position} onChange={e=>setNewJob(x=>({...x,position:e.target.value}))} style={{fontSize:12}}/>
              <input className="input" placeholder="Duración" value={newJob.duration} onChange={e=>setNewJob(x=>({...x,duration:e.target.value}))} style={{fontSize:12}}/>
              <div style={{gridColumn:"1/-1",display:"flex",gap:8}}><button className="btn-outline btn-sm" onClick={addJob}>Agregar empleo</button><button className="btn-primary btn-sm" onClick={saveWork}>Guardar cambios</button></div>
            </div>
          )}
        </div>
      )}

      {/* Products on profile */}
      {user.type==="proveedor"&&myProducts.length>0&&(
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E",marginBottom:14}}>Catálogo</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {myProducts.map(p=>(
              <div key={p.id} style={{border:"1px solid #E2ECF8",borderRadius:10,padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontWeight:600,fontSize:13}}>{p.name}</span><span style={{fontWeight:700,color:"#1D4ED8",fontSize:13}}>${p.price}/{p.unit}</span></div>
                <p style={{fontSize:11,color:"#64748B",marginTop:4}}>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   VACANTES
══════════════════════════════════════════════════════ */
const VacantesPage = ({currentUser,posts,setPosts}) => {
  const [showCreate,setShowCreate] = useState(false);
  const [f,setF] = useState({position:"",salary:"",schedule:"",location:"",content:""});
  const [tab,setTab] = useState("todas");   // "todas" | "mias" | "otros"
  const [q,setQ] = useState("");

  const allVacantes = posts.filter(p=>p.type==="vacante");
  const iAmOwner = currentUser.type==="restaurante";

  const filtered = allVacantes.filter(post=>{
    const matchTab =
      tab==="todas" ? true :
      tab==="mias"  ? post.authorId===currentUser.id :
      tab==="otros" ? post.authorId!==currentUser.id : true;
    const matchQ = !q.trim() ||
      (post.vacancyInfo?.position||"").toLowerCase().includes(q.toLowerCase()) ||
      post.authorName.toLowerCase().includes(q.toLowerCase()) ||
      post.content.toLowerCase().includes(q.toLowerCase());
    return matchTab && matchQ;
  });

  const submit=()=>{
    if(!f.position||!f.content)return;
    const p={id:"post"+Date.now(),authorId:currentUser.id,authorName:currentUser.name,authorAvatar:currentUser.avatar,authorType:currentUser.type,type:"vacante",content:f.content,audience:["trabajador"],likes:0,likedBy:[],comments:[],time:"ahora",photos:[],vacancyInfo:{position:f.position,salary:f.salary,schedule:f.schedule,location:f.location}};
    setPosts(prev=>[p,...prev]);
    setF({position:"",salary:"",schedule:"",location:"",content:""}); setShowCreate(false);
  };

  const TABS = [
    {id:"todas", label:"Todas las vacantes"},
    ...(iAmOwner ? [{id:"mias", label:"Mis publicaciones"}] : []),
    {id:"otros", label:"De otros negocios"},
  ];

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Vacantes</h2><p style={{color:"#64748B",fontSize:14}}>Oportunidades laborales en el sector</p></div>
        {iAmOwner&&<button className="btn-primary" onClick={()=>setShowCreate(true)}><IC n="briefcase" s={15}/>Publicar Vacante</button>}
      </div>

      {/* Filtros */}
      <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:16,marginBottom:20,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",boxShadow:"0 2px 8px rgba(30,64,175,0.05)"}}>
        {/* Tabs */}
        <div style={{display:"flex",gap:6,background:"#F8FAFF",border:"1px solid #E2ECF8",borderRadius:10,padding:4}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",borderRadius:8,border:"none",background:tab===t.id?"#fff":"transparent",color:tab===t.id?"#1D4ED8":"#64748B",fontWeight:tab===t.id?700:500,fontSize:13,cursor:"pointer",fontFamily:"Sora,sans-serif",boxShadow:tab===t.id?"0 1px 4px rgba(30,64,175,0.12)":"none",transition:"all 0.15s"}}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Buscador por puesto */}
        <div style={{flex:1,minWidth:200,position:"relative"}}>
          <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94A3B8"}}><IC n="search" s={15}/></div>
          <input className="input" placeholder="Buscar puesto, negocio..." style={{paddingLeft:38,fontSize:13}} value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        {/* Contador */}
        <span style={{fontSize:13,color:"#94A3B8",whiteSpace:"nowrap"}}>{filtered.length} resultado{filtered.length!==1?"s":""}</span>
      </div>

      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Nueva Vacante">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <Field label="Puesto *" full><input className="input" placeholder="Chef de Partida" value={f.position} onChange={e=>setF(x=>({...x,position:e.target.value}))}/></Field>
          <Field label="Sueldo"><input className="input" placeholder="$14,000 – $18,000" value={f.salary} onChange={e=>setF(x=>({...x,salary:e.target.value}))}/></Field>
          <Field label="Horario"><input className="input" placeholder="Lun–Vie 9am–6pm" value={f.schedule} onChange={e=>setF(x=>({...x,schedule:e.target.value}))}/></Field>
          <Field label="Ubicación"><input className="input" placeholder="Polanco, CDMX" value={f.location} onChange={e=>setF(x=>({...x,location:e.target.value}))}/></Field>
          <Field label="Descripción y requisitos *" full><textarea className="input textarea" placeholder="Describe el puesto..." value={f.content} onChange={e=>setF(x=>({...x,content:e.target.value}))}/></Field>
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,justifyContent:"center"}} onClick={submit}>Publicar Vacante</button>
      </Modal>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
        {filtered.map(post=>{
          const isOwn = post.authorId===currentUser.id;
          return (
            <div key={post.id} style={{background:"#fff",border:`1px solid ${isOwn?"#BFDBFE":"#E2ECF8"}`,borderRadius:16,padding:20,boxShadow:"0 2px 8px rgba(30,64,175,0.05)",position:"relative"}}>
              {isOwn&&<div style={{position:"absolute",top:14,right:14,background:"#EFF6FF",color:"#1D4ED8",borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:700,fontFamily:"Sora,sans-serif"}}>Tu publicación</div>}
              <div style={{display:"flex",gap:10,marginBottom:14}}>
                <Av initials={post.authorAvatar} size={42} color={TC[post.authorType]}/>
                <div><div style={{fontWeight:700,fontSize:14}}>{post.authorName}</div><div style={{fontSize:12,color:"#94A3B8"}}>{post.time}</div></div>
                <span className="tag tag-vacante" style={{marginLeft:"auto",height:"fit-content",marginRight:isOwn?70:0}}>💼</span>
              </div>
              {post.vacancyInfo&&(
                <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15,color:"#0F1F3D",marginBottom:8}}>{post.vacancyInfo.position}</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[["💰",post.vacancyInfo.salary],["⏰",post.vacancyInfo.schedule],["📍",post.vacancyInfo.location]].map(([em,val])=>val&&<div key={em} style={{fontSize:12,color:"#374151"}}>{em} {val}</div>)}
                  </div>
                </div>
              )}
              <p style={{fontSize:13,color:"#64748B",lineHeight:1.6,marginBottom:12,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{post.content}</p>
              <button className="btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}}>Ver detalles y aplicar</button>
            </div>
          );
        })}
        {filtered.length===0&&(
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"48px 0",color:"#94A3B8"}}>
            <div style={{fontSize:36,marginBottom:12}}>🔍</div>
            <p style={{fontSize:14}}>{q?"No hay vacantes que coincidan con tu búsqueda.":"No hay vacantes en esta categoría aún."}</p>
            {q&&<button onClick={()=>setQ("")} style={{marginTop:12,background:"none",border:"none",color:"#2563EB",cursor:"pointer",fontSize:13,fontWeight:600}}>Limpiar búsqueda</button>}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   SUBCUENTAS  (punto 8)
══════════════════════════════════════════════════════ */
const SubAccountsPage = ({currentUser}) => {
  const [subs,setSubs] = useState(SUBACCOUNTS.filter(s=>s.parentId===currentUser.id));
  const [showAdd,setShowAdd] = useState(false);
  const [f,setF] = useState({name:"",email:"",password:"",position:"",positionCustom:""});
  const POSITIONS=["Gerente General","Gerente de Compras","Gerente de Operaciones","Chef Ejecutivo","Encargado de Almacén","Administrador","Contador","Otro"];

  const add=()=>{
    if(!f.name||!f.email||!f.password)return;
    const pos=f.position==="Otro"?f.positionCustom:f.position;
    const ns={id:"sub"+Date.now(),parentId:currentUser.id,name:f.name,email:f.email,password:f.password,position:pos,avatar:f.name.slice(0,2).toUpperCase()};
    SUBACCOUNTS.push(ns); setSubs(prev=>[...prev,ns]);
    setF({name:"",email:"",password:"",position:"",positionCustom:""}); setShowAdd(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Subcuentas</h2><p style={{color:"#64748B",fontSize:14}}>Gestiona el acceso de tu equipo</p></div>
        <button className="btn-primary" onClick={()=>setShowAdd(true)}><IC n="plus" s={15}/>Agregar Subcuenta</button>
      </div>

      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Nueva Subcuenta">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Nombre completo" full><input className="input" placeholder="Nombre del empleado" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/></Field>
          <Field label="Correo electrónico"><input className="input" type="email" placeholder="empleado@empresa.com" value={f.email} onChange={e=>setF(x=>({...x,email:e.target.value}))}/></Field>
          <Field label="Contraseña"><input className="input" type="password" placeholder="••••••••" value={f.password} onChange={e=>setF(x=>({...x,password:e.target.value}))}/></Field>
          <Field label="Puesto" full>
            <select className="input" value={f.position} onChange={e=>setF(x=>({...x,position:e.target.value}))}>
              <option value="">Selecciona puesto...</option>
              {POSITIONS.map(p=><option key={p}>{p}</option>)}
            </select>
          </Field>
          {f.position==="Otro"&&<Field label="Especifica el puesto" full><input className="input" placeholder="Escribe el puesto..." value={f.positionCustom} onChange={e=>setF(x=>({...x,positionCustom:e.target.value}))}/></Field>}
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,justifyContent:"center"}} onClick={add}>Crear Subcuenta</button>
      </Modal>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {subs.map(s=>(
          <div key={s.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:18}}>
            <div style={{display:"flex",gap:12,marginBottom:12}}>
              <Av initials={s.avatar} size={44} color="#713F12"/>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{s.name}</div>
                <span className="tag tag-sub" style={{fontSize:10}}>{s.position}</span>
              </div>
            </div>
            <div style={{fontSize:13,color:"#64748B",marginBottom:12}}>✉️ {s.email}</div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-outline btn-sm" style={{flex:1}}>Ver actividad</button>
              <button className="btn-danger btn-sm" onClick={()=>{SUBACCOUNTS.splice(SUBACCOUNTS.findIndex(x=>x.id===s.id),1);setSubs(p=>p.filter(x=>x.id!==s.id));}}>Eliminar</button>
            </div>
          </div>
        ))}
        {subs.length===0&&<p style={{color:"#94A3B8",fontSize:14,padding:20}}>No tienes subcuentas creadas.</p>}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ADMIN PANEL  (punto 9)
══════════════════════════════════════════════════════ */
const AdminPanel = ({section}) => {
  const allUsers=USERS.filter(u=>u.type!=="admin");
  const stats=[
    {l:"Total usuarios",v:allUsers.length,c:"#2563EB",bg:"#EFF6FF",i:"users"},
    {l:"Proveedores",v:allUsers.filter(u=>u.type==="proveedor").length,c:"#059669",bg:"#ECFDF5",i:"package"},
    {l:"Restaurantes",v:allUsers.filter(u=>u.type==="restaurante").length,c:"#D97706",bg:"#FFFBEB",i:"briefcase"},
    {l:"Trabajadores",v:allUsers.filter(u=>u.type==="trabajador").length,c:"#7C3AED",bg:"#F5F3FF",i:"user"},
    {l:"Publicaciones",v:POSTS.length,c:"#DB2777",bg:"#FDF2F8",i:"feed"},
    {l:"Productos",v:PRODUCTS.length,c:"#0891B2",bg:"#ECFEFF",i:"trending"},
  ];

  if(section==="admin_users") return (
    <div>
      <div style={{marginBottom:22}}><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Usuarios</h2><p style={{color:"#64748B",fontSize:14}}>{allUsers.length} cuentas registradas</p></div>
      <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F8FAFF"}}>{["Nombre","Tipo","Correo","RFC / CURP","Registro","Acciones"].map(h=><th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:12,fontWeight:700,color:"#64748B",fontFamily:"Sora,sans-serif",borderBottom:"1px solid #E2ECF8"}}>{h}</th>)}</tr></thead>
          <tbody>
            {allUsers.map((u,i)=>(
              <tr key={u.id} style={{borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFCFF"}}>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <Av initials={u.avatar} size={32} color={TC[u.type]}/>
                    <div><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{u.location||"—"}</div></div>
                  </div>
                </td>
                <td style={{padding:"12px 16px"}}><span className={`tag tag-${u.type}`} style={{fontSize:10}}>{TL[u.type]}</span></td>
                <td style={{padding:"12px 16px",fontSize:13,color:"#374151"}}>{u.email}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:"#64748B",fontFamily:"monospace"}}>{u.rfc||u.curp||"—"}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:"#94A3B8"}}>—</td>
                <td style={{padding:"12px 16px"}}><button className="btn-outline btn-sm">Ver</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if(section==="admin_content") return (
    <div>
      <div style={{marginBottom:22}}><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Contenido</h2><p style={{color:"#64748B",fontSize:14}}>Todas las publicaciones y productos</p></div>
      <div style={{marginBottom:24}}>
        <h3 style={{fontWeight:700,fontSize:15,color:"#1E3A6E",marginBottom:14}}>Publicaciones ({POSTS.length})</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {POSTS.map(p=>(
            <div key={p.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
              <Av initials={p.authorAvatar} size={36} color={TC[p.authorType]}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:2}}>{p.authorName} <span className={`tag tag-${p.authorType}`} style={{fontSize:10}}>{TL[p.authorType]}</span></div>
                <div style={{fontSize:12,color:"#64748B",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:400}}>{p.content.substring(0,80)}...</div>
              </div>
              <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#94A3B8"}}>{p.time}</div><div style={{fontSize:12,color:"#64748B"}}>{p.likes} likes · {p.comments.length} comentarios</div></div>
              <button className="btn-danger btn-sm" onClick={()=>{const i=POSTS.findIndex(x=>x.id===p.id);if(i>=0)POSTS.splice(i,1);}}>Eliminar</button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 style={{fontWeight:700,fontSize:15,color:"#1E3A6E",marginBottom:14}}>Productos ({PRODUCTS.length})</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {PRODUCTS.map(p=>{
            const prov=USERS.find(u=>u.id===p.providerId);
            return (
              <div key={p.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:13}}>{p.name}</span>
                  <span style={{fontWeight:700,color:"#1D4ED8",fontSize:13}}>${p.price}/{p.unit}</span>
                </div>
                <p style={{fontSize:12,color:"#64748B",marginBottom:8}}>{p.description}</p>
                <div style={{display:"flex",justifyContent:"space-between"}}><span className="tag" style={{background:"#EFF6FF",color:"#1E40AF",fontSize:10}}>{p.category}</span><span style={{fontSize:11,color:"#94A3B8"}}>{prov?.name}</span></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if(section==="admin_reports") return (
    <div>
      <div style={{marginBottom:22}}><h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Reportes</h2><p style={{color:"#64748B",fontSize:14}}>Estadísticas generales de la plataforma</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {[{t:"Usuarios por tipo",items:[["Restaurantes",USERS.filter(u=>u.type==="restaurante").length,"#059669"],["Proveedores",USERS.filter(u=>u.type==="proveedor").length,"#1D4ED8"],["Trabajadores",USERS.filter(u=>u.type==="trabajador").length,"#D97706"]]},{t:"Actividad",items:[["Total publicaciones",POSTS.length,"#DB2777"],["Total productos",PRODUCTS.length,"#0891B2"],["Subcuentas",SUBACCOUNTS.length,"#7C3AED"],["Citas agendadas",APPOINTMENTS.length,"#059669"]]}].map(section=>(
          <div key={section.t} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20}}>
            <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E",marginBottom:14}}>{section.t}</h3>
            {section.items.map(([label,value,color])=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:10,borderBottom:"1px solid #F1F5F9",marginBottom:10}}>
                <span style={{fontSize:13,color:"#374151"}}>{label}</span>
                <span style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:18,color}}>{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Default: dashboard
  return (
    <div>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Panel de Administración</h2>
        <p style={{color:"#64748B",fontSize:14}}>Vista general de RestLink</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:28}}>
        {stats.map(s=>(
          <div key={s.l} style={{background:s.bg,border:`1px solid ${s.c}30`,borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:42,height:42,background:`${s.c}20`,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}><IC n={s.i} s={20} c={s.c}/></div>
            <div><div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:26,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:12,color:"#64748B",marginTop:4}}>{s.l}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E",marginBottom:14}}>Últimos usuarios</h3>
          {allUsers.slice(-5).reverse().map(u=>(
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,borderBottom:"1px solid #F1F5F9",marginBottom:10}}>
              <Av initials={u.avatar} size={32} color={TC[u.type]}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{u.email}</div></div>
              <span className={`tag tag-${u.type}`} style={{fontSize:10}}>{TL[u.type]}</span>
            </div>
          ))}
        </div>
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20}}>
          <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E",marginBottom:14}}>Últimas publicaciones</h3>
          {POSTS.slice(-4).reverse().map(p=>(
            <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:10,borderBottom:"1px solid #F1F5F9",marginBottom:10}}>
              <Av initials={p.authorAvatar} size={30} color={TC[p.authorType]}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:200}}>{p.content.substring(0,50)}...</div><div style={{fontSize:11,color:"#94A3B8"}}>{p.authorName} · {p.time}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [screen,setScreen] = useState("landing");
  const [currentUser,setCurrentUser] = useState(null);
  const [view,setView] = useState("feed");
  const [posts,setPosts] = useState(POSTS);
  const [profileTarget,setProfileTarget] = useState(null);
  const [chatTarget,setChatTarget] = useState(null);

  const login = user => { setCurrentUser(user); setView(user.type==="admin"?"admin":"feed"); setScreen("app"); };
  const openProfile = u => { setProfileTarget(u); setView("profile_view"); };
  const openChat = u => { setChatTarget(u); setView("chat"); };
  const updateUser = u => { setCurrentUser(u); };

  const changeView = v => { setView(v); setChatTarget(null); setProfileTarget(null); };

  if(screen==="landing") return <><GF/><Landing onLogin={()=>setScreen("login")} onReg={()=>setScreen("register")}/></>;
  if(screen==="login") return <><GF/><AuthPage mode="login" onSwitch={()=>setScreen("register")} onSuccess={login}/></>;
  if(screen==="register") return <><GF/><AuthPage mode="register" onSwitch={()=>setScreen("login")} onSuccess={login}/></>;

  const renderView = () => {
    if(view==="feed") return <FeedPage currentUser={currentUser} posts={posts} setPosts={setPosts} onOpenChat={openChat}/>;
    if(view==="search") return <SearchPage currentUser={currentUser} onOpenProfile={openProfile} onOpenChat={openChat}/>;
    if(view==="catalog") return <CatalogPage currentUser={currentUser}/>;
    if(view==="chat") return <ChatPage currentUser={currentUser} initialContact={chatTarget} isSubView={currentUser.type==="sub"}/>;
    if(view==="calendar") return <CalendarPage currentUser={currentUser}/>;
    if(view==="ratings") return <RatingsPage currentUser={currentUser}/>;
    if(view==="profile") return <ProfilePage user={currentUser} isOwn={true} onUpdate={updateUser}/>;
    if(view==="profile_view") return <ProfilePage user={profileTarget||currentUser} isOwn={profileTarget?.id===currentUser.id} onUpdate={updateUser}/>;
    if(view==="vacantes") return <VacantesPage currentUser={currentUser} posts={posts} setPosts={setPosts}/>;
    if(view==="subaccounts") return <SubAccountsPage currentUser={currentUser}/>;
    if(view==="admin"||view==="admin_users"||view==="admin_content"||view==="admin_reports") return <AdminPanel section={view}/>;
    return <FeedPage currentUser={currentUser} posts={posts} setPosts={setPosts} onOpenChat={openChat}/>;
  };

  return (
    <>
      <GF/>
      <Layout user={currentUser} view={view} setView={changeView}>
        {renderView()}
      </Layout>
    </>
  );
}
