import { useState, useRef, useEffect } from "react";

/* --- FOLLOWS DATA --- */
// { followerId: Set of userIds they follow }
let FOLLOWS = {
  "u3": new Set(["u1","u2"]),
  "u4": new Set(["u1"]),
  "u1": new Set(["u3"]),
};
const getFollowers = uid => Object.entries(FOLLOWS).filter(([,s])=>s.has(uid)).map(([k])=>k);
const getFollowing = uid => [...(FOLLOWS[uid]||new Set())];
const isFollowing = (me,uid) => (FOLLOWS[me]||new Set()).has(uid);
const toggleFollow = (me,uid) => {
  if(!FOLLOWS[me]) FOLLOWS[me]=new Set();
  if(FOLLOWS[me].has(uid)) FOLLOWS[me].delete(uid); else FOLLOWS[me].add(uid);
};

/* --- GOOGLE FONTS & GLOBAL STYLES --- */
const GF = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    html{-webkit-text-size-adjust:100%}
    body{font-family:'IBM Plex Sans',sans-serif;background:#F0F4F8;color:#0F1F3D;overflow-x:hidden}
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
    .btn-follow{background:linear-gradient(135deg,#1D4ED8,#2563EB);color:#fff;border:none;border-radius:99px;padding:7px 20px;font-family:'Sora',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:5px}
    .btn-follow:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(37,99,235,0.35)}
    .btn-unfollow{background:#F1F5F9;color:#475569;border:1.5px solid #E2ECF8;border-radius:99px;padding:7px 20px;font-family:'Sora',sans-serif;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;display:inline-flex;align-items:center;gap:5px}
    .btn-unfollow:hover{background:#FEF2F2;border-color:#FECACA;color:#DC2626}
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
    .user-link{cursor:pointer;color:inherit;font-weight:700}
    .user-link:hover{color:#2563EB;text-decoration:underline}
    /* -- RESPONSIVE -- */
    .sidebar-desktop{display:flex}
    .bottom-nav{display:none}
    /* Tablet: 768px */
    @media(max-width:900px){
      .land-hero-grid{grid-template-columns:1fr!important}
      .land-preview{display:none!important}
      .land-stats-grid{grid-template-columns:repeat(2,1fr)!important}
      .land-for-grid{grid-template-columns:1fr!important}
      .land-apps-grid{grid-template-columns:1fr!important}
      .land-apps-chips-grid{grid-template-columns:1fr 1fr!important}
      .land-nav-links{gap:8px!important}
      .land-nav-links .btn-outline{display:none}
    }
    @media(max-width:768px){
      .sidebar-desktop{display:none!important}
      .bottom-nav{display:flex!important;position:fixed;bottom:0;left:0;right:0;background:#fff;border-top:1px solid #E2ECF8;z-index:200;padding:6px 0 env(safe-area-inset-bottom,6px)}
      .main-content{margin-left:0!important;padding:16px 12px 88px!important;max-width:100vw!important}
      .modal{padding:18px;border-radius:18px 18px 0 0;position:fixed;bottom:0;left:0;right:0;max-height:92vh;margin:0;border-radius:18px 18px 0 0!important;max-width:100%!important}
      .modal-overlay{align-items:flex-end!important}
      .modal-wide{max-width:100%;border-radius:18px 18px 0 0!important}
      .resp-grid-2{grid-template-columns:1fr!important}
      .resp-grid-3{grid-template-columns:1fr 1fr!important}
      .resp-hide{display:none!important}
      .resp-full{width:100%!important;grid-column:1/-1!important}
      .resp-stack{flex-direction:column!important}
      /* Landing mobile */
      .land-nav{padding:12px 16px!important}
      .land-hero-section{padding:40px 16px 32px!important}
      .land-stats-bar{padding:20px 16px!important}
      .land-for-section{padding:48px 16px!important}
      .land-apps-section{padding:40px 16px!important}
      .land-cta-section{padding:48px 16px!important}
      .land-footer{padding:16px!important}
      .land-stats-grid{grid-template-columns:repeat(2,1fr)!important}
      .land-for-grid{grid-template-columns:1fr!important}
      .land-apps-grid{grid-template-columns:1fr!important}
      .land-apps-chips-grid{grid-template-columns:1fr 1fr!important}
      /* Auth */
      .auth-box{border-radius:0!important;min-height:100vh!important;padding:32px 20px!important}
      /* Profile */
      .profile-header-actions{flex-direction:column!important;align-items:flex-start!important;gap:10px!important}
    }
    @media(max-width:480px){
      .resp-grid-3{grid-template-columns:1fr!important}
      .resp-stack{flex-direction:column!important}
      .land-stats-grid{grid-template-columns:1fr 1fr!important}
      .land-apps-chips-grid{grid-template-columns:1fr!important}
      .btn-primary,.btn-outline{font-size:13px!important;padding:9px 16px!important}
      .modal{padding:14px!important}
    }
  `}</style>
);

/* --- ICONS --- */
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
    gear: <><circle cx="12" cy="12" r="3" fill="none" stroke={c} strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="none" stroke={c} strokeWidth="1.8"/></>,
    dots: <><circle cx="12" cy="5" r="1.5" fill={c}/><circle cx="12" cy="12" r="1.5" fill={c}/><circle cx="12" cy="19" r="1.5" fill={c}/></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>,
    share: <><circle cx="18" cy="5" r="3" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="6" cy="12" r="3" fill="none" stroke={c} strokeWidth="1.8"/><circle cx="18" cy="19" r="3" fill="none" stroke={c} strokeWidth="1.8"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke={c} strokeWidth="1.8" strokeLinecap="round"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><line x1="4" y1="22" x2="4" y2="15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke={c} strokeWidth="1.8"/></>,
    shirt: <><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10a2 2 0 002 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z" fill="none" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{ic[n]}</svg>;
};

/* --- MOCK DATA --- */
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
  { id:"post2", authorId:"u4", authorName:"Cocina Tradicional", authorAvatar:"CT", authorType:"restaurante", type:"vacante", content:"🍳 BUSCAMOS CHEF DE PARTIDA\n\nPuesto: Chef de Partida -- Área Caliente\nSueldo: $14,000–$18,000 MXN mensual\nHorario: Mar–Dom 2pm–12am\nUbicación: Polanco, CDMX", audience:["trabajador"], likes:8, likedBy:[], comments:[], time:"5h", photos:[], vacancyInfo:{position:"Chef de Partida",salary:"$14,000–$18,000",schedule:"Mar–Dom 2pm–12am",location:"Polanco, CDMX"} },
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

/* --- SHARED HELPERS --- */
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

/* --- REPORT MODAL --- */
const REPORT_REASONS_POST = [
  "Contenido inapropiado","Spam o publicidad engañosa","Información falsa","Acoso o bullying","Contenido ofensivo","Violación de derechos","Contenido irrelevante","Otro motivo"
];
const REPORT_REASONS_ACCOUNT = [
  "Cuenta falsa o suplantación","Spam o promoción excesiva","Comportamiento abusivo","Actividad fraudulenta","Contenido inapropiado reiterado","Perfil engañoso","Otro motivo"
];

const ReportModal = ({open, onClose, type}) => {
  const [step, setStep] = useState(1); // 1=form, 2=thanks
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState("");

  const reasons = type==="account" ? REPORT_REASONS_ACCOUNT : REPORT_REASONS_POST;
  const title = type==="account" ? "Reportar cuenta" : "Reportar publicación";

  const toggle = r => setSelected(p => p.includes(r) ? p.filter(x=>x!==r) : [...p,r]);

  const handleSend = () => {
    if(selected.length===0) return;
    setStep(2);
  };

  const handleClose = () => {
    setStep(1); setSelected([]); setDetail(""); onClose();
  };

  if(!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" style={{maxWidth:460}} onClick={e=>e.stopPropagation()}>
        {step===1 ? (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div>
                <h3 style={{fontWeight:700,fontSize:17,color:"#0F1F3D"}}>{title}</h3>
                <p style={{fontSize:12,color:"#94A3B8",marginTop:2}}>Ayúdanos a mantener la comunidad segura</p>
              </div>
              <button style={{background:"none",border:"none",cursor:"pointer",color:"#64748B"}} onClick={handleClose}><IC n="x" s={20}/></button>
            </div>
            <div style={{marginBottom:16}}>
              <p style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:10}}>¿Por qué quieres reportar esto?</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {reasons.map(r=>{
                  const sel = selected.includes(r);
                  return (
                    <button key={r} onClick={()=>toggle(r)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${sel?"#DC2626":"#E2ECF8"}`,background:sel?"#FEF2F2":"#fff",color:sel?"#DC2626":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.15s",display:"flex",alignItems:"center",gap:5}}>
                      {sel&&<IC n="check" s={11} c="#DC2626"/>}{r}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{marginBottom:20}}>
              <p style={{fontSize:13,fontWeight:600,color:"#374151",marginBottom:8}}>Detalles adicionales <span style={{fontWeight:400,color:"#94A3B8"}}>(opcional)</span></p>
              <textarea className="input textarea" style={{minHeight:80,fontSize:13,resize:"vertical"}} placeholder="Describe con más detalle lo que está pasando..." value={detail} onChange={e=>setDetail(e.target.value)}/>
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-outline" style={{flex:1,justifyContent:"center"}} onClick={handleClose}>Cancelar</button>
              <button onClick={handleSend} disabled={selected.length===0} style={{flex:2,padding:"10px 0",borderRadius:10,border:"none",background:selected.length>0?"linear-gradient(135deg,#DC2626,#EF4444)":"#F1F5F9",color:selected.length>0?"#fff":"#94A3B8",fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:14,cursor:selected.length>0?"pointer":"not-allowed",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                <IC n="flag" s={14} c={selected.length>0?"#fff":"#94A3B8"}/>Enviar reporte
              </button>
            </div>
          </>
        ) : (
          <div style={{textAlign:"center",padding:"24px 16px"}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)",border:"2px solid #A7F3D0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
              <IC n="check" s={28} c="#059669"/>
            </div>
            <h3 style={{fontWeight:800,fontSize:18,color:"#0F1F3D",marginBottom:8}}>¡Reporte enviado!</h3>
            <p style={{fontSize:14,color:"#64748B",lineHeight:1.7,marginBottom:6}}>Gracias por ayudarnos a mantener RestLink seguro.</p>
            <p style={{fontSize:13,color:"#94A3B8",lineHeight:1.6,marginBottom:24}}>Nuestro equipo de soporte revisará tu reporte a la brevedad y tomará las medidas necesarias.</p>
            <div style={{background:"#F8FAFF",border:"1px solid #DBEAFE",borderRadius:12,padding:"12px 16px",marginBottom:20,textAlign:"left"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <IC n="shield" s={14} c="#2563EB"/>
                <span style={{fontSize:12,fontWeight:700,color:"#1D4ED8"}}>Tu reporte es confidencial</span>
              </div>
              <p style={{fontSize:12,color:"#64748B",lineHeight:1.5}}>La persona reportada no sabrá que fuiste tú quien hizo el reporte.</p>
            </div>
            <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:12}} onClick={handleClose}>Entendido</button>
          </div>
        )}
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

/* ======================================================
   LANDING v3 -- Profesional y minimalista
====================================================== */
const Landing = ({onLogin,onReg}) => (
  <div style={{minHeight:"100vh",background:"#FAFBFE",display:"flex",flexDirection:"column",fontFamily:"'IBM Plex Sans',sans-serif"}}>
    <style>{`
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      .land-nav{position:sticky;top:0;z-index:100;background:rgba(250,251,254,0.92);backdrop-filter:blur(16px);border-bottom:1px solid #E8EEF8}
      .land-hero{animation:fadeUp 0.7s ease both}
      .land-badge{animation:fadeUp 0.5s ease both}
      .land-cta{animation:fadeUp 0.9s ease both}
      .land-card{background:#fff;border:1px solid #E8EEF8;border-radius:20px;padding:28px 24px;transition:all 0.25s;position:relative;overflow:hidden}
      .land-card:hover{box-shadow:0 12px 40px rgba(30,64,175,0.1);transform:translateY(-3px);border-color:#BFDBFE}
      .land-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent);border-radius:20px 20px 0 0}
      .land-stat{text-align:center;padding:20px}
      .land-feat{display:flex;align-items:flex-start;gap:14px;padding:16px 0;border-bottom:1px solid #F1F5F9}
      .land-feat:last-child{border-bottom:none}
      .land-app-chip{display:inline-flex;align-items:center;gap:7px;background:#F0F4F8;border:1px solid #E2ECF8;border-radius:99px;padding:6px 14px;font-size:12px;font-weight:600;color:#374151}
    `}</style>

    {/* NAV */}
    <nav className="land-nav">
      <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22,color:"#0F1F3D",letterSpacing:-0.5}}>
          Rest<span style={{color:"#2563EB"}}>Link</span>
        </div>
        <div className="land-nav-links" style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:12,color:"#94A3B8",fontWeight:500,marginRight:4}} className="resp-hide">🇲🇽 Para México</span>
          <button className="btn-outline" style={{fontSize:13,padding:"8px 18px"}} onClick={onLogin}>Iniciar sesión</button>
          <button className="btn-primary" style={{fontSize:13,padding:"8px 18px"}} onClick={onReg}>Crear cuenta gratis</button>
        </div>
      </div>
    </nav>

    {/* HERO */}
    <div className="land-hero-section" style={{maxWidth:1100,margin:"0 auto",padding:"80px 32px 60px",width:"100%"}}>
      <div className="land-hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
        <div>
          <div className="land-badge" style={{display:"inline-flex",alignItems:"center",gap:8,background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:99,padding:"5px 16px",marginBottom:24}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#2563EB",display:"inline-block"}}/>
            <span style={{fontSize:12,fontWeight:700,color:"#1D4ED8",fontFamily:"'Sora',sans-serif",letterSpacing:0.3}}>Red B2B para gastronomía y hospitalidad</span>
          </div>
          <h1 className="land-hero" style={{fontFamily:"'Sora',sans-serif",fontSize:"clamp(32px,3.5vw,54px)",fontWeight:800,color:"#0F1F3D",lineHeight:1.15,letterSpacing:-1.5,marginBottom:20}}>
            Tu negocio conectado<br/>con los mejores<br/><span style={{color:"#2563EB"}}>proveedores y talento</span>
          </h1>
          <p style={{fontSize:17,color:"#64748B",lineHeight:1.75,marginBottom:32,maxWidth:440}}>
            RestLink conecta restaurantes, hoteles, proveedores, prestadores de servicios y trabajadores del sector en un solo ecosistema digital.
          </p>
          <div className="land-cta" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
            <button className="btn-primary" style={{padding:"13px 28px",fontSize:15}} onClick={onReg}>Comenzar gratis →</button>
            <button className="btn-outline" style={{padding:"13px 28px",fontSize:15}} onClick={onLogin}>Ver demo</button>
          </div>
          <div style={{display:"flex",gap:20,marginTop:36,flexWrap:"wrap"}}>
            {[["🍽️","Restaurantes"],["📦","Proveedores"],["🔧","Servicios"],["👨‍🍳","Trabajadores"]].map(([e,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:"#64748B",fontWeight:500}}>
                <span>{e}</span><span>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="land-preview" style={{position:"relative",animation:"float 4s ease-in-out infinite"}}>
          <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:24,padding:24,boxShadow:"0 24px 80px rgba(30,64,175,0.12)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,paddingBottom:16,borderBottom:"1px solid #F1F5F9"}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#1D4ED8,#2563EB)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:"#fff",fontSize:16,fontFamily:"'Sora',sans-serif",fontWeight:800}}>R</span>
              </div>
              <div>
                <div style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:13,color:"#0F1F3D"}}>RestLink</div>
                <div style={{fontSize:11,color:"#94A3B8"}}>Panel principal</div>
              </div>
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                {["#F87171","#FBBF24","#34D399"].map(c=><div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
              </div>
            </div>
            {/* Mini stats */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
              {[["12","Pedidos",["#EFF6FF","#1D4ED8"]],["48","Conexiones",["#ECFDF5","#059669"]],["4.8","Rating",["#FEF3C7","#D97706"]]].map(([v,l,[bg,c]])=>(
                <div key={l} style={{background:bg,borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
                  <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:22,color:c,lineHeight:1}}>{v}</div>
                  <div style={{fontSize:10,color:"#94A3B8",marginTop:4,fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
            {/* Mini feed */}
            {[
              {a:"EF",t:"restaurante",n:"El Fogón",m:"Buscamos proveedor de gas LP mensual 🔥",c:"#065F46",bg:"#D1FAE5"},
              {a:"DF",t:"proveedor",n:"Dist. Fresca",m:"Aguacate Hass disponible -- $45/kg",c:"#1E40AF",bg:"#DBEAFE"},
              {a:"JP",t:"trabajador",n:"Juan Pérez",m:"Disponible como Chef de Partida",c:"#92400E",bg:"#FEF3C7"},
            ].map((x,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"10px 0",borderBottom:i<2?"1px solid #F8FAFF":"none"}}>
                <div style={{width:30,height:30,borderRadius:8,background:x.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:11,color:x.c,flexShrink:0}}>{x.a}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:11,color:"#374151"}}>{x.n}</div>
                  <div style={{fontSize:11,color:"#94A3B8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{x.m}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Floating chips */}
          <div style={{position:"absolute",top:-16,right:-16,background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:"8px 14px",boxShadow:"0 8px 24px rgba(30,64,175,0.12)",fontSize:12,fontWeight:700,color:"#059669",display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:8,height:8,borderRadius:"50%",background:"#059669",display:"inline-block"}}/>Nuevo pedido recibido
          </div>
          <div style={{position:"absolute",bottom:-12,left:-16,background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:"8px 14px",boxShadow:"0 8px 24px rgba(30,64,175,0.12)",fontSize:12,fontWeight:700,color:"#1D4ED8",display:"flex",alignItems:"center",gap:6}}>
            📅 Cita confirmada -- Hoy 3pm
          </div>
        </div>
      </div>
    </div>

    {/* STATS BAR */}
    <div className="land-stats-bar" style={{background:"#0F1F3D",padding:"28px 32px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="land-stats-grid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
        {[["3 tipos","de cuenta"],["5 apps","especializadas"],["100%","enfocado en MX"],["B2B","red profesional"]].map(([v,l])=>(
          <div key={l} className="land-stat">
            <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:24,color:"#fff",lineHeight:1}}>{v}</div>
            <div style={{fontSize:12,color:"#93C5FD",marginTop:6,fontWeight:500}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
    </div>

    {/* PARA QUIÉN */}
    <div className="land-for-section" style={{maxWidth:1100,margin:"0 auto",padding:"72px 32px",width:"100%"}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:32,fontWeight:800,color:"#0F1F3D",marginBottom:12}}>Para cada parte del ecosistema</h2>
        <p style={{fontSize:15,color:"#64748B",maxWidth:480,margin:"0 auto"}}>Tres tipos de cuenta diseñados para las necesidades reales del sector.</p>
      </div>
      <div className="land-for-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
        {[
          {style:{"--accent":"#2563EB"},e:"🍽️",t:"Restaurantes y Negocios",c:"#1D4ED8",bg:"#EFF6FF",feats:["Publica vacantes de empleo","Encuentra proveedores verificados","Gestiona citas y pedidos","CV profesional de candidatos","Subcuentas para tu equipo"]},
          {style:{"--accent":"#059669"},e:"📦",t:"Proveedores y Servicios",c:"#065F46",bg:"#ECFDF5",feats:["Catálogo de productos y servicios","Feed de publicaciones","Conecta con restaurantes","Calendario de citas","Datos de facturación seguros"]},
          {style:{"--accent":"#D97706"},e:"👨‍🍳",t:"Trabajadores",c:"#92400E",bg:"#FEF3C7",feats:["CV profesional descargable","Búsqueda de vacantes","Publica tu disponibilidad","Calificaciones y reputación","Chat directo con empleadores"]},
        ].map(({style:st,...card})=>(
          <div key={card.t} className="land-card" style={st}>
            <div style={{width:44,height:44,borderRadius:12,background:card.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:16}}>{card.e}</div>
            <h3 style={{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:16,color:"#0F1F3D",marginBottom:16}}>{card.t}</h3>
            <div>
              {card.feats.map(f=>(
                <div key={f} className="land-feat">
                  <div style={{width:18,height:18,borderRadius:"50%",background:card.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <IC n="check" s={10} c={card.c}/>
                  </div>
                  <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* APPS ECOSISTEMA */}
    <div className="land-apps-section" style={{background:"#F8FAFF",borderTop:"1px solid #E8EEF8",borderBottom:"1px solid #E8EEF8",padding:"56px 32px"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div className="land-apps-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#2563EB",fontFamily:"'Sora',sans-serif",letterSpacing:1,textTransform:"uppercase",marginBottom:12}}>Ecosistema de aplicaciones</div>
            <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:30,fontWeight:800,color:"#0F1F3D",marginBottom:16,lineHeight:1.3}}>Software especializado para tu operación</h2>
            <p style={{fontSize:14,color:"#64748B",lineHeight:1.75,marginBottom:24}}>Compra o renta las aplicaciones que necesites. Todo integrado en tu mismo panel RestLink.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[["🧺","Lavandería"],["🎁","Lealtad"],["🛒","Punto de Venta"],["📦","Almacén"],["💼","Nómina"]].map(([e,l])=>(
                <div key={l} className="land-app-chip"><span>{e}</span><span>{l}</span></div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {[
              {e:"🧺",n:"Lavandería",d:"Gestión de servicios",c:"#7C3AED",bg:"#EDE9FE"},
              {e:"🎁",n:"Programa de Lealtad",d:"Puntos y recompensas",c:"#DB2777",bg:"#FCE7F3"},
              {e:"🛒",n:"Punto de Venta",d:"Sistema FIFO",c:"#059669",bg:"#ECFDF5"},
              {e:"💼",n:"Nómina",d:"Pagos y empleados",c:"#D97706",bg:"#FEF3C7"},
            ].map(app=>(
              <div key={app.n} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:16,padding:18,display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:38,height:38,borderRadius:10,background:app.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{app.e}</div>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:"#0F1F3D",fontFamily:"'Sora',sans-serif"}}>{app.n}</div>
                  <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{app.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* CTA FINAL */}
    <div className="land-cta-section" style={{maxWidth:1100,margin:"0 auto",padding:"72px 32px",width:"100%",textAlign:"center"}}>
      <h2 style={{fontFamily:"'Sora',sans-serif",fontSize:34,fontWeight:800,color:"#0F1F3D",marginBottom:16,letterSpacing:-0.5}}>¿Listo para conectar tu negocio?</h2>
      <p style={{fontSize:15,color:"#64748B",maxWidth:440,margin:"0 auto 32px"}}>Crea tu cuenta gratis y empieza a conectar con proveedores, clientes y talento hoy mismo.</p>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn-primary" style={{padding:"14px 36px",fontSize:15}} onClick={onReg}>Crear cuenta gratis</button>
        <button className="btn-outline" style={{padding:"14px 36px",fontSize:15}} onClick={onLogin}>Iniciar sesión</button>
      </div>
    </div>

    {/* FOOTER */}
    <div className="land-footer" style={{borderTop:"1px solid #E8EEF8",padding:"20px 32px",background:"#fff"}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
        <div style={{fontFamily:"'Sora',sans-serif",fontWeight:800,fontSize:18,color:"#0F1F3D"}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
        <div style={{fontSize:12,color:"#94A3B8"}}>Red B2B para gastronomía y hospitalidad · México 🇲🇽</div>
      </div>
    </div>
  </div>
);

/* ======================================================
   ONBOARDING SURVEYS
====================================================== */
const PRODUCTOS_TAGS = ["Frutas y Verduras","Carnes y Embutidos","Mariscos","Lácteos y Fríos","Abarrotes","Bebidas","Panadería","Limpieza e Higiene","Vajilla y Utensilios","Gas LP","Equipos de Cocina","Refrigeración","Otro"];
const SERVICIOS_TAGS = ["Electricista","Técnico de Gas","Plomero","Reparación de Equipo","Publicidad y Marketing","Diseño y Branding","Fotografía","Contabilidad","Recursos Humanos","Limpieza Industrial","Fumigación","Otro"];
const TRABAJOS_TAGS = ["Chef Ejecutivo","Chef de Partida","Cocinero A/B/C","Parrillero","Repostero","Mesero","Capitán de Meseros","Bartender","Barista","Hostess","Lavaplatos","Steward","Gerente de Restaurante","Administrador","Repartidor","Otro"];

const TagSelector = ({tags,selected,onToggle,search,setSearch}) => (
  <div>
    {setSearch&&(
      <input className="input" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:10,fontSize:13}}/>
    )}
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {tags.filter(t=>!search||t.toLowerCase().includes(search.toLowerCase())).map(t=>{
        const sel=selected.includes(t);
        return(
          <button key={t} onClick={()=>onToggle(t)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${sel?"#2563EB":"#E2ECF8"}`,background:sel?"#1D4ED8":"#fff",color:sel?"#fff":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.15s"}}>
            {t}
          </button>
        );
      })}
    </div>
  </div>
);

const OtroInput = ({show,value,onChange,placeholder}) => show?(
  <input className="input" placeholder={placeholder||"Especifica..."} value={value} onChange={e=>onChange(e.target.value)} style={{marginTop:10,fontSize:13}}/>
):null;

const OnboardingNegocio = ({user,onDone}) => {
  const [step,setStep] = useState(1);
  const [tipoNegocio,setTipoNegocio] = useState("");
  const [tipoOtro,setTipoOtro] = useState("");
  const [prodSel,setProdSel] = useState([]);
  const [prodSearch,setProdSearch] = useState("");
  const [prodOtro,setProdOtro] = useState("");
  const [servSel,setServSel] = useState([]);
  const [servOtro,setServOtro] = useState("");

  const toggleProd=t=>{if(t==="Otro"){setProdSel(p=>p.includes("Otro")?p.filter(x=>x!=="Otro"):[...p,"Otro"]);}else setProdSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);};
  const toggleServ=t=>{if(t==="Otro"){setServSel(p=>p.includes("Otro")?p.filter(x=>x!=="Otro"):[...p,"Otro"]);}else setServSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);};

  const finish=()=>{
    const data={tipoNegocio:tipoNegocio==="Otro"?tipoOtro:tipoNegocio,productosInteres:prodSel,serviciosInteres:servSel,prodOtro,servOtro};
    Object.assign(user,{onboarding:data});
    onDone(user);
  };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F1F3D,#1E3A6E)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:36,width:"100%",maxWidth:520,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:20,color:"#0F1F3D"}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
          <span style={{fontSize:12,color:"#94A3B8",fontWeight:600}}>{step}/3</span>
        </div>
        <div style={{height:4,background:"#F1F5F9",borderRadius:99,marginBottom:24,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(step/3)*100}%`,background:"linear-gradient(90deg,#1D4ED8,#2563EB)",borderRadius:99,transition:"width 0.3s"}}/>
        </div>

        {step===1&&(
          <div className="fade-in">
            <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué tipo de negocio eres?</h3>
            <p style={{fontSize:13,color:"#64748B",marginBottom:18}}>Cuéntanos para personalizar tu experiencia.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {["Hotel","Restaurante","Tienda","Otro"].map(t=>(
                <button key={t} onClick={()=>setTipoNegocio(t)} style={{padding:"12px 18px",border:`2px solid ${tipoNegocio===t?"#2563EB":"#E2E8F0"}`,borderRadius:12,background:tipoNegocio===t?"#EFF6FF":"#fff",color:tipoNegocio===t?"#1D4ED8":"#374151",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
                  {t==="Hotel"?"🏨":t==="Restaurante"?"🍽️":t==="Tienda"?"🏪":"✏️"} {t}
                </button>
              ))}
            </div>
            {tipoNegocio==="Otro"&&<input className="input" placeholder="¿Qué tipo de negocio?" value={tipoOtro} onChange={e=>setTipoOtro(e.target.value)} style={{marginBottom:16,fontSize:13}}/>}
            <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:13}} onClick={()=>tipoNegocio&&setStep(2)} disabled={!tipoNegocio}>Siguiente</button>
          </div>
        )}

        {step===2&&(
          <div className="fade-in">
            <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué productos son de tu interés?</h3>
            <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Selecciona todo lo que aplique.</p>
            <TagSelector tags={PRODUCTOS_TAGS} selected={prodSel} onToggle={toggleProd} search={prodSearch} setSearch={setProdSearch}/>
            <OtroInput show={prodSel.includes("Otro")} value={prodOtro} onChange={setProdOtro} placeholder="¿Qué otro producto?"/>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(1)}>Atrás</button>
              <button className="btn-primary" style={{flex:2,justifyContent:"center",padding:13}} onClick={()=>setStep(3)}>Siguiente</button>
            </div>
          </div>
        )}

        {step===3&&(
          <div className="fade-in">
            <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué servicios son de tu interés?</h3>
            <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Selecciona todo lo que aplique.</p>
            <TagSelector tags={SERVICIOS_TAGS} selected={servSel} onToggle={toggleServ}/>
            <OtroInput show={servSel.includes("Otro")} value={servOtro} onChange={setServOtro} placeholder="¿Qué otro servicio?"/>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(2)}>Atrás</button>
              <button className="btn-primary" style={{flex:2,justifyContent:"center",padding:13}} onClick={finish}>Comenzar →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OnboardingProveedor = ({user,onDone}) => {
  const [step,setStep] = useState(1);
  const [rol,setRol] = useState([]);
  const [vendeSel,setVendeSel] = useState([]);
  const [vendeOtro,setVendeOtro] = useState("");
  const [servSel,setServSel] = useState([]);
  const [servOtro,setServOtro] = useState("");

  const toggleRol=r=>setRol(p=>p.includes(r)?p.filter(x=>x!==r):[...p,r]);
  const toggleVende=t=>setVendeSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const toggleServ=t=>setServSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const esProveedor=rol.includes("Proveedor");
  const esPrestador=rol.includes("Prestador de servicios");

  const finish=()=>{
    Object.assign(user,{onboarding:{rol,vendeSel,vendeOtro,servSel,servOtro}});
    onDone(user);
  };

  const totalSteps=1+(esProveedor?1:0)+(esPrestador?1:0)||1;
  const currentStep=step;

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F1F3D,#1E3A6E)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:36,width:"100%",maxWidth:520,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:20,color:"#0F1F3D"}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
          <span style={{fontSize:12,color:"#94A3B8",fontWeight:600}}>{currentStep}/{totalSteps}</span>
        </div>
        <div style={{height:4,background:"#F1F5F9",borderRadius:99,marginBottom:24,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(currentStep/totalSteps)*100}%`,background:"linear-gradient(90deg,#1D4ED8,#2563EB)",borderRadius:99,transition:"width 0.3s"}}/>
        </div>

        {step===1&&(
          <div className="fade-in">
            <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué eres?</h3>
            <p style={{fontSize:13,color:"#64748B",marginBottom:18}}>Puedes seleccionar ambas opciones.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {["Proveedor","Prestador de servicios"].map(r=>{
                const sel=rol.includes(r);
                return(
                  <button key={r} onClick={()=>toggleRol(r)} style={{padding:"14px 18px",border:`2px solid ${sel?"#2563EB":"#E2E8F0"}`,borderRadius:12,background:sel?"#EFF6FF":"#fff",color:sel?"#1D4ED8":"#374151",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:14,cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s"}}>
                    <span style={{width:20,height:20,border:`2px solid ${sel?"#2563EB":"#CBD5E1"}`,borderRadius:5,background:sel?"#1D4ED8":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      {sel&&<IC n="check" s={12} c="#fff"/>}
                    </span>
                    {r==="Proveedor"?"📦":"🔧"} {r}
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:13}} onClick={()=>{
              if(rol.length===0)return;
              if(esProveedor){setStep(2);}else if(esPrestador){setStep(3);}
            }} disabled={rol.length===0}>Siguiente</button>
          </div>
        )}

        {step===2&&esProveedor&&(
          <div className="fade-in">
            <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué vendes?</h3>
            <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Selecciona las categorías de tus productos.</p>
            <TagSelector tags={PRODUCTOS_TAGS} selected={vendeSel} onToggle={toggleVende}/>
            <OtroInput show={vendeSel.includes("Otro")} value={vendeOtro} onChange={setVendeOtro} placeholder="¿Qué otro producto vendes?"/>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>setStep(1)}>Atrás</button>
              <button className="btn-primary" style={{flex:2,justifyContent:"center",padding:13}} onClick={()=>esPrestador?setStep(3):finish()}>Siguiente</button>
            </div>
          </div>
        )}

        {step===3&&esPrestador&&(
          <div className="fade-in">
            <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué servicios ofreces?</h3>
            <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Selecciona todo lo que aplique.</p>
            <TagSelector tags={SERVICIOS_TAGS} selected={servSel} onToggle={toggleServ}/>
            <OtroInput show={servSel.includes("Otro")} value={servOtro} onChange={setServOtro} placeholder="¿Qué otro servicio ofreces?"/>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button className="btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>esProveedor?setStep(2):setStep(1)}>Atrás</button>
              <button className="btn-primary" style={{flex:2,justifyContent:"center",padding:13}} onClick={finish}>Comenzar →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OnboardingTrabajador = ({user,onDone}) => {
  const [trabajosSel,setTrabajosSel] = useState([]);
  const [trabajoOtro,setTrabajoOtro] = useState("");
  const toggleTrabajo=t=>setTrabajosSel(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const finish=()=>{ Object.assign(user,{onboarding:{trabajosSel,trabajoOtro}}); onDone(user); };

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0F1F3D,#1E3A6E)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:20,padding:36,width:"100%",maxWidth:520,boxShadow:"0 24px 64px rgba(0,0,0,0.3)"}}>
        <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:20,color:"#0F1F3D",marginBottom:20}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
        <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D",marginBottom:6}}>¿Qué trabajos son de tu interés?</h3>
        <p style={{fontSize:13,color:"#64748B",marginBottom:16}}>Selecciona los puestos que te interesan.</p>
        <div style={{maxHeight:300,overflowY:"auto",paddingRight:4}}>
          <TagSelector tags={TRABAJOS_TAGS} selected={trabajosSel} onToggle={toggleTrabajo}/>
        </div>
        <OtroInput show={trabajosSel.includes("Otro")} value={trabajoOtro} onChange={setTrabajoOtro} placeholder="¿Qué otro trabajo te interesa?"/>
        <div style={{background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"1px solid #BFDBFE",borderRadius:12,padding:16,marginTop:20,marginBottom:16}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:20}}>💡</span>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"#1E40AF",marginBottom:3}}>¡Completa tu perfil!</div>
              <div style={{fontSize:12,color:"#3B82F6",lineHeight:1.5}}>Completa tu información desde tu perfil para que otros trabajos te encuentren.</div>
            </div>
          </div>
        </div>
        <button className="btn-primary" style={{width:"100%",justifyContent:"center",padding:13}} onClick={finish}>Siguiente →</button>
      </div>
    </div>
  );
};

/* ======================================================
   AUTH
====================================================== */
const AuthPage = ({mode,onSwitch,onSuccess}) => {
  const [type,setType] = useState("restaurante");
  const [f,setF] = useState({name:"",email:"",password:"",rfc:"",curp:""});
  const [noRfc,setNoRfc] = useState(false);
  const [err,setErr] = useState("");
  const [pendingUser,setPendingUser] = useState(null);

  const login = () => {
    let u = USERS.find(u=>u.email===f.email && u.password===f.password);
    if(!u){ const sub = SUBACCOUNTS.find(s=>s.email===f.email && s.password===f.password); if(sub){ u={...sub,type:"sub",parentId:sub.parentId}; } }
    if(u) onSuccess(u);
    else setErr("Correo o contraseña incorrectos. Demo: fogon@demo.com / 1234");
  };

  const register = () => {
    if(!f.name||!f.email||!f.password){setErr("Completa los campos obligatorios.");return;}
    if(type!=="trabajador"&&!noRfc&&!f.rfc){setErr("El RFC es obligatorio o marca 'No cuento con RFC'.");return;}
    if(type!=="trabajador"&&!noRfc&&f.rfc.length!==13){setErr("El RFC debe tener 13 caracteres.");return;}
    if(type==="trabajador"&&!f.curp){setErr("La CURP es obligatoria para trabajadores.");return;}
    if(type==="trabajador"&&f.curp.length!==18){setErr("La CURP debe tener 18 caracteres.");return;}
    const nu={id:"u_"+Date.now(),name:f.name,email:f.email,password:f.password,type,rfc:noRfc?"INFORMAL":f.rfc||"",curp:f.curp||"",informal:noRfc&&type!=="trabajador",avatar:f.name.slice(0,2).toUpperCase(),rating:0,reviewCount:0,location:"México",description:"",billing:null,skills:[],workHistory:[],age:null,zone:""};
    USERS.push(nu);
    setPendingUser(nu);
  };

  if(pendingUser){
    if(pendingUser.type==="restaurante"||pendingUser.type==="sub") return <OnboardingNegocio user={pendingUser} onDone={onSuccess}/>;
    if(pendingUser.type==="proveedor") return <OnboardingProveedor user={pendingUser} onDone={onSuccess}/>;
    if(pendingUser.type==="trabajador") return <OnboardingTrabajador user={pendingUser} onDone={onSuccess}/>;
  }

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
                <button key={t} onClick={()=>{setType(t);setNoRfc(false);setErr("");}} style={{padding:"10px 6px",border:`2px solid ${type===t?"#2563EB":"#E2E8F0"}`,borderRadius:10,background:type===t?"#EFF6FF":"#fff",color:type===t?"#1D4ED8":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:11,cursor:"pointer"}}>
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
              <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>RFC del negocio {!noRfc&&"*"} <span style={{fontWeight:400,color:"#94A3B8"}}>{!noRfc&&"(13 caracteres)"}</span></label>
              {!noRfc&&<input className="input" placeholder="Ej: REF150320CX3" maxLength={13} value={f.rfc} onChange={e=>setF({...f,rfc:e.target.value.toUpperCase()})} style={{marginBottom:8}}/>}
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",userSelect:"none"}}>
                <input type="checkbox" checked={noRfc} onChange={e=>{setNoRfc(e.target.checked);if(e.target.checked)setF(p=>({...p,rfc:""}));}} style={{width:15,height:15,accentColor:"#2563EB",cursor:"pointer"}}/>
                <span style={{fontSize:13,color:"#374151",fontWeight:500}}>No cuento con RFC</span>
              </label>
              {noRfc&&(
                <div style={{marginTop:10,background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 14px"}}>
                  <span style={{fontSize:12,color:"#92400E",fontWeight:500}}>⚠️ Serás dado de alta como <strong>negocio informal</strong>. Podrás actualizar tu RFC desde tu perfil cuando lo obtengas.</span>
                </div>
              )}
            </div>
          )}
          {mode==="register"&&type==="trabajador"&&(
            <div>
              <label style={{display:"block",fontWeight:600,fontSize:13,color:"#374151",marginBottom:6}}>CURP * <span style={{fontWeight:400,color:"#94A3B8"}}>(18 caracteres)</span></label>
              <input className="input" placeholder="Ej: PEGJ870522HDFRRN09" maxLength={18} value={f.curp} onChange={e=>setF({...f,curp:e.target.value.toUpperCase()})}/>
            </div>
          )}
        </div>

        {mode==="login"&&<p style={{fontSize:12,color:"#94A3B8",margin:"14px 0"}}>Demo: fogon@demo.com | fresca@demo.com | juan@demo.com | admin@restlink.mx -- pass: 1234 / admin2024</p>}

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

/* ======================================================
   APP STORE -- datos y página
====================================================== */
const APP_CATALOG = [
  {
    id:"app_lavanderia",
    name:"Lavandería Pro",
    icon:"👕",
    color:"#0891B2",
    bg:"#ECFEFF",
    border:"#A5F3FC",
    category:"Operaciones",
    desc:"Gestiona tu lavandería: órdenes, entregas, clientes, tipos de servicio (lavado, planchado, tintorería). Historial de prendas y tickets.",
    features:["Registro de órdenes","Control de entregas","Clientes frecuentes","Ticket de impresión","Caja diaria"],
    buyPrice:3499,
    rentPrice:299,
    navLabel:"Lavandería",
    navIcon:"shirt",
  },
  {
    id:"app_lealtad",
    name:"Programa de Lealtad",
    icon:"🎁",
    color:"#DB2777",
    bg:"#FDF2F8",
    border:"#FBCFE8",
    category:"Marketing",
    desc:"Fideliza a tus clientes frecuentes con puntos, sellos y recompensas. Tarjeta digital, historial de visitas y campañas de descuento.",
    features:["Tarjeta de sellos digital","Sistema de puntos","Recompensas configurables","Panel de clientes","Campañas SMS/Email"],
    buyPrice:2999,
    rentPrice:249,
    navLabel:"Lealtad",
    navIcon:"star",
  },
  {
    id:"app_almacen",
    name:"Sistema de Almacén",
    icon:"🏭",
    color:"#7C3AED",
    bg:"#F5F3FF",
    border:"#DDD6FE",
    category:"Inventario",
    desc:"Control total de entradas y salidas de mercancía. Alertas de stock mínimo, proveedores, órdenes de compra y reportes de inventario.",
    features:["Entradas y salidas","Alertas de stock mínimo","Órdenes de compra","Lotes y caducidades","Reportes PDF"],
    buyPrice:4999,
    rentPrice:399,
    navLabel:"Almacén",
    navIcon:"package",
  },
  {
    id:"app_pv_fifo",
    name:"Punto de Venta FIFO",
    icon:"🛒",
    color:"#059669",
    bg:"#ECFDF5",
    border:"#A7F3D0",
    category:"Ventas",
    desc:"POS con método FIFO (primero en entrar, primero en salir). Ideal para negocios con productos perecederos. Facturación CFDI integrada.",
    features:["Venta con FIFO automático","Facturación CFDI 4.0","Múltiples formas de pago","Control de cajeros","Cierre de caja diario"],
    buyPrice:5999,
    rentPrice:499,
    navLabel:"PV FIFO",
    navIcon:"trending",
  },
  {
    id:"app_pv_restaurante",
    name:"PV Restaurante",
    icon:"🍽️",
    color:"#D97706",
    bg:"#FFFBEB",
    border:"#FDE68A",
    category:"Restaurantes",
    desc:"Sistema completo para restaurantes con perfiles de mesero, mesas, comandas en cocina, propinas, modificadores y splits de cuenta.",
    features:["Perfiles por mesero","Mapa de mesas","Comandas en cocina","Split de cuenta","Propinas y cortesías"],
    buyPrice:6999,
    rentPrice:599,
    navLabel:"PV Restaurante",
    navIcon:"briefcase",
  },
  {
    id:"app_nomina",
    name:"Registro de Nómina",
    icon:"👥",
    color:"#1D4ED8",
    bg:"#EFF6FF",
    border:"#BFDBFE",
    category:"RRHH",
    desc:"Controla entradas, salidas, retardos, faltas e incidencias de tu personal. Cálculo automático de nómina, vacaciones e IMSS.",
    features:["Check-in / Check-out","Control de incidencias","Cálculo de nómina","Vacaciones y permisos","Reportes IMSS"],
    buyPrice:3999,
    rentPrice:349,
    navLabel:"Nómina",
    navIcon:"users",
  },
];

// Estado global de apps compradas (simula persistencia en sesión)
if(!window.__purchasedApps) window.__purchasedApps = [];
if(!window.__rentedApps) window.__rentedApps = [];

const AppsPage = ({onAppPurchased}) => {
  const [filter,setFilter] = useState("all");
  const [selected,setSelected] = useState(null);
  const [mode,setMode] = useState(null); // "buy" | "rent"
  const [toast,setToast] = useState("");
  const [purchased,setPurchased] = useState([...(window.__purchasedApps||[]),...(window.__rentedApps||[])]);

  const cats = ["all",...[...new Set(APP_CATALOG.map(a=>a.category))]];
  const filtered = filter==="all"?APP_CATALOG:APP_CATALOG.filter(a=>a.category===filter);

  const isOwned = id => purchased.includes(id);

  const handleAction = (app, m) => {
    if(isOwned(app.id)){setToast("Ya tienes esta aplicación.");setTimeout(()=>setToast(""),2500);return;}
    setSelected(app); setMode(m);
  };

  const confirmPurchase = () => {
    if(!selected)return;
    if(mode==="buy") window.__purchasedApps.push(selected.id);
    else window.__rentedApps.push(selected.id);
    setPurchased(p=>[...p,selected.id]);
    onAppPurchased&&onAppPurchased(selected,mode);
    setToast(`✓ ${selected.name} agregada a tu panel`);
    setTimeout(()=>setToast(""),3000);
    setSelected(null); setMode(null);
  };

  const fmtPrice = n => `$${n.toLocaleString("es-MX")} MXN`;

  return (
    <div style={{maxWidth:900}}>
      {toast&&(
        <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:"#0F1F3D",color:"#fff",borderRadius:99,padding:"10px 22px",fontSize:13,fontWeight:600,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,0.25)",whiteSpace:"nowrap"}}>
          {toast}
        </div>
      )}

      {/* Modal de compra */}
      {selected&&(
        <div className="modal-overlay" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:52,marginBottom:10}}>{selected.icon}</div>
              <h3 style={{fontWeight:800,fontSize:20,color:"#0F1F3D",marginBottom:4}}>{selected.name}</h3>
              <span style={{fontSize:12,fontWeight:700,padding:"3px 10px",borderRadius:99,background:selected.bg,color:selected.color}}>{selected.category}</span>
            </div>
            <p style={{fontSize:14,color:"#374151",lineHeight:1.7,marginBottom:16,textAlign:"center"}}>{selected.desc}</p>
            <div style={{background:"#F8FAFF",border:"1px solid #E2ECF8",borderRadius:12,padding:14,marginBottom:20}}>
              {selected.features.map((f,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:i<selected.features.length-1?"1px solid #F1F5F9":"none"}}>
                  <IC n="check" s={13} c="#059669"/><span style={{fontSize:13,color:"#374151"}}>{f}</span>
                </div>
              ))}
            </div>
            {mode==="buy"?(
              <div style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:12,padding:16,marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:12,color:"#065F46",fontWeight:600,marginBottom:4}}>💳 Compra única -- licencia de por vida</div>
                <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:28,color:"#059669"}}>{fmtPrice(selected.buyPrice)}</div>
              </div>
            ):(
              <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:12,padding:16,marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:12,color:"#1E40AF",fontWeight:600,marginBottom:4}}>🔄 Renta mensual -- cancela cuando quieras</div>
                <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:28,color:"#1D4ED8"}}>{fmtPrice(selected.rentPrice)}<span style={{fontSize:14,fontWeight:500,color:"#64748B"}}>/mes</span></div>
              </div>
            )}
            <div style={{display:"flex",gap:10}}>
              <button className="btn-outline" style={{flex:1,justifyContent:"center"}} onClick={()=>setSelected(null)}>Cancelar</button>
              <button className="btn-primary" style={{flex:2,justifyContent:"center",padding:13}} onClick={confirmPurchase}>
                {mode==="buy"?"Comprar ahora":"Suscribirme"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Aplicaciones</h2>
        <p style={{color:"#64748B",fontSize:14}}>Software especializado para tu negocio -- compra o renta según lo que necesites</p>
      </div>

      {/* Filtro por categoría */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:24}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 16px",borderRadius:99,border:"1.5px solid",borderColor:filter===c?"#2563EB":"#E2ECF8",background:filter===c?"#1D4ED8":"#fff",color:filter===c?"#fff":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.15s"}}>
            {c==="all"?"🧩 Todas":c}
          </button>
        ))}
      </div>

      {/* Grid de apps */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18}}>
        {filtered.map(app=>{
          const owned = isOwned(app.id);
          return (
            <div key={app.id} style={{background:"#fff",border:`1.5px solid ${owned?app.border:"#E2ECF8"}`,borderRadius:18,overflow:"hidden",boxShadow:owned?`0 4px 24px ${app.color}22`:"0 2px 8px rgba(30,64,175,0.05)",transition:"all 0.2s",position:"relative"}}>
              {owned&&<div style={{position:"absolute",top:12,right:12,background:app.color,color:"#fff",borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:700,fontFamily:"Sora,sans-serif"}}>✓ Instalada</div>}
              {/* Header de color */}
              <div style={{height:90,background:`linear-gradient(135deg,${app.bg},${app.color}22)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44}}>
                {app.icon}
              </div>
              <div style={{padding:18}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:8,marginBottom:6}}>
                  <div>
                    <div style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:15,color:"#0F1F3D"}}>{app.name}</div>
                    <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,background:app.bg,color:app.color}}>{app.category}</span>
                  </div>
                </div>
                <p style={{fontSize:12,color:"#64748B",lineHeight:1.6,marginBottom:12,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{app.desc}</p>
                {/* Precios */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                  <div style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#065F46",fontWeight:600,marginBottom:2}}>Compra</div>
                    <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:14,color:"#059669"}}>${(app.buyPrice/1000).toFixed(1)}k</div>
                    <div style={{fontSize:9,color:"#94A3B8"}}>MXN único</div>
                  </div>
                  <div style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:10,padding:"8px 10px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:"#1E40AF",fontWeight:600,marginBottom:2}}>Renta</div>
                    <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:14,color:"#1D4ED8"}}>${app.rentPrice}</div>
                    <div style={{fontSize:9,color:"#94A3B8"}}>MXN /mes</div>
                  </div>
                </div>
                {owned?(
                  <button style={{width:"100%",padding:"10px 0",border:"none",borderRadius:10,background:app.bg,color:app.color,fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,cursor:"default"}}>
                    ✓ Ya instalada en tu panel
                  </button>
                ):(
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <button className="btn-outline btn-sm" style={{justifyContent:"center"}} onClick={()=>handleAction(app,"rent")}>Rentar</button>
                    <button className="btn-primary btn-sm" style={{justifyContent:"center"}} onClick={()=>handleAction(app,"buy")}>Comprar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mis apps instaladas */}
      {purchased.length>0&&(
        <div style={{marginTop:36}}>
          <h3 style={{fontSize:16,fontWeight:700,color:"#1E3A6E",marginBottom:14}}>✓ Mis aplicaciones instaladas ({purchased.length})</h3>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {purchased.map(id=>{
              const app=APP_CATALOG.find(a=>a.id===id);
              if(!app)return null;
              const isRented=window.__rentedApps?.includes(id);
              return(
                <div key={id} style={{display:"flex",alignItems:"center",gap:10,background:app.bg,border:`1px solid ${app.border}`,borderRadius:12,padding:"10px 14px"}}>
                  <span style={{fontSize:22}}>{app.icon}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:13,color:app.color}}>{app.name}</div>
                    <div style={{fontSize:11,color:"#94A3B8"}}>{isRented?"Renta mensual":"Licencia permanente"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
const Layout = ({user,view,setView,children,purchasedApps=[]}) => {
  const isAdmin = user.type==="admin";
  const isSub = user.type==="sub";
  const [showSettings,setShowSettings] = useState(false);
  const [settingsTab,setSettingsTab] = useState("likes");

  const appsNavItem = {id:"apps",l:"Aplicaciones",i:"grid"};

  const navMap = {
    restaurante:[{id:"feed",l:"Feed",i:"feed"},{id:"search",l:"Buscar Proveedores",i:"search"},{id:"vacantes",l:"Vacantes",i:"briefcase"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"},{id:"ratings",l:"Calificaciones",i:"star"},{id:"subaccounts",l:"Subcuentas",i:"users"},{id:"profile",l:"Mi Perfil",i:"user"}],
    proveedor:[{id:"feed",l:"Feed",i:"feed"},{id:"catalog",l:"Mi Catálogo",i:"package"},{id:"search",l:"Directorio",i:"search"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"},{id:"ratings",l:"Calificaciones",i:"star"},{id:"subaccounts",l:"Subcuentas",i:"users"},{id:"profile",l:"Mi Perfil",i:"user"}],
    trabajador:[{id:"feed",l:"Feed",i:"feed"},{id:"search",l:"Buscar Vacantes",i:"search"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"},{id:"ratings",l:"Calificaciones",i:"star"},{id:"profile",l:"Mi Perfil",i:"user"}],
    admin:[{id:"admin",l:"Dashboard",i:"trending"},{id:"admin_users",l:"Usuarios",i:"users"},{id:"admin_content",l:"Contenido",i:"feed"},{id:"admin_reports",l:"Reportes",i:"star"}],
  };
  const subNav = [{id:"feed",l:"Feed",i:"feed"},{id:"chat",l:"Mensajes",i:"chat"},{id:"calendar",l:"Calendario",i:"calendar"}];
  const baseItems = isAdmin ? navMap.admin : isSub ? subNav : (navMap[user.type]||navMap.restaurante);

  // Apps item + compradas
  const extraItems = (!isAdmin&&!isSub) ? [appsNavItem] : [];
  const purchasedItems = purchasedApps.map(app=>({id:`app_run_${app.id}`,l:app.navLabel,i:app.navIcon,appIcon:app.icon,appColor:app.color}));
  const items = [...baseItems,...extraItems,...purchasedItems];
  const mobileItems = baseItems.slice(0,5);

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#F0F4F8"}}>
      {/* -- Desktop sidebar -- */}
      <aside className="sidebar-desktop" style={{width:240,background:"#fff",borderRight:"1px solid #E2ECF8",flexDirection:"column",padding:"24px 16px",position:"fixed",top:0,left:0,bottom:0,zIndex:100,boxShadow:"2px 0 16px rgba(15,31,61,0.05)"}}>
        <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:"#0F1F3D",marginBottom:24,paddingLeft:6,letterSpacing:-0.5}}>Rest<span style={{color:"#2563EB"}}>Link</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"#F8FAFF",border:"1px solid #DBEAFE",borderRadius:12,padding:"10px 12px",marginBottom:22}}>
          <Av initials={user.avatar} size={34} color={TC[user.type]||"#1D4ED8"}/>
          <div style={{overflow:"hidden"}}>
            <div style={{fontWeight:700,fontSize:12,fontFamily:"Sora,sans-serif",color:"#0F1F3D",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
            <span className={`tag tag-${user.type}`} style={{fontSize:10}}>{TL[user.type]||user.type}</span>
            {user.informal&&<span className="tag" style={{fontSize:9,background:"#FEF9C3",color:"#78350F",marginLeft:2}}>Informal</span>}
          </div>
        </div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:3,overflowY:"auto"}}>
          {items.map((item,idx)=>{
            const isAppsSep = item.id==="apps" && idx>0;
            const isPurchasedApp = item.id?.startsWith("app_run_");
            return (
              <div key={item.id}>
                {isAppsSep&&<div style={{height:1,background:"#E2ECF8",margin:"8px 4px 6px"}}/>}
                {isPurchasedApp&&items[idx-1]?.id==="apps"&&<div style={{fontSize:10,fontWeight:700,color:"#94A3B8",padding:"2px 14px 4px",letterSpacing:0.5,textTransform:"uppercase"}}>Mis Apps</div>}
                <div className={`sidebar-item${view===item.id?" active":""}`} onClick={()=>setView(item.id)}>
                  {item.appIcon
                    ?<span style={{fontSize:15,lineHeight:1}}>{item.appIcon}</span>
                    :<IC n={item.i} s={16}/>
                  }
                  <span style={{fontSize:13}}>{item.l}</span>
                </div>
              </div>
            );
          })}
        </nav>
        <div style={{borderTop:"1px solid #E2ECF8",paddingTop:10,marginTop:4,display:"flex",flexDirection:"column",gap:6}}>
          <button style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"1.5px solid #BFDBFE",cursor:"pointer",color:"#1D4ED8",fontFamily:"IBM Plex Sans,sans-serif",fontWeight:600,fontSize:13,transition:"all 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="linear-gradient(135deg,#DBEAFE,#BFDBFE)"}
            onMouseLeave={e=>e.currentTarget.style.background="linear-gradient(135deg,#EFF6FF,#DBEAFE)"}>
            <IC n="chat" s={15} c="#2563EB"/>
            <span>Hablar con soporte</span>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div className="sidebar-item" style={{flex:1,color:"#94A3B8"}} onClick={()=>window.location.reload()}>
              <IC n="logout" s={16}/><span style={{fontSize:13}}>Cerrar Sesión</span>
            </div>
            <button onClick={()=>setShowSettings(true)} style={{width:36,height:36,borderRadius:9,background:"#F8FAFF",border:"1px solid #E2ECF8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748B",flexShrink:0}} title="Configuración">
              <IC n="gear" s={16}/>
            </button>
          </div>
        </div>
        {showSettings&&(
          <div className="modal-overlay" onClick={()=>setShowSettings(false)}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D"}}>Configuración</h3>
                <button style={{background:"none",border:"none",cursor:"pointer",color:"#64748B"}} onClick={()=>setShowSettings(false)}><IC n="x" s={20}/></button>
              </div>
              <div style={{display:"flex",gap:6,marginBottom:20,background:"#F8FAFF",border:"1px solid #E2ECF8",borderRadius:10,padding:4}}>
                {[{id:"likes",l:"❤️ Mis Me gusta"},{id:"saved",l:"🔖 Guardados"},{id:"lang",l:"🌐 Idioma"}].map(t=>(
                  <button key={t.id} onClick={()=>setSettingsTab(t.id)} style={{flex:1,padding:"7px 8px",borderRadius:8,border:"none",background:settingsTab===t.id?"#fff":"transparent",color:settingsTab===t.id?"#1D4ED8":"#64748B",fontWeight:settingsTab===t.id?700:500,fontSize:12,cursor:"pointer",fontFamily:"Sora,sans-serif",boxShadow:settingsTab===t.id?"0 1px 4px rgba(30,64,175,0.12)":"none"}}>
                    {t.l}
                  </button>
                ))}
              </div>
              {settingsTab==="likes"&&(
                <div>
                  <p style={{fontSize:13,color:"#64748B",marginBottom:14}}>Publicaciones que has marcado con Me gusta:</p>
                  {(window.__likedPosts||[]).length===0?<p style={{color:"#94A3B8",fontSize:13,textAlign:"center",padding:"20px 0"}}>Aún no has dado Me gusta a ninguna publicación.</p>:
                    (window.__likedPosts||[]).map((p,i)=>(
                      <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #F1F5F9",fontSize:13,color:"#374151"}}>{p}</div>
                    ))
                  }
                </div>
              )}
              {settingsTab==="saved"&&(
                <div>
                  <p style={{fontSize:13,color:"#64748B",marginBottom:14}}>Publicaciones guardadas:</p>
                  {(window.__savedPosts||[]).length===0?<p style={{color:"#94A3B8",fontSize:13,textAlign:"center",padding:"20px 0"}}>No has guardado ninguna publicación aún.</p>:
                    (window.__savedPosts||[]).map((p,i)=>(
                      <div key={i} style={{padding:"10px 0",borderBottom:"1px solid #F1F5F9",fontSize:13,color:"#374151"}}>{p.content?.substring(0,60)}...</div>
                    ))
                  }
                </div>
              )}
              {settingsTab==="lang"&&(
                <div>
                  <p style={{fontSize:13,color:"#64748B",marginBottom:14}}>Idioma de la plataforma:</p>
                  {["Español (México)","English (US)","Français","Português"].map(lang=>(
                    <div key={lang} onClick={()=>{window.__lang=lang;}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",border:"1.5px solid",borderColor:lang==="Español (México)"?"#2563EB":"#E2ECF8",borderRadius:10,cursor:"pointer",marginBottom:8,background:lang==="Español (México)"?"#EFF6FF":"#fff"}}>
                      <span style={{fontWeight:600,fontSize:13,color:lang==="Español (México)"?"#1D4ED8":"#374151"}}>{lang}</span>
                      {lang==="Español (México)"&&<IC n="check" s={16} c="#2563EB"/>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* -- Main -- */}
      <main className="main-content" style={{marginLeft:240,flex:1,padding:"28px 32px",maxWidth:"calc(100vw - 240px)"}}>
        <div className="fade-in">{children}</div>
      </main>

      {/* -- Mobile bottom nav -- */}
      <nav className="bottom-nav" style={{justifyContent:"space-around",alignItems:"center"}}>
        {mobileItems.map(item=>(
          <button key={item.id} onClick={()=>setView(item.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"6px 10px",color:view===item.id?"#1D4ED8":"#94A3B8",flex:1}}>
            <IC n={item.i} s={22} c={view===item.id?"#1D4ED8":"#94A3B8"}/>
            <span style={{fontSize:9,fontFamily:"Sora,sans-serif",fontWeight:view===item.id?700:400}}>{item.l}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

/* ======================================================
   SEARCH / DIRECTORIO
====================================================== */
/* -- VACANTES SEARCH (vista para trabajadores) -- */
const VacantesSearch = ({currentUser, posts, onOpenChat, onOpenProfile}) => {
  const [q, setQ] = useState("");
  const [filtroPuesto, setFiltroPuesto] = useState("all");
  const [filtroUbicacion, setFiltroUbicacion] = useState("all");
  const [filtroSueldo, setFiltroSueldo] = useState("all");
  const [ordenar, setOrdenar] = useState("reciente");

  // Todas las vacantes publicadas en el feed
  const allVacantes = (posts||[]).filter(p => p.type === "vacante" && p.vacancyInfo);

  // Extraer valores únicos para filtros
  const puestos = ["all", ...new Set(allVacantes.map(v => v.vacancyInfo?.position).filter(Boolean))];
  const ubicaciones = ["all", ...new Set(allVacantes.map(v => v.vacancyInfo?.location).filter(Boolean))];

  const rangos = [
    {v:"all", l:"Cualquier sueldo"},
    {v:"low", l:"Hasta $10,000"},
    {v:"mid", l:"$10,000 – $20,000"},
    {v:"high", l:"Más de $20,000"},
  ];

  const parseSueldo = str => {
    if(!str) return 0;
    const nums = str.replace(/[^0-9,]/g,"").split(",").map(n=>parseInt(n.replace(/\D/g,""))||0).filter(Boolean);
    return nums.length ? nums[0] : 0;
  };

  const filtered = allVacantes.filter(v => {
    const vi = v.vacancyInfo;
    const mq = !q || (vi.position||"").toLowerCase().includes(q.toLowerCase()) ||
      (vi.location||"").toLowerCase().includes(q.toLowerCase()) ||
      v.authorName.toLowerCase().includes(q.toLowerCase()) ||
      v.content.toLowerCase().includes(q.toLowerCase());
    const mp = filtroPuesto === "all" || vi.position === filtroPuesto;
    const mu = filtroUbicacion === "all" || vi.location === filtroUbicacion;
    const sueldo = parseSueldo(vi.salary);
    const ms = filtroSueldo === "all" ||
      (filtroSueldo === "low" && sueldo <= 10000) ||
      (filtroSueldo === "mid" && sueldo > 10000 && sueldo <= 20000) ||
      (filtroSueldo === "high" && sueldo > 20000);
    return mq && mp && mu && ms;
  }).sort((a, b) => {
    if(ordenar === "reciente") return 0;
    if(ordenar === "likes") return b.likes - a.likes;
    return 0;
  });

  const activeFilters = [filtroPuesto!=="all", filtroUbicacion!=="all", filtroSueldo!=="all"].filter(Boolean).length;

  return (
    <div style={{maxWidth:820}}>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>Buscar Vacantes</h2>
        <p style={{color:"#64748B",fontSize:14}}>Encuentra oportunidades de trabajo en el sector gastronómico</p>
      </div>

      {/* Barra de búsqueda principal */}
      <div style={{background:"#fff",border:"1px solid #DBEAFE",borderRadius:14,padding:18,marginBottom:16,boxShadow:"0 2px 12px rgba(30,64,175,0.06)"}}>
        <div style={{position:"relative",marginBottom:14}}>
          <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#94A3B8"}}><IC n="search" s={17}/></div>
          <input className="input" placeholder="Buscar puesto, empresa, ubicación, palabras clave..." style={{paddingLeft:44,fontSize:14}} value={q} onChange={e=>setQ(e.target.value)}/>
          {q&&<button onClick={()=>setQ("")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#94A3B8"}}><IC n="x" s={15}/></button>}
        </div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          {/* Filtro puesto */}
          <select className="input" style={{flex:1,minWidth:150,fontSize:13}} value={filtroPuesto} onChange={e=>setFiltroPuesto(e.target.value)}>
            <option value="all">💼 Todos los puestos</option>
            {puestos.filter(p=>p!=="all").map(p=><option key={p} value={p}>{p}</option>)}
          </select>
          {/* Filtro ubicación */}
          <select className="input" style={{flex:1,minWidth:150,fontSize:13}} value={filtroUbicacion} onChange={e=>setFiltroUbicacion(e.target.value)}>
            <option value="all">📍 Todas las zonas</option>
            {ubicaciones.filter(u=>u!=="all").map(u=><option key={u} value={u}>{u}</option>)}
          </select>
          {/* Filtro sueldo */}
          <select className="input" style={{flex:1,minWidth:160,fontSize:13}} value={filtroSueldo} onChange={e=>setFiltroSueldo(e.target.value)}>
            {rangos.map(r=><option key={r.v} value={r.v}>💰 {r.l}</option>)}
          </select>
          {/* Ordenar */}
          <select className="input" style={{width:"auto",minWidth:140,fontSize:13}} value={ordenar} onChange={e=>setOrdenar(e.target.value)}>
            <option value="reciente">🕐 Más reciente</option>
            <option value="likes">❤️ Más populares</option>
          </select>
          {/* Limpiar filtros */}
          {activeFilters>0&&(
            <button className="btn-outline btn-sm" onClick={()=>{setFiltroPuesto("all");setFiltroUbicacion("all");setFiltroSueldo("all");}} style={{whiteSpace:"nowrap",flexShrink:0}}>
              ✕ Limpiar ({activeFilters})
            </button>
          )}
        </div>
      </div>

      {/* Chips de filtros activos */}
      {(q||activeFilters>0)&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
          <span style={{fontSize:12,color:"#64748B",fontWeight:600}}>Filtros activos:</span>
          {q&&<span style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:99,padding:"3px 12px",fontSize:12,color:"#1D4ED8",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>"{q}" <button onClick={()=>setQ("")} style={{background:"none",border:"none",cursor:"pointer",color:"#93C5FD",padding:0,lineHeight:1}}><IC n="x" s={11}/></button></span>}
          {filtroPuesto!=="all"&&<span style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:99,padding:"3px 12px",fontSize:12,color:"#1D4ED8",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>💼 {filtroPuesto} <button onClick={()=>setFiltroPuesto("all")} style={{background:"none",border:"none",cursor:"pointer",color:"#93C5FD",padding:0,lineHeight:1}}><IC n="x" s={11}/></button></span>}
          {filtroUbicacion!=="all"&&<span style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:99,padding:"3px 12px",fontSize:12,color:"#1D4ED8",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>📍 {filtroUbicacion} <button onClick={()=>setFiltroUbicacion("all")} style={{background:"none",border:"none",cursor:"pointer",color:"#93C5FD",padding:0,lineHeight:1}}><IC n="x" s={11}/></button></span>}
          {filtroSueldo!=="all"&&<span style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:99,padding:"3px 12px",fontSize:12,color:"#1D4ED8",fontWeight:600,display:"flex",alignItems:"center",gap:6}}>💰 {rangos.find(r=>r.v===filtroSueldo)?.l} <button onClick={()=>setFiltroSueldo("all")} style={{background:"none",border:"none",cursor:"pointer",color:"#93C5FD",padding:0,lineHeight:1}}><IC n="x" s={11}/></button></span>}
        </div>
      )}

      {/* Contador de resultados */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:13,color:"#64748B",fontWeight:600}}>
          {filtered.length === 0 ? "Sin resultados" : `${filtered.length} vacante${filtered.length!==1?"s":""} encontrada${filtered.length!==1?"s":""}`}
        </span>
      </div>

      {/* Lista de vacantes */}
      {filtered.length === 0 ? (
        <div style={{textAlign:"center",padding:"60px 20px",background:"#fff",borderRadius:16,border:"1px solid #E2ECF8"}}>
          <div style={{fontSize:48,marginBottom:12}}>🔍</div>
          <h3 style={{fontWeight:700,fontSize:16,color:"#0F1F3D",marginBottom:8}}>No se encontraron vacantes</h3>
          <p style={{fontSize:13,color:"#64748B",maxWidth:320,margin:"0 auto"}}>Intenta con otros filtros o palabras clave. Las nuevas vacantes aparecen aquí en tiempo real.</p>
          <button className="btn-outline" style={{marginTop:16}} onClick={()=>{setQ("");setFiltroPuesto("all");setFiltroUbicacion("all");setFiltroSueldo("all");}}>Ver todas las vacantes</button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {filtered.map(v => {
            const vi = v.vacancyInfo;
            const autor = USERS.find(u => u.id === v.authorId);
            return (
              <div key={v.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:16,padding:22,boxShadow:"0 2px 8px rgba(30,64,175,0.05)",transition:"box-shadow 0.2s,transform 0.2s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 32px rgba(30,64,175,0.12)";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 8px rgba(30,64,175,0.05)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
                  <div style={{cursor:"pointer",flexShrink:0}} onClick={()=>autor&&onOpenProfile&&onOpenProfile(autor)}>
                    <Av initials={v.authorAvatar} size={46} color={TC[v.authorType]}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                      <span className="user-link" style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}} onClick={()=>autor&&onOpenProfile&&onOpenProfile(autor)}>{v.authorName}</span>
                      <span className={`tag tag-${v.authorType}`} style={{fontSize:11}}>{TL[v.authorType]}</span>
                      <span className="tag tag-vacante" style={{fontSize:11}}>💼 Vacante</span>
                    </div>
                    <div style={{fontSize:12,color:"#94A3B8"}}>{v.time}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                    <IC n="heart" s={13} c="#EF4444"/><span style={{fontSize:12,color:"#64748B"}}>{v.likes}</span>
                  </div>
                </div>

                {/* Datos destacados de la vacante */}
                <div style={{background:"linear-gradient(135deg,#F0F9FF,#E0F2FE)",border:"1px solid #BAE6FD",borderRadius:12,padding:"14px 16px",marginBottom:12}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:16,color:"#0F1F3D",marginBottom:10}}>{vi.position||"Vacante"}</div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
                    {vi.salary&&<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>💰</span><div><div style={{fontSize:10,color:"#64748B"}}>Sueldo</div><div style={{fontWeight:700,fontSize:13,color:"#0F1F3D"}}>{vi.salary}</div></div></div>}
                    {vi.location&&<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>📍</span><div><div style={{fontSize:10,color:"#64748B"}}>Ubicación</div><div style={{fontWeight:700,fontSize:13,color:"#0F1F3D"}}>{vi.location}</div></div></div>}
                    {vi.schedule&&<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>⏰</span><div><div style={{fontSize:10,color:"#64748B"}}>Horario</div><div style={{fontWeight:700,fontSize:13,color:"#0F1F3D"}}>{vi.schedule}</div></div></div>}
                  </div>
                </div>

                {v.content&&<p style={{fontSize:13,color:"#374151",lineHeight:1.7,marginBottom:14,whiteSpace:"pre-line"}}>{v.content.length>200?v.content.substring(0,200)+"...":v.content}</p>}

                <div style={{display:"flex",gap:10}}>
                  <button className="btn-primary" style={{display:"flex",alignItems:"center",gap:6}} onClick={()=>autor&&onOpenChat&&onOpenChat(autor,v)}>
                    <IC n="chat" s={14}/>Contactar
                  </button>
                  {autor&&<button className="btn-outline btn-sm" onClick={()=>autor&&onOpenProfile&&onOpenProfile(autor)}>Ver empresa</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SearchPage = ({currentUser, onOpenProfile, onOpenChat, posts}) => {
  const [q,setQ] = useState("");
  const [filterCat,setFilterCat] = useState("all");
  const [followState,setFollowState] = useState({});
  const providers = USERS.filter(u=>u.type==="proveedor"||u.type==="restaurante");

  // Trabajadores ven búsqueda de vacantes
  if(currentUser.type === "trabajador") {
    return <VacantesSearch currentUser={currentUser} posts={posts||[]} onOpenChat={onOpenChat} onOpenProfile={onOpenProfile}/>;
  }

  const handleFollow = (uid,e) => {
    e.stopPropagation();
    toggleFollow(currentUser.id,uid);
    setFollowState(s=>({...s,[uid]:!isFollowing(currentUser.id,uid)||!(s[uid]===false)}));
  };
  const isF = uid => followState[uid]!==undefined ? followState[uid] : isFollowing(currentUser.id,uid);

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
              <div style={{flex:1,minWidth:0}}>
                <div className="user-link" style={{fontWeight:700,fontSize:14,color:"#0F1F3D",marginBottom:3}} onClick={e=>{e.stopPropagation();onOpenProfile(p);}}>{p.name}</div>
                <span className={`tag tag-${p.type}`}>{TL[p.type]}</span>
                {p.category&&<span className="tag" style={{background:"#F1F5F9",color:"#475569",marginLeft:4}}>{p.category}</span>}
                {p.informal&&<span className="tag" style={{background:"#FEF9C3",color:"#78350F",marginLeft:4}}>🏪 Informal</span>}
              </div>
              {currentUser.id!==p.id&&(
                <button onClick={e=>handleFollow(p.id,e)} className={isF(p.id)?"btn-unfollow":"btn-follow"} style={{fontSize:11,padding:"4px 12px",alignSelf:"flex-start",flexShrink:0}}>
                  {isF(p.id)?"✓ Siguiendo":"+ Seguir"}
                </button>
              )}
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

/* ======================================================
   FEED
====================================================== */
const FeedPage = ({currentUser,posts,setPosts,onOpenChat,onOpenProfile}) => {
  const [showCreate,setShowCreate] = useState(false);
  const [np,setNp] = useState({type:"general",content:"",audience:["proveedor","restaurante","trabajador"],vPos:"",vSal:"",vSch:"",vLoc:"",vRest:"",vJornada:"",vBonos:"",bPuesto:"",bZona:"",bDisp:"",photo:null});
  const [commentInputs,setCommentInputs] = useState({});
  const fileRef = useRef();

  const canPost = currentUser.type==="restaurante"||currentUser.type==="proveedor"||currentUser.type==="trabajador";

  const visiblePosts = posts.filter(p=>{
    if(currentUser.type==="restaurante"||currentUser.type==="proveedor") return true;
    return p.audience.includes(currentUser.type);
  });

  const handleLike = id => setPosts(prev=>prev.map(p=>{
    if(p.id!==id)return p;
    const liked=p.likedBy.includes(currentUser.id);
    if(!liked){if(!window.__likedPosts)window.__likedPosts=[];if(!window.__likedPosts.find(x=>x===p.content?.substring(0,60)))window.__likedPosts.push(p.content?.substring(0,60));}
    else{if(window.__likedPosts)window.__likedPosts=window.__likedPosts.filter(x=>x!==p.content?.substring(0,60));}
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
      ...(np.type==="vacante"?{vacancyInfo:{position:np.vPos,salary:np.vSal,schedule:np.vSch,location:np.vLoc,rest:np.vRest,jornada:np.vJornada,bonos:np.vBonos}}:{}),
      ...(np.type==="buscar_trabajo"?{jobSeekInfo:{puesto:np.bPuesto,zona:np.bZona,disponibilidad:np.bDisp}}:{})};
    setPosts(prev=>[p,...prev]);
    setNp({type:"general",content:"",audience:["proveedor","restaurante","trabajador"],vPos:"",vSal:"",vSch:"",vLoc:"",vRest:"",vJornada:"",vBonos:"",bPuesto:"",bZona:"",bDisp:"",photo:null});
    setShowCreate(false);
  };

  return (
    <div style={{maxWidth:700}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:700,color:"#0F1F3D",marginBottom:4}}>{"Feed de la Comunidad"}</h2>
          <p style={{color:"#64748B",fontSize:14}}>Mantente al tanto del sector</p>
        </div>
        {canPost&&<button className="btn-primary" onClick={()=>setShowCreate(true)}><IC n="plus" s={15}/>Nueva Publicación</button>}
      </div>

      <Modal open={showCreate} onClose={()=>setShowCreate(false)} title="Nueva Publicación" wide>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {(currentUser.type==="trabajador"
            ? ["general","buscar_trabajo"]
            : ["general","vacante"]
          ).map(t=>(
            <button key={t} onClick={()=>setNp(p=>({...p,type:t,audience:t==="buscar_trabajo"?["restaurante","proveedor"]:t==="vacante"?["trabajador"]:["proveedor","restaurante","trabajador"]}))} style={{flex:1,padding:9,border:`2px solid ${np.type===t?"#2563EB":"#E2E8F0"}`,borderRadius:10,background:np.type===t?"#EFF6FF":"#fff",color:np.type===t?"#1D4ED8":"#64748B",fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>
              {t==="general"?"📢 General":t==="vacante"?"💼 Vacante":"🔍 Buscar Trabajo"}
            </button>
          ))}
        </div>
        <textarea className="input textarea" placeholder="¿Qué quieres compartir?" value={np.content} onChange={e=>setNp(p=>({...p,content:e.target.value}))} style={{marginBottom:14}}/>
        {/* Photo upload */}
        <div style={{border:"2px dashed #DBEAFE",borderRadius:10,padding:14,textAlign:"center",marginBottom:14,background:"#F8FAFF",position:"relative"}}>
          {np.photo?(
            <>
              <img src={np.photo} style={{maxHeight:120,borderRadius:8,objectFit:"cover"}} alt="preview"/>
              <button onClick={()=>setNp(p=>({...p,photo:null}))} style={{position:"absolute",top:8,right:8,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <IC n="x" s={13} c="#fff"/>
              </button>
            </>
          ):(
            <div style={{cursor:"pointer"}} onClick={()=>fileRef.current?.click()}>
              <IC n="image" s={22} c="#93C5FD"/><p style={{color:"#64748B",fontSize:13,marginTop:6}}>Agregar foto (opcional)</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        </div>
        {np.type==="vacante"&&(
          <div style={{background:"#F8FAFF",border:"1px solid #DBEAFE",borderRadius:12,padding:14,marginBottom:14}}>
            <h4 style={{fontWeight:600,fontSize:13,marginBottom:10,color:"#1E3A6E"}}>💼 Datos de la vacante</h4>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <input className="input" placeholder="Puesto o título del trabajo *" value={np.vPos} onChange={e=>setNp(p=>({...p,vPos:e.target.value}))} style={{gridColumn:"1/-1"}}/>
              <input className="input" placeholder="Sueldo (ej: $14,000 – $18,000 MXN)" value={np.vSal} onChange={e=>setNp(p=>({...p,vSal:e.target.value}))}/>
              <input className="input" placeholder="Ubicación del empleo" value={np.vLoc} onChange={e=>setNp(p=>({...p,vLoc:e.target.value}))}/>
              <input className="input" placeholder="Horario (ej: Lun–Vie 9am–6pm)" value={np.vSch} onChange={e=>setNp(p=>({...p,vSch:e.target.value}))}/>
              <input className="input" placeholder="Días de descanso (ej: Domingo)" value={np.vRest||""} onChange={e=>setNp(p=>({...p,vRest:e.target.value}))}/>
              <select className="input" value={np.vJornada||""} onChange={e=>setNp(p=>({...p,vJornada:e.target.value}))}>
                <option value="">Tipo de jornada...</option>
                {["Tiempo completo","Medio tiempo","Por días","Por horas","Eventual","Fines de semana"].map(j=><option key={j}>{j}</option>)}
              </select>
              <input className="input" placeholder="Bonos y prestaciones adicionales" value={np.vBonos||""} onChange={e=>setNp(p=>({...p,vBonos:e.target.value}))} style={{gridColumn:"1/-1"}}/>
            </div>
          </div>
        )}
        {np.type==="buscar_trabajo"&&(
          <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,padding:14,marginBottom:14}}>
            <h4 style={{fontWeight:600,fontSize:13,marginBottom:10,color:"#92400E"}}>🔍 Datos de búsqueda</h4>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <input className="input" placeholder="Puesto que buscas" value={np.bPuesto} onChange={e=>setNp(p=>({...p,bPuesto:e.target.value}))}/>
              <input className="input" placeholder="Zona / Ciudad" value={np.bZona} onChange={e=>setNp(p=>({...p,bZona:e.target.value}))}/>
              <input className="input" placeholder="Disponibilidad (ej: inmediata)" value={np.bDisp} onChange={e=>setNp(p=>({...p,bDisp:e.target.value}))} style={{gridColumn:"1/-1"}}/>
            </div>
          </div>
        )}
        <div style={{marginBottom:16}}>
          <label style={{fontWeight:600,fontSize:13,color:"#374151",display:"block",marginBottom:8}}>🔒 Visibilidad de la publicación</label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {[
              {id:"todos", label:"🌐 Todos", desc:"Cualquier usuario de la plataforma", audience:["proveedor","restaurante","trabajador"]},
              {id:"conexiones", label:"🤝 Solo conexiones", desc:"Únicamente usuarios que sigues o te siguen", audience:["conexiones"]},
              {id:"mitipo", label:"👥 Solo mi tipo de cuenta", desc:`Solo usuarios tipo ${TL[currentUser.type]}`, audience:[currentUser.type]},
            ].map(opt=>{
              const sel = JSON.stringify(np.audience)===JSON.stringify(opt.audience) || (opt.id==="todos" && np.audience.length===3 && np.audience.includes("proveedor"));
              return(
                <button key={opt.id} onClick={()=>setNp(p=>({...p,audience:opt.audience}))} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",border:`2px solid ${sel?"#2563EB":"#E2E8F0"}`,borderRadius:10,background:sel?"#EFF6FF":"#fff",cursor:"pointer",textAlign:"left",transition:"all 0.15s",width:"100%"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${sel?"#2563EB":"#CBD5E1"}`,background:sel?"#1D4ED8":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {sel&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                  </div>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontFamily:"Sora,sans-serif",fontWeight:600,fontSize:13,color:sel?"#1D4ED8":"#374151"}}>{opt.label}</div>
                    <div style={{fontSize:11,color:"#94A3B8",marginTop:1}}>{opt.desc}</div>
                  </div>
                </button>
              );
            })}
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
              onOpenProfile={onOpenProfile}
            />
          );
        })}
      </div>
    </div>
  );
};

const PostCard = ({post,currentUser,liked,onLike,onComment,commentInput,setCommentInput,onOpenChat,onOpenProfile}) => {
  const [showComments,setShowComments] = useState(false);
  const [following,setFollowing] = useState(isFollowing(currentUser.id,post.authorId));
  const [showMenu,setShowMenu] = useState(false);
  const [menuMsg,setMenuMsg] = useState("");
  const [reportOpen,setReportOpen] = useState(false);
  const [reportType,setReportType] = useState("post");
  const author = USERS.find(u=>u.id===post.authorId);
  const canChat = author && currentUser.id!==post.authorId;
  const isOwn = currentUser.id===post.authorId;

  const handleFollow = e => {
    e.stopPropagation();
    toggleFollow(currentUser.id, post.authorId);
    setFollowing(f=>!f);
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    if(action==="save"){
      if(!window.__savedPosts)window.__savedPosts=[];
      const already=window.__savedPosts.find(p=>p.id===post.id);
      if(!already){window.__savedPosts.push(post);setMenuMsg("✓ Publicación guardada");}
      else setMenuMsg("Ya está en tus guardados");
      setTimeout(()=>setMenuMsg(""),2500);
    } else if(action==="share"){
      navigator.clipboard?.writeText(`${window.location.href}?post=${post.id}`).then(()=>{setMenuMsg("✓ Enlace copiado");setTimeout(()=>setMenuMsg(""),2500);});
    } else if(action==="report_post"){
      setReportType("post"); setReportOpen(true);
    } else if(action==="report_account"){
      setReportType("account"); setReportOpen(true);
    }
  };

  const handlePrivateChat = () => {
    if(author) onOpenChat(author, post);
  };

  return (
    <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:16,padding:22,boxShadow:"0 2px 8px rgba(30,64,175,0.05)",position:"relative"}}>
      <ReportModal open={reportOpen} onClose={()=>setReportOpen(false)} type={reportType}/>
      {menuMsg&&<div style={{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",background:"#0F1F3D",color:"#fff",borderRadius:99,padding:"6px 16px",fontSize:12,fontWeight:600,zIndex:10,whiteSpace:"nowrap",boxShadow:"0 4px 16px rgba(0,0,0,0.2)"}}>{menuMsg}</div>}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{cursor:"pointer"}} onClick={()=>author&&onOpenProfile&&onOpenProfile(author)}>
          <Av initials={post.authorAvatar} size={42} color={TC[post.authorType]}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <span className="user-link" onClick={()=>author&&onOpenProfile&&onOpenProfile(author)} style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{post.authorName}</span>
            <span className={`tag tag-${post.authorType}`}>{TL[post.authorType]}</span>
            {post.type==="vacante"&&<span className="tag tag-vacante">💼 Vacante</span>}
            {post.type==="buscar_trabajo"&&<span className="tag" style={{background:"#FEF3C7",color:"#92400E"}}>🔍 Busca Trabajo</span>}
            {(()=>{const a=USERS.find(u=>u.id===post.authorId);return a?.informal?<span className="tag" style={{background:"#FEF9C3",color:"#78350F"}}>🏪 Negocio Informal</span>:null;})()}
          </div>
          <div style={{fontSize:12,color:"#94A3B8",marginTop:2}}>{post.time}</div>
        </div>
        {!isOwn&&(
          <button onClick={handleFollow} className={following?"btn-unfollow":"btn-follow"} style={{flexShrink:0,fontSize:12,padding:"5px 14px"}}>
            {following?"✓ Siguiendo":"+ Seguir"}
          </button>
        )}
        {/* 3 puntos verticales */}
        <div style={{position:"relative"}}>
          <button onClick={e=>{e.stopPropagation();setShowMenu(v=>!v);}} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",padding:"4px 6px",borderRadius:8,display:"flex",alignItems:"center"}}
            onMouseEnter={e=>e.currentTarget.style.background="#F1F5F9"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
            <IC n="dots" s={18}/>
          </button>
          {showMenu&&(
            <>
              <div style={{position:"fixed",inset:0,zIndex:49}} onClick={()=>setShowMenu(false)}/>
              <div style={{position:"absolute",right:0,top:32,background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,boxShadow:"0 8px 32px rgba(30,64,175,0.13)",minWidth:210,padding:6,zIndex:50}}>
                {[
                  {icon:"flag",label:"Reportar publicación",action:"report_post",color:"#DC2626"},
                  {icon:"flag",label:"Reportar cuenta",action:"report_account",color:"#DC2626"},
                  {icon:"bookmark",label:"Guardar publicación",action:"save",color:"#1D4ED8"},
                  {icon:"share",label:"Compartir",action:"share",color:"#059669"},
                ].map(item=>(
                  <button key={item.action} onClick={()=>handleMenuAction(item.action)} style={{width:"100%",padding:"9px 14px",background:"none",border:"none",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,borderRadius:10,fontSize:13,color:item.color||"#374151",fontFamily:"IBM Plex Sans,sans-serif"}}>
                    <IC n={item.icon} s={15} c={item.color||"#374151"}/>{item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {post.type==="vacante"&&post.vacancyInfo&&(
        <div style={{background:"linear-gradient(135deg,#F0F9FF,#E0F2FE)",border:"1px solid #BAE6FD",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
          {post.vacancyInfo.position&&<div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:15,color:"#0F1F3D",marginBottom:8}}>{post.vacancyInfo.position}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["💰","Sueldo",post.vacancyInfo.salary],["📍","Ubicación",post.vacancyInfo.location],["⏰","Horario",post.vacancyInfo.schedule],["📅","Descanso",post.vacancyInfo.rest],["🏷️","Jornada",post.vacancyInfo.jornada],["🎁","Beneficios",post.vacancyInfo.bonos]].map(([em,label,val])=>val&&(
              <div key={label}><span style={{fontSize:10,color:"#64748B"}}>{em} {label}</span><div style={{fontWeight:600,fontSize:12,color:"#0F1F3D"}}>{val}</div></div>
            ))}
          </div>
        </div>
      )}
      {post.type==="buscar_trabajo"&&post.jobSeekInfo&&(
        <div style={{background:"linear-gradient(135deg,#FFFBEB,#FEF3C7)",border:"1px solid #FDE68A",borderRadius:12,padding:"12px 16px",marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {[["🔍","Puesto",post.jobSeekInfo.puesto],["📍","Zona",post.jobSeekInfo.zona],["📅","Disponibilidad",post.jobSeekInfo.disponibilidad]].map(([em,label,val])=>val&&(
            <div key={label}><span style={{fontSize:11,color:"#92400E"}}>{em} {label}</span><div style={{fontWeight:600,fontSize:12,color:"#0F1F3D"}}>{val}</div></div>
          ))}
        </div>
      )}
      <p style={{fontSize:14,color:"#374151",lineHeight:1.7,whiteSpace:"pre-line",marginBottom:12}}>{post.content}</p>
      {post.photos&&post.photos.length>0&&(
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {post.photos.map((ph,i)=>(
            <div key={i} style={{position:"relative",display:"inline-block"}}>
              <img src={ph} style={{maxHeight:200,maxWidth:"100%",borderRadius:10,objectFit:"cover"}} alt=""/>
            </div>
          ))}
        </div>
      )}
      {/* Barra de acciones: Reacción | Comentario | Chat privado */}
      <div style={{display:"flex",alignItems:"stretch",borderTop:"1px solid #F1F5F9"}}>
        <button onClick={onLike} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",borderRight:"1px solid #F1F5F9",cursor:"pointer",color:liked?"#EF4444":"#64748B",fontWeight:500,fontSize:13,padding:"11px 0",transition:"background 0.15s",borderRadius:"0 0 0 12px"}}
          onMouseEnter={e=>e.currentTarget.style.background="#FFF1F2"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <IC n="heart" s={15} c={liked?"#EF4444":"#9CA3AF"}/><span style={{fontSize:13}}>{post.likes}</span>
        </button>
        <button onClick={()=>setShowComments(!showComments)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",borderRight:canChat?"1px solid #F1F5F9":"none",cursor:"pointer",color:showComments?"#2563EB":"#64748B",fontSize:13,padding:"11px 0",transition:"background 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#F0F6FF"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <IC n="comment" s={15} c={showComments?"#2563EB":"#9CA3AF"}/><span style={{fontSize:13}}>{post.comments.length} comentarios</span>
        </button>
        {canChat&&(
          <button onClick={handlePrivateChat} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"none",border:"none",cursor:"pointer",color:"#64748B",fontSize:13,padding:"11px 0",transition:"background 0.15s",borderRadius:"0 0 12px 0"}}
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

/* ======================================================
   CATALOG
====================================================== */
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
        <div style={{border:"2px dashed #DBEAFE",borderRadius:12,padding:18,textAlign:"center",marginBottom:14,cursor:"pointer",background:"#F8FAFF",position:"relative"}} onClick={()=>!f.photo&&fileRef.current?.click()}>
          {f.photo?(
            <>
              <img src={f.photo} style={{maxHeight:100,borderRadius:8}} alt=""/>
              <button onClick={e=>{e.stopPropagation();setF(x=>({...x,photo:null}));}} style={{position:"absolute",top:8,right:8,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
                <IC n="x" s={13} c="#fff"/>
              </button>
            </>
          ):(
            <div onClick={()=>fileRef.current?.click()}>
              <IC n="image" s={26} c="#93C5FD"/>
              <p style={{color:"#64748B",fontSize:13,marginTop:8}}>Subir imagen del producto</p>
            </div>
          )}
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

/* ======================================================
   CHAT  (punto 6 -- botón "+" con opciones)
====================================================== */
const ChatPage = ({currentUser,initialContact,isSubView,initialPost}) => {
  const cu = currentUser;
  const contacts = USERS.filter(u=>u.id!==cu.id&&u.type!=="admin"&&(u.type!==cu.type||(isSubView&&u.type!==cu.type)));
  const [active,setActive] = useState(initialContact||contacts[0]);
  const [chats,setChats] = useState({...CHATS});
  const [input,setInput] = useState("");
  const [showMenu,setShowMenu] = useState(false);
  const [showAptForm,setShowAptForm] = useState(false);
  const [aptF,setAptF] = useState({title:"",date:"",time:"",note:""});
  const [postRef,setPostRef] = useState(initialPost||null);
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
    const msg = {from:cu.id,text:input,time:t()};
    if(postRef){msg.postRef=postRef;setPostRef(null);}
    sendMsg(msg);
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
                  <div style={{maxWidth:"70%"}}>
                    {m.postRef&&(
                      <div style={{background:"#F0F9FF",border:"1px solid #BAE6FD",borderRadius:"10px 10px 0 0",padding:"8px 12px",marginBottom:2}}>
                        <div style={{fontSize:10,fontWeight:700,color:"#0284C7",marginBottom:2}}>📎 Publicación de {m.postRef.authorName}</div>
                        <div style={{fontSize:11,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:280}}>{m.postRef.content?.substring(0,60)}{(m.postRef.content?.length||0)>60?"...":""}</div>
                      </div>
                    )}
                    <div className={isMe?"chat-bubble-me":"chat-bubble-other"} style={m.postRef?{borderRadius:m.postRef?"0 0 16px 16px":undefined}:{}}>{m.text}</div>
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

          {/* Post reference preview -- aparece antes de enviar */}
          {postRef&&(
            <div style={{padding:"10px 14px",background:"#F0F9FF",borderTop:"1px solid #BAE6FD",display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:11,fontWeight:700,color:"#0284C7",marginBottom:2}}>📎 Publicación de referencia</div>
                <div style={{fontSize:12,color:"#374151",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:340}}>{postRef.content?.substring(0,80)}{(postRef.content?.length||0)>80?"...":""}</div>
                <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>por {postRef.authorName}</div>
              </div>
              <button onClick={()=>setPostRef(null)} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",flexShrink:0}}><IC n="x" s={16}/></button>
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

/* ======================================================
   CALENDAR
====================================================== */
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

/* ======================================================
   RATINGS
====================================================== */
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

/* ======================================================
   PROFILE  (punto 3 -- edición con datos de facturación / CV)
====================================================== */
const CVModal = ({user,onClose}) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal modal-wide" onClick={e=>e.stopPropagation()} style={{maxWidth:640,background:"#fff"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{fontWeight:700,fontSize:18,color:"#0F1F3D"}}>Currículum Vitae</h3>
        <div style={{display:"flex",gap:8}}>
          <button className="btn-outline btn-sm" onClick={()=>window.print()}>⬇ Descargar PDF</button>
          <button style={{background:"none",border:"none",cursor:"pointer",color:"#64748B"}} onClick={onClose}><IC n="x" s={20}/></button>
        </div>
      </div>
      {/* CV Document */}
      <div style={{border:"1px solid #E2ECF8",borderRadius:12,overflow:"hidden"}}>
        {/* Header */}
        <div style={{background:"linear-gradient(135deg,#0F1F3D,#1D4ED8)",padding:"28px 32px",color:"#fff"}}>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:26,border:"3px solid rgba(255,255,255,0.3)",flexShrink:0}}>
              {user.profilePhoto?<img src={user.profilePhoto} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} alt="foto"/>:user.avatar}
            </div>
            <div>
              <h2 style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,marginBottom:4}}>{user.name}</h2>
              {user.skills?.length>0&&<p style={{color:"#93C5FD",fontSize:13}}>{user.skills[0]}</p>}
              <div style={{display:"flex",gap:14,marginTop:8,flexWrap:"wrap"}}>
                {user.location&&<span style={{fontSize:12,color:"rgba(255,255,255,0.7)",display:"flex",alignItems:"center",gap:4}}><IC n="map" s={11} c="rgba(255,255,255,0.7)"/>{user.location}</span>}
                {user.zone&&<span style={{fontSize:12,color:"rgba(255,255,255,0.7)"}}>{user.zone}</span>}
              </div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{padding:"24px 32px",display:"flex",flexDirection:"column",gap:20}}>
          {user.description&&(
            <div>
              <h4 style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:"#1D4ED8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10,paddingBottom:6,borderBottom:"2px solid #DBEAFE"}}>Objetivo Profesional</h4>
              <p style={{fontSize:13,color:"#374151",lineHeight:1.7}}>{user.description}</p>
            </div>
          )}
          {user.workHistory?.length>0&&(
            <div>
              <h4 style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:"#1D4ED8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10,paddingBottom:6,borderBottom:"2px solid #DBEAFE"}}>Experiencia Laboral</h4>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {user.workHistory.map((j,i)=>(
                  <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <div style={{width:10,height:10,borderRadius:"50%",background:"#2563EB",marginTop:4,flexShrink:0}}/>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{j.position}</div>
                      <div style={{fontSize:12,color:"#64748B"}}>{j.place} · {j.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {user.skills?.length>0&&(
            <div>
              <h4 style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:"#1D4ED8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10,paddingBottom:6,borderBottom:"2px solid #DBEAFE"}}>Habilidades</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {user.skills.map(s=>(
                  <span key={s} style={{background:"#EFF6FF",border:"1px solid #BFDBFE",borderRadius:99,padding:"4px 12px",fontSize:12,fontWeight:600,color:"#1D4ED8"}}>{s}</span>
                ))}
              </div>
            </div>
          )}
          {user.rating>0&&(
            <div>
              <h4 style={{fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:13,color:"#1D4ED8",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10,paddingBottom:6,borderBottom:"2px solid #DBEAFE"}}>Calificación en RestLink</h4>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Stars rating={user.rating} size={14}/>
                <span style={{fontWeight:700,fontSize:16}}>{user.rating}</span>
                <span style={{fontSize:12,color:"#94A3B8"}}>({user.reviewCount} reseñas)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage = ({user,isOwn,onUpdate,currentUser,onOpenProfile,onOpenChat}) => {
  const [editInfo,setEditInfo] = useState(false);
  const [editWork,setEditWork] = useState(false);
  const [showCV,setShowCV] = useState(false);
  const [info,setInfo] = useState({description:user.description||"",location:user.location||"",age:user.age||"",zone:user.zone||""});
  const [billing,setBilling] = useState(user.billing||{razonSocial:"",rfc:"",regimen:"",cfdi:"",banco:"",cuenta:"",clabe:"",cp:""});
  const [skills,setSkills] = useState(user.skills||[]);
  const [skillInput,setSkillInput] = useState("");
  const [history,setHistory] = useState(user.workHistory||[]);
  const [newJob,setNewJob] = useState({place:"",position:"",duration:""});
  const [followed,setFollowed] = useState(currentUser?isFollowing(currentUser.id,user.id):false);
  const [showFollowers,setShowFollowers] = useState(false);
  const [showFollowing,setShowFollowing] = useState(false);
  // Foto de perfil y portada
  const [profilePhoto,setProfilePhoto] = useState(user.profilePhoto||null);
  const [coverPhoto,setCoverPhoto] = useState(user.coverPhoto||null);
  const [coverOffset,setCoverOffset] = useState(user.coverOffset||50);
  const [profileOffset,setProfileOffset] = useState(user.profileOffset||50);
  const [draggingCover,setDraggingCover] = useState(false);
  const [draggingProfile,setDraggingProfile] = useState(false);
  const [dragStart,setDragStart] = useState(null);
  const profileFileRef = useRef();
  const coverFileRef = useRef();
  // Productos de interés (no trabajador)
  const [interestProducts,setInterestProducts] = useState(user.interestProducts||[]);
  const [productSearch,setProductSearch] = useState("");
  const [editInterests,setEditInterests] = useState(false);
  const [customProduct,setCustomProduct] = useState("");
  const myProducts = PRODUCTS.filter(p=>p.providerId===user.id);

  const followers = getFollowers(user.id);
  const following = getFollowing(user.id);

  const handleFollow = () => {
    if(!currentUser)return;
    toggleFollow(currentUser.id, user.id);
    setFollowed(f=>!f);
  };

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

  const handleProfilePhoto = e => {
    const file=e.target.files[0]; if(!file)return;
    const r=new FileReader(); r.onload=ev=>{
      setProfilePhoto(ev.target.result);
      const updated={...user,profilePhoto:ev.target.result};
      const i=USERS.findIndex(u=>u.id===user.id); if(i>=0)USERS[i]=updated;
      onUpdate&&onUpdate(updated);
    }; r.readAsDataURL(file);
  };
  const handleCoverPhoto = e => {
    const file=e.target.files[0]; if(!file)return;
    const r=new FileReader(); r.onload=ev=>{
      setCoverPhoto(ev.target.result);
      const updated={...user,coverPhoto:ev.target.result};
      const i=USERS.findIndex(u=>u.id===user.id); if(i>=0)USERS[i]=updated;
      onUpdate&&onUpdate(updated);
    }; r.readAsDataURL(file);
  };
  const handleCoverDrag = (e) => {
    if(!draggingCover||!dragStart)return;
    const dy = e.clientY - dragStart.y;
    setCoverOffset(prev=>Math.min(100,Math.max(0,prev+dy*0.3)));
    setDragStart({x:e.clientX,y:e.clientY});
  };
  const handleProfileDrag = (e) => {
    if(!draggingProfile||!dragStart)return;
    const dy = e.clientY - dragStart.y;
    setProfileOffset(prev=>Math.min(100,Math.max(0,prev+dy*0.5)));
    setDragStart({x:e.clientX,y:e.clientY});
  };

  const toggleInterest = (cat) => {
    setInterestProducts(prev=>{
      const next = prev.includes(cat)?prev.filter(x=>x!==cat):[...prev,cat];
      const updated={...user,interestProducts:next};
      const i=USERS.findIndex(u=>u.id===user.id); if(i>=0)USERS[i]=updated;
      onUpdate&&onUpdate(updated);
      return next;
    });
  };
  const addCustomProduct = () => {
    if(!customProduct.trim())return;
    toggleInterest(customProduct.trim());
    setCustomProduct("");
  };
  const filteredCats = SERVICE_CATS.filter(c=>c.toLowerCase().includes(productSearch.toLowerCase()));

  const FollowListModal = ({title,userIds,onClose}) => (
    <Modal open={true} onClose={onClose} title={title}>
      <div style={{display:"flex",flexDirection:"column",gap:10,maxHeight:340,overflowY:"auto"}}>
        {userIds.length===0&&<p style={{color:"#94A3B8",fontSize:14,textAlign:"center",padding:"20px 0"}}>Nadie aún.</p>}
        {userIds.map(uid=>{
          const u=USERS.find(x=>x.id===uid);
          if(!u)return null;
          return (
            <div key={uid} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid #F1F5F9"}}>
              <Av initials={u.avatar} size={38} color={TC[u.type]||"#1D4ED8"}/>
              <div style={{flex:1}}>
                <div className="user-link" onClick={()=>{onClose();onOpenProfile&&onOpenProfile(u);}} style={{fontWeight:700,fontSize:14}}>{u.name}</div>
                <span className={`tag tag-${u.type}`} style={{fontSize:10}}>{TL[u.type]}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );

  return (
    <div style={{maxWidth:720}}>
      {/* Modals */}
      {showCV&&<CVModal user={user} onClose={()=>setShowCV(false)}/>}
      {showFollowers&&<FollowListModal title={`Seguidores (${followers.length})`} userIds={followers} onClose={()=>setShowFollowers(false)}/>}
      {showFollowing&&<FollowListModal title={`Siguiendo (${following.length})`} userIds={following} onClose={()=>setShowFollowing(false)}/>}

      {/* Header */}
      <div style={{borderRadius:18,marginBottom:18,overflow:"hidden",border:"1px solid #E2ECF8",boxShadow:"0 4px 20px rgba(30,64,175,0.08)"}}>
        {/* Portada */}
        <div
          style={{height:160,background:coverPhoto?"none":"linear-gradient(135deg,#0F1F3D,#1D4ED8)",position:"relative",overflow:"hidden",cursor:isOwn&&coverPhoto?"grab":"default"}}
          onMouseMove={handleCoverDrag}
          onMouseUp={()=>{setDraggingCover(false);setDragStart(null);}}
          onMouseLeave={()=>{setDraggingCover(false);setDragStart(null);}}
        >
          {coverPhoto&&<img src={coverPhoto} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:`50% ${coverOffset}%`,pointerEvents:"none",userSelect:"none"}} alt="portada"/>}
          {!coverPhoto&&<div style={{position:"absolute",top:-20,right:-20,width:180,height:180,background:"rgba(255,255,255,0.04)",borderRadius:"50%"}}/>}
          {isOwn&&(
            <div style={{position:"absolute",top:10,right:10,display:"flex",gap:6}}>
              {coverPhoto&&<button onMouseDown={e=>{setDraggingCover(true);setDragStart({x:e.clientX,y:e.clientY});}} style={{background:"rgba(0,0,0,0.45)",color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"grab",display:"flex",alignItems:"center",gap:4}}>⠿ Centrar</button>}
              <button onClick={()=>coverFileRef.current?.click()} style={{background:"rgba(0,0,0,0.45)",color:"#fff",border:"none",borderRadius:8,padding:"5px 10px",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><IC n="image" s={12} c="#fff"/>{coverPhoto?"Cambiar":"+ Portada"}</button>
              <input ref={coverFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleCoverPhoto}/>
            </div>
          )}
        </div>
        {/* Info bajo portada */}
        <div style={{background:"#fff",padding:"0 24px 20px",position:"relative"}}>
          {/* Avatar */}
          <div style={{position:"relative",width:80,height:80,marginTop:-40,marginBottom:10,display:"inline-block"}}>
            <div
              style={{width:80,height:80,borderRadius:"50%",border:"3px solid #fff",overflow:"hidden",background:`linear-gradient(135deg,${TC[user.type]},${TC[user.type]}AA)`,display:"flex",alignItems:"center",justifyContent:"center",cursor:isOwn&&profilePhoto?"grab":"default",boxShadow:"0 4px 16px rgba(30,64,175,0.18)"}}
              onMouseMove={handleProfileDrag}
              onMouseUp={()=>{setDraggingProfile(false);setDragStart(null);}}
              onMouseLeave={()=>{setDraggingProfile(false);setDragStart(null);}}
            >
              {profilePhoto
                ?<img src={profilePhoto} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:`50% ${profileOffset}%`,pointerEvents:"none",userSelect:"none"}} alt="perfil"/>
                :<span style={{color:"#fff",fontFamily:"Sora,sans-serif",fontWeight:700,fontSize:28,letterSpacing:0.5}}>{user.avatar}</span>
              }
            </div>
            {isOwn&&(
              <>
                <button
                  onClick={()=>profileFileRef.current?.click()}
                  style={{position:"absolute",bottom:0,right:0,width:26,height:26,borderRadius:"50%",background:"#1D4ED8",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}
                  title="Cambiar foto de perfil"
                ><IC n="image" s={11} c="#fff"/></button>
                {profilePhoto&&<button onMouseDown={e=>{setDraggingProfile(true);setDragStart({x:e.clientX,y:e.clientY});}} style={{position:"absolute",top:0,right:0,width:22,height:22,borderRadius:"50%",background:"rgba(0,0,0,0.4)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"grab"}} title="Centrar foto">⠿</button>}
                <input ref={profileFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleProfilePhoto}/>
              </>
            )}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
            <div>
              <span className={`tag tag-${user.type}`} style={{marginBottom:6,display:"inline-block"}}>{TL[user.type]}</span>
              {user.informal&&<span className="tag" style={{background:"#FEF9C3",color:"#78350F",marginLeft:6,marginBottom:6,display:"inline-block"}}>🏪 Negocio Informal</span>}
              <h2 style={{color:"#0F1F3D",fontWeight:800,fontSize:20,lineHeight:1.1}}>{user.name}</h2>
              {user.location&&<div style={{display:"flex",alignItems:"center",gap:4,marginTop:5,color:"#64748B",fontSize:13}}><IC n="map" s={13} c="#64748B"/> {user.location}</div>}
              {user.type==="trabajador"&&user.zone&&<div style={{fontSize:12,color:"#94A3B8",marginTop:3}}>📍 {user.zone}</div>}
              <div style={{display:"flex",gap:20,marginTop:12}}>
                <button onClick={()=>setShowFollowers(true)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:18,color:"#0F1F3D",lineHeight:1}}>{followers.length}</div>
                  <div style={{fontSize:11,color:"#64748B"}}>seguidores</div>
                </button>
                <button onClick={()=>setShowFollowing(true)} style={{background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:18,color:"#0F1F3D",lineHeight:1}}>{following.length}</div>
                  <div style={{fontSize:11,color:"#64748B"}}>siguiendo</div>
                </button>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
              {user.rating>0&&(
                <div style={{textAlign:"center",background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,padding:"10px 14px"}}>
                  <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:"#F59E0B"}}>{user.rating}</div>
                  <Stars rating={user.rating} size={11}/>
                  <div style={{fontSize:10,color:"#94A3B8",marginTop:2}}>{user.reviewCount} reseñas</div>
                </div>
              )}
              {!isOwn&&currentUser&&(
                <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-end"}}>
                  {user.type==="trabajador"&&(
                    <button className="btn-outline" onClick={()=>setShowCV(true)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px",fontSize:13}}>
                      📄 Mostrar CV
                    </button>
                  )}
                  <button onClick={handleFollow} className={followed?"btn-unfollow":"btn-follow"}>
                    {followed?"✓ Siguiendo":"+ Seguir"}
                  </button>
                  {onOpenChat&&<button className="btn-primary" onClick={()=>onOpenChat(user)} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 18px"}}>
                    <IC n="chat" s={14}/>Mandar Mensaje
                  </button>}
                </div>
              )}
              {isOwn&&user.type==="trabajador"&&(
                <button className="btn-outline btn-sm" onClick={()=>setShowCV(true)} style={{display:"flex",alignItems:"center",gap:6}}>
                  📄 Ver mi CV
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Productos de interés (solo para no-trabajadores) */}
      {user.type!=="trabajador"&&(isOwn||(interestProducts.length>0))&&(
        <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:20,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div>
              <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E"}}>🛒 Productos de interés</h3>
              {isOwn&&<p style={{fontSize:12,color:"#64748B",marginTop:3}}>Indica qué productos suele comprar tu negocio -- los proveedores podrán encontrarte más fácilmente y ofrecerte lo que necesitas.</p>}
            </div>
            {isOwn&&<button className="btn-outline btn-sm" style={{display:"flex",alignItems:"center",gap:4}} onClick={()=>setEditInterests(v=>!v)}><IC n="edit" s={12}/>{editInterests?"Listo":"Editar"}</button>}
          </div>
          {editInterests&&(
            <div style={{marginBottom:14}}>
              <div style={{position:"relative",marginBottom:10}}>
                <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#94A3B8"}}><IC n="search" s={14}/></div>
                <input className="input" placeholder="Buscar categoría..." style={{paddingLeft:32,fontSize:13}} value={productSearch} onChange={e=>setProductSearch(e.target.value)}/>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",maxHeight:160,overflowY:"auto",padding:2}}>
                {filteredCats.map(cat=>(
                  <button key={cat} onClick={()=>toggleInterest(cat)} style={{padding:"4px 12px",border:`2px solid ${interestProducts.includes(cat)?"#2563EB":"#E2E8F0"}`,borderRadius:99,background:interestProducts.includes(cat)?"#EFF6FF":"#fff",color:interestProducts.includes(cat)?"#1D4ED8":"#64748B",fontSize:12,fontFamily:"Sora,sans-serif",fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                    {interestProducts.includes(cat)&&<IC n="check" s={10}/>}{CAT_EMOJI[cat]||"📦"} {cat}
                  </button>
                ))}
                <button onClick={()=>toggleInterest("Otro")} style={{padding:"4px 12px",border:`2px solid ${interestProducts.includes("Otro")?"#2563EB":"#E2E8F0"}`,borderRadius:99,background:interestProducts.includes("Otro")?"#EFF6FF":"#fff",color:interestProducts.includes("Otro")?"#1D4ED8":"#64748B",fontSize:12,fontFamily:"Sora,sans-serif",fontWeight:600,cursor:"pointer"}}>
                  + Otro
                </button>
              </div>
              {interestProducts.includes("Otro")&&(
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  <input className="input" placeholder="Escribe un producto específico..." value={customProduct} onChange={e=>setCustomProduct(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCustomProduct()} style={{fontSize:13}}/>
                  <button className="btn-primary btn-sm" onClick={addCustomProduct}>+</button>
                </div>
              )}
            </div>
          )}
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {interestProducts.filter(p=>p!=="Otro").map((cat,i)=>(
              <span key={i} className="tag" style={{background:"#EFF6FF",color:"#1D4ED8",fontSize:12}}>
                {CAT_EMOJI[cat]||"📦"} {cat}
                {isOwn&&editInterests&&<button onClick={()=>toggleInterest(cat)} style={{background:"none",border:"none",cursor:"pointer",color:"#94A3B8",marginLeft:2,fontSize:10}}>✕</button>}
              </span>
            ))}
            {interestProducts.filter(p=>p!=="Otro").length===0&&!editInterests&&<p style={{fontSize:12,color:"#94A3B8"}}>{isOwn?"No has indicado productos de interés aún.":"Este negocio aún no ha indicado productos de interés."}</p>}
          </div>
        </div>
      )}

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

/* ======================================================
   VACANTES
====================================================== */
const VacantesPage = ({currentUser,posts,setPosts}) => {
  const [showCreate,setShowCreate] = useState(false);
  const [f,setF] = useState({position:"",salary:"",schedule:"",location:"",rest:"",jornada:"",bonos:"",content:""});
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
    const p={id:"post"+Date.now(),authorId:currentUser.id,authorName:currentUser.name,authorAvatar:currentUser.avatar,authorType:currentUser.type,type:"vacante",content:f.content,audience:["trabajador"],likes:0,likedBy:[],comments:[],time:"ahora",photos:[],vacancyInfo:{position:f.position,salary:f.salary,schedule:f.schedule,location:f.location,rest:f.rest,jornada:f.jornada,bonos:f.bonos}};
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
          <Field label="Puesto o título del trabajo *" full><input className="input" placeholder="Chef de Partida" value={f.position} onChange={e=>setF(x=>({...x,position:e.target.value}))}/></Field>
          <Field label="Sueldo / Remuneración"><input className="input" placeholder="$14,000 – $18,000 MXN" value={f.salary} onChange={e=>setF(x=>({...x,salary:e.target.value}))}/></Field>
          <Field label="Ubicación del empleo"><input className="input" placeholder="Polanco, CDMX" value={f.location} onChange={e=>setF(x=>({...x,location:e.target.value}))}/></Field>
          <Field label="Horario"><input className="input" placeholder="Lun–Vie 9am–6pm" value={f.schedule} onChange={e=>setF(x=>({...x,schedule:e.target.value}))}/></Field>
          <Field label="Días de descanso"><input className="input" placeholder="Ej: Domingo" value={f.rest} onChange={e=>setF(x=>({...x,rest:e.target.value}))}/></Field>
          <Field label="Tipo de jornada">
            <select className="input" value={f.jornada} onChange={e=>setF(x=>({...x,jornada:e.target.value}))}>
              <option value="">Selecciona...</option>
              {["Tiempo completo","Medio tiempo","Por días","Por horas","Eventual","Fines de semana"].map(j=><option key={j}>{j}</option>)}
            </select>
          </Field>
          <Field label="Bonos, prestaciones o beneficios" full><input className="input" placeholder="Ej: Seguro médico, vales de despensa, propinas" value={f.bonos} onChange={e=>setF(x=>({...x,bonos:e.target.value}))}/></Field>
          <Field label="Descripción del puesto y requisitos *" full><textarea className="input textarea" placeholder="Describe el puesto, responsabilidades y perfil del candidato..." value={f.content} onChange={e=>setF(x=>({...x,content:e.target.value}))}/></Field>
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
                    {[["💰",post.vacancyInfo.salary],["⏰",post.vacancyInfo.schedule],["📍",post.vacancyInfo.location],["📅",post.vacancyInfo.rest],["🏷️",post.vacancyInfo.jornada],["🎁",post.vacancyInfo.bonos]].map(([em,val])=>val&&<div key={em} style={{fontSize:12,color:"#374151"}}>{em} {val}</div>)}
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

/* ======================================================
   SUBCUENTAS  (punto 8)
====================================================== */
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

/* ======================================================
   ADMIN PANEL  (punto 9)
====================================================== */
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
                    <div><div style={{fontWeight:600,fontSize:13}}>{u.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>{u.location||"--"}</div></div>
                  </div>
                </td>
                <td style={{padding:"12px 16px"}}><span className={`tag tag-${u.type}`} style={{fontSize:10}}>{TL[u.type]}</span></td>
                <td style={{padding:"12px 16px",fontSize:13,color:"#374151"}}>{u.email}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:"#64748B",fontFamily:"monospace"}}>{u.rfc||u.curp||"--"}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:"#94A3B8"}}>--</td>
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

/* ======================================================
   APP LAUNCH -- pantalla de la app comprada
====================================================== */
const AppLaunchPage = ({app}) => {
  if(!app) return <div style={{padding:40,color:"#94A3B8",textAlign:"center"}}>Aplicación no encontrada.</div>;
  const isRented = window.__rentedApps?.includes(app.id);

  // Pantallas placeholder por app
  const screens = {
    app_lavanderia: <LavanderiaApp/>,
    app_lealtad: <LealtadApp/>,
    app_almacen: <AlmacenApp/>,
    app_pv_fifo: <PVFifoApp/>,
    app_pv_restaurante: <PVRestauranteApp/>,
    app_nomina: <NominaApp/>,
  };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,paddingBottom:16,borderBottom:"1px solid #E2ECF8"}}>
        <div style={{width:52,height:52,background:`linear-gradient(135deg,${app.bg},${app.color}33)`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:`1.5px solid ${app.border}`}}>{app.icon}</div>
        <div>
          <h2 style={{fontSize:20,fontWeight:700,color:"#0F1F3D",marginBottom:2}}>{app.name}</h2>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99,background:app.bg,color:app.color}}>{app.category}</span>
            <span style={{fontSize:11,color:"#94A3B8"}}>{isRented?"🔄 Renta mensual":"💳 Licencia permanente"}</span>
          </div>
        </div>
      </div>
      {screens[app.id]||<GenericAppScreen app={app}/>}
    </div>
  );
};

const GenericAppScreen = ({app}) => (
  <div style={{textAlign:"center",padding:"60px 20px",background:"#fff",borderRadius:16,border:"1px solid #E2ECF8"}}>
    <div style={{fontSize:56,marginBottom:16}}>{app.icon}</div>
    <h3 style={{fontWeight:700,fontSize:20,color:"#0F1F3D",marginBottom:8}}>{app.name}</h3>
    <p style={{color:"#64748B",fontSize:14,marginBottom:20}}>Módulo en desarrollo. Disponible próximamente.</p>
    <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
      {app.features.map((f,i)=><span key={i} style={{padding:"6px 14px",background:"#F8FAFF",border:"1px solid #E2ECF8",borderRadius:99,fontSize:12,color:"#374151"}}>{f}</span>)}
    </div>
  </div>
);

/* -- Sub-apps funcionales -- */
const LavanderiaApp = () => {
  const [orders,setOrders] = useState([
    {id:"L001",client:"María López",service:"Lavado y planchado",pieces:5,status:"entregado",date:"2026-04-05",total:250},
    {id:"L002",client:"Carlos Ruiz",service:"Tintorería",pieces:2,status:"listo",date:"2026-04-07",total:180},
    {id:"L003",client:"Ana Torres",service:"Lavado",pieces:8,status:"en proceso",date:"2026-04-08",total:120},
  ]);
  const [showNew,setShowNew] = useState(false);
  const [f,setF] = useState({client:"",service:"Lavado",pieces:"",total:""});
  const statusColor={entregado:"#059669",listo:"#1D4ED8","en proceso":"#D97706"};
  const statusBg={entregado:"#ECFDF5",listo:"#EFF6FF","en proceso":"#FFFBEB"};
  const add=()=>{if(!f.client||!f.pieces)return;setOrders(p=>[{id:"L"+Date.now(),client:f.client,service:f.service,pieces:parseInt(f.pieces),status:"en proceso",date:new Date().toISOString().slice(0,10),total:parseFloat(f.total)||0},...p]);setF({client:"",service:"Lavado",pieces:"",total:""});setShowNew(false);};
  return (
    <div>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nueva Orden">
        <div style={{display:"grid",gap:12}}>
          <Field label="Cliente" full><input className="input" placeholder="Nombre del cliente" value={f.client} onChange={e=>setF(x=>({...x,client:e.target.value}))}/></Field>
          <Field label="Servicio" full><select className="input" value={f.service} onChange={e=>setF(x=>({...x,service:e.target.value}))}>{["Lavado","Planchado","Lavado y planchado","Tintorería","Edredones"].map(s=><option key={s}>{s}</option>)}</select></Field>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Piezas"><input className="input" type="number" placeholder="0" value={f.pieces} onChange={e=>setF(x=>({...x,pieces:e.target.value}))}/></Field>
            <Field label="Total MXN"><input className="input" type="number" placeholder="0.00" value={f.total} onChange={e=>setF(x=>({...x,total:e.target.value}))}/></Field>
          </div>
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,marginTop:14,justifyContent:"center"}} onClick={add}>Registrar Orden</button>
      </Modal>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{display:"flex",gap:12}}>
          {[["en proceso",orders.filter(o=>o.status==="en proceso").length,"#D97706","#FFFBEB"],["listo",orders.filter(o=>o.status==="listo").length,"#1D4ED8","#EFF6FF"],["entregado",orders.filter(o=>o.status==="entregado").length,"#059669","#ECFDF5"]].map(([s,c,col,bg])=>(
            <div key={s} style={{background:bg,border:`1px solid ${col}30`,borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:20,color:col}}>{c}</div>
              <div style={{fontSize:11,color:"#64748B",textTransform:"capitalize"}}>{s}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={()=>setShowNew(true)}><IC n="plus" s={15}/>Nueva Orden</button>
      </div>
      <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F8FAFF"}}>{["# Orden","Cliente","Servicio","Piezas","Estado","Total","Acciones"].map(h=><th key={h} style={{padding:"11px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:"#64748B",fontFamily:"Sora,sans-serif",borderBottom:"1px solid #E2ECF8"}}>{h}</th>)}</tr></thead>
          <tbody>
            {orders.map((o,i)=>(
              <tr key={o.id} style={{borderBottom:"1px solid #F1F5F9",background:i%2===0?"#fff":"#FAFCFF"}}>
                <td style={{padding:"11px 14px",fontSize:12,fontFamily:"monospace",color:"#64748B"}}>{o.id}</td>
                <td style={{padding:"11px 14px",fontWeight:600,fontSize:13}}>{o.client}</td>
                <td style={{padding:"11px 14px",fontSize:12,color:"#374151"}}>{o.service}</td>
                <td style={{padding:"11px 14px",fontSize:13,textAlign:"center"}}>{o.pieces}</td>
                <td style={{padding:"11px 14px"}}>
                  <span style={{padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:700,background:statusBg[o.status],color:statusColor[o.status]}}>{o.status}</span>
                </td>
                <td style={{padding:"11px 14px",fontFamily:"Sora,sans-serif",fontWeight:700,color:"#059669",fontSize:13}}>${o.total}</td>
                <td style={{padding:"11px 14px"}}>
                  <select style={{fontSize:11,border:"1px solid #E2ECF8",borderRadius:6,padding:"3px 6px",cursor:"pointer"}} value={o.status} onChange={e=>setOrders(p=>p.map(x=>x.id===o.id?{...x,status:e.target.value}:x))}>
                    {["en proceso","listo","entregado"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LealtadApp = () => {
  const [clients,setClients] = useState([
    {id:"c1",name:"María López",phone:"322-100-0001",visits:12,points:1200,lastVisit:"2026-04-06"},
    {id:"c2",name:"Carlos Ruiz",phone:"322-100-0002",visits:5,points:500,lastVisit:"2026-04-03"},
    {id:"c3",name:"Ana Torres",phone:"322-100-0003",visits:28,points:2800,lastVisit:"2026-04-08"},
  ]);
  const [showNew,setShowNew] = useState(false);
  const [f,setF] = useState({name:"",phone:""});
  const add=()=>{if(!f.name)return;setClients(p=>[{id:"c"+Date.now(),name:f.name,phone:f.phone,visits:0,points:0,lastVisit:new Date().toISOString().slice(0,10)},...p]);setF({name:"",phone:""});setShowNew(false);};
  const addVisit=id=>setClients(p=>p.map(c=>c.id===id?{...c,visits:c.visits+1,points:c.points+100,lastVisit:new Date().toISOString().slice(0,10)}:c));
  const REWARD=1000;
  return (
    <div>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuevo Cliente">
        <Field label="Nombre" full><input className="input" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/></Field>
        <Field label="Teléfono" full><input className="input" value={f.phone} onChange={e=>setF(x=>({...x,phone:e.target.value}))}/></Field>
        <button className="btn-primary" style={{width:"100%",padding:13,marginTop:14,justifyContent:"center"}} onClick={add}>Agregar</button>
      </Modal>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div style={{fontSize:13,color:"#64748B"}}>Cada visita suma <strong>100 puntos</strong>. Premio a los <strong>{REWARD} puntos</strong>.</div>
        <button className="btn-primary" onClick={()=>setShowNew(true)}><IC n="plus" s={15}/>Nuevo Cliente</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {clients.map(c=>{
          const pct=Math.min(100,(c.points%REWARD)/REWARD*100);
          const rewards=Math.floor(c.points/REWARD);
          return(
            <div key={c.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:18}}>
              <div style={{display:"flex",justify:"space-between",alignItems:"flex-start",gap:10,marginBottom:12}}>
                <div><div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{c.name}</div><div style={{fontSize:12,color:"#94A3B8"}}>{c.phone}</div></div>
                {rewards>0&&<span style={{background:"#FEF3C7",color:"#92400E",borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700,flexShrink:0}}>🎁 ×{rewards}</span>}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#64748B",marginBottom:6}}>
                <span>🔖 {c.visits} visitas</span><span>⭐ {c.points} pts</span><span>📅 {c.lastVisit}</span>
              </div>
              <div style={{background:"#F1F5F9",borderRadius:99,height:8,marginBottom:12,overflow:"hidden"}}>
                <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#DB2777,#EC4899)",borderRadius:99,transition:"width 0.3s"}}/>
              </div>
              <button className="btn-primary btn-sm" style={{width:"100%",justifyContent:"center"}} onClick={()=>addVisit(c.id)}>+ Registrar visita</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AlmacenApp = () => {
  const [items,setItems] = useState([
    {id:"i1",name:"Jitomate Saladet",category:"Frutas y Verduras",stock:45,unit:"kg",min:10,cost:18},
    {id:"i2",name:"Aceite Vegetal",category:"Abarrotes",stock:8,unit:"litro",min:15,cost:22},
    {id:"i3",name:"Pollo entero",category:"Carnes y Embutidos",stock:30,unit:"kg",min:20,cost:75},
  ]);
  const [showNew,setShowNew] = useState(false);
  const [f,setF] = useState({name:"",category:"Abarrotes",stock:"",unit:"kg",min:"",cost:""});
  const add=()=>{if(!f.name||!f.stock)return;setItems(p=>[{id:"i"+Date.now(),name:f.name,category:f.category,stock:parseFloat(f.stock),unit:f.unit,min:parseFloat(f.min)||0,cost:parseFloat(f.cost)||0},...p]);setF({name:"",category:"Abarrotes",stock:"",unit:"kg",min:"",cost:""});setShowNew(false);};
  const adjust=(id,delta)=>setItems(p=>p.map(x=>x.id===id?{...x,stock:Math.max(0,x.stock+delta)}:x));
  return(
    <div>
      <Modal open={showNew} onClose={()=>setShowNew(false)} title="Nuevo Producto">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Nombre" full><input className="input" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/></Field>
          <Field label="Categoría" full><select className="input" value={f.category} onChange={e=>setF(x=>({...x,category:e.target.value}))}>{SERVICE_CATS.slice(0,8).map(c=><option key={c}>{c}</option>)}</select></Field>
          <Field label="Stock inicial"><input className="input" type="number" value={f.stock} onChange={e=>setF(x=>({...x,stock:e.target.value}))}/></Field>
          <Field label="Unidad"><select className="input" value={f.unit} onChange={e=>setF(x=>({...x,unit:e.target.value}))}>{["kg","litro","pieza","caja","paquete"].map(u=><option key={u}>{u}</option>)}</select></Field>
          <Field label="Mínimo"><input className="input" type="number" value={f.min} onChange={e=>setF(x=>({...x,min:e.target.value}))}/></Field>
          <Field label="Costo unitario"><input className="input" type="number" value={f.cost} onChange={e=>setF(x=>({...x,cost:e.target.value}))}/></Field>
        </div>
        <button className="btn-primary" style={{width:"100%",padding:13,marginTop:14,justifyContent:"center"}} onClick={add}>Agregar</button>
      </Modal>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{display:"flex",gap:8}}>
          {items.filter(i=>i.stock<=i.min).length>0&&<div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"8px 12px",fontSize:12,fontWeight:600,color:"#DC2626"}}>⚠️ {items.filter(i=>i.stock<=i.min).length} productos con stock bajo</div>}
        </div>
        <button className="btn-primary" onClick={()=>setShowNew(true)}><IC n="plus" s={15}/>Agregar Producto</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {items.map(item=>{
          const low=item.stock<=item.min;
          return(
            <div key={item.id} style={{background:"#fff",border:`1px solid ${low?"#FECACA":"#E2ECF8"}`,borderRadius:14,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{item.name}</div><span style={{fontSize:11,color:"#64748B"}}>{item.category}</span></div>
                {low&&<span style={{background:"#FEF2F2",color:"#DC2626",borderRadius:99,padding:"2px 8px",fontSize:10,fontWeight:700}}>⚠️ Bajo</span>}
              </div>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:28,color:low?"#DC2626":"#0F1F3D",marginBottom:4}}>{item.stock} <span style={{fontSize:14,fontWeight:500,color:"#94A3B8"}}>{item.unit}</span></div>
              <div style={{fontSize:11,color:"#94A3B8",marginBottom:12}}>Mín: {item.min} {item.unit} · ${item.cost}/{item.unit}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>adjust(item.id,-1)} style={{flex:1,background:"#FEF2F2",border:"1px solid #FECACA",color:"#DC2626",borderRadius:8,padding:"7px 0",cursor:"pointer",fontWeight:700,fontSize:16}}>−</button>
                <button onClick={()=>adjust(item.id,1)} style={{flex:1,background:"#ECFDF5",border:"1px solid #A7F3D0",color:"#059669",borderRadius:8,padding:"7px 0",cursor:"pointer",fontWeight:700,fontSize:16}}>+</button>
                <button onClick={()=>adjust(item.id,10)} style={{flex:1,background:"#EFF6FF",border:"1px solid #BFDBFE",color:"#1D4ED8",borderRadius:8,padding:"7px 0",cursor:"pointer",fontWeight:600,fontSize:12}}>+10</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PVFifoApp = () => {
  const [cart,setCart] = useState([]);
  const [paid,setPaid] = useState(false);
  const menu=[{id:"m1",name:"Jitomate Saladet",price:18.5,unit:"kg"},{id:"m2",name:"Aguacate Hass",price:45,unit:"kg"},{id:"m3",name:"Arrachera USDA",price:285,unit:"kg"},{id:"m4",name:"Rib Eye Nacional",price:320,unit:"kg"},{id:"m5",name:"Pan Artesanal",price:35,unit:"pz"}];
  const addItem=item=>setCart(p=>{const ex=p.find(x=>x.id===item.id);return ex?p.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...p,{...item,qty:1}];});
  const removeItem=id=>setCart(p=>p.filter(x=>x.id!==id));
  const total=cart.reduce((s,i)=>s+i.price*i.qty,0);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:20,minHeight:400}}>
      <div>
        <h3 style={{fontWeight:700,fontSize:15,color:"#1E3A6E",marginBottom:14}}>Productos (FIFO)</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
          {menu.map(item=>(
            <div key={item.id} onClick={()=>addItem(item)} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:12,padding:14,cursor:"pointer",transition:"all 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(30,64,175,0.12)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
              <div style={{fontWeight:700,fontSize:13,color:"#0F1F3D",marginBottom:4}}>{item.name}</div>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:16,color:"#1D4ED8"}}>${item.price}<span style={{fontSize:10,color:"#94A3B8",fontWeight:400}}>/{item.unit}</span></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:18,display:"flex",flexDirection:"column",height:"fit-content"}}>
        <h3 style={{fontWeight:700,fontSize:14,color:"#1E3A6E",marginBottom:14}}>🛒 Ticket</h3>
        {cart.length===0?<p style={{color:"#94A3B8",fontSize:13,textAlign:"center",padding:"20px 0"}}>Agrega productos</p>:cart.map(i=>(
          <div key={i.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:8,borderBottom:"1px solid #F1F5F9",marginBottom:8}}>
            <div><div style={{fontWeight:600,fontSize:12}}>{i.name}</div><div style={{fontSize:11,color:"#94A3B8"}}>×{i.qty} × ${i.price}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontWeight:700,fontSize:13,color:"#1D4ED8"}}>${(i.price*i.qty).toFixed(2)}</span>
              <button onClick={()=>removeItem(i.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#DC2626",fontSize:14}}>✕</button>
            </div>
          </div>
        ))}
        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #E2ECF8"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:"#64748B"}}>Subtotal</span><span style={{fontWeight:600}}>${total.toFixed(2)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:12,color:"#64748B"}}>IVA (16%)</span><span style={{fontWeight:600}}>${(total*0.16).toFixed(2)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{fontWeight:700,fontSize:15}}>Total</span><span style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:18,color:"#059669"}}>${(total*1.16).toFixed(2)}</span></div>
          {paid?<div style={{textAlign:"center",background:"#ECFDF5",borderRadius:10,padding:12,color:"#059669",fontWeight:700}}>✓ Venta registrada</div>:(
            <div style={{display:"grid",gap:8}}>
              <button className="btn-primary" style={{justifyContent:"center",padding:11}} onClick={()=>{if(cart.length)setPaid(true);setTimeout(()=>{setCart([]);setPaid(false);},2000);}}>💳 Cobrar</button>
              <button className="btn-outline btn-sm" style={{justifyContent:"center"}} onClick={()=>setCart([])}>Limpiar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PVRestauranteApp = () => {
  const [tables,setTables] = useState([
    {id:"t1",num:1,status:"libre",waiter:"",order:[]},
    {id:"t2",num:2,status:"ocupada",waiter:"Luis",order:[{name:"Arrachera",price:285},{name:"Agua mineral",price:45}]},
    {id:"t3",num:3,status:"ocupada",waiter:"Karen",order:[{name:"Rib Eye",price:320}]},
    {id:"t4",num:4,status:"libre",waiter:"",order:[]},
    {id:"t5",num:5,status:"cuenta",waiter:"Luis",order:[{name:"Chef especial",price:180},{name:"Refresco",price:35}]},
    {id:"t6",num:6,status:"libre",waiter:"",order:[]},
  ]);
  const [selected,setSelected] = useState(null);
  const stColor={libre:"#ECFDF5",ocupada:"#EFF6FF",cuenta:"#FFFBEB"};
  const stBorder={libre:"#A7F3D0",ocupada:"#BFDBFE",cuenta:"#FDE68A"};
  const stTextColor={libre:"#059669",ocupada:"#1D4ED8",cuenta:"#D97706"};
  const t=tables.find(x=>x.id===selected);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:20}}>
      <div>
        <h3 style={{fontWeight:700,fontSize:15,color:"#1E3A6E",marginBottom:14}}>Mapa de Mesas</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {tables.map(t=>(
            <div key={t.id} onClick={()=>setSelected(t.id)} style={{background:stColor[t.status],border:`2px solid ${selected===t.id?"#1D4ED8":stBorder[t.status]}`,borderRadius:14,padding:18,cursor:"pointer",textAlign:"center",transition:"all 0.15s"}}>
              <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:stTextColor[t.status],marginBottom:4}}>Mesa {t.num}</div>
              <div style={{fontSize:11,fontWeight:700,color:stTextColor[t.status],textTransform:"capitalize"}}>{t.status}</div>
              {t.waiter&&<div style={{fontSize:11,color:"#64748B",marginTop:4}}>👤 {t.waiter}</div>}
              {t.order.length>0&&<div style={{fontSize:11,color:"#64748B",marginTop:2}}>{t.order.length} ítems</div>}
            </div>
          ))}
        </div>
      </div>
      <div style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:18}}>
        {t?(
          <>
            <h3 style={{fontWeight:700,fontSize:14,marginBottom:14}}>Mesa {t.num} -- <span style={{color:stTextColor[t.status]}}>{t.status}</span></h3>
            {t.waiter&&<div style={{fontSize:13,color:"#64748B",marginBottom:10}}>👤 Mesero: {t.waiter}</div>}
            {t.order.length>0?(
              <>
                {t.order.map((o,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #F1F5F9",fontSize:13}}><span>{o.name}</span><span style={{fontWeight:700,color:"#1D4ED8"}}>${o.price}</span></div>)}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:12,paddingTop:12,borderTop:"1px solid #E2ECF8"}}>
                  <span style={{fontWeight:700}}>Total</span>
                  <span style={{fontFamily:"Sora,sans-serif",fontWeight:800,color:"#059669"}}>${t.order.reduce((s,o)=>s+o.price,0)}</span>
                </div>
                <div style={{display:"grid",gap:8,marginTop:14}}>
                  <button className="btn-primary btn-sm" style={{justifyContent:"center"}} onClick={()=>setTables(p=>p.map(x=>x.id===t.id?{...x,status:"cuenta"}:x))}>🧾 Pedir cuenta</button>
                  <button className="btn-outline btn-sm" style={{justifyContent:"center"}} onClick={()=>setTables(p=>p.map(x=>x.id===t.id?{...x,status:"libre",order:[],waiter:""}:x))}>✓ Mesa pagada / liberar</button>
                </div>
              </>
            ):<p style={{color:"#94A3B8",fontSize:13,textAlign:"center",padding:"16px 0"}}>Sin órdenes</p>}
          </>
        ):<p style={{color:"#94A3B8",fontSize:13,textAlign:"center",padding:"40px 0"}}>Selecciona una mesa</p>}
      </div>
    </div>
  );
};

const NominaApp = () => {
  const [employees,setEmployees] = useState([
    {id:"e1",name:"Luis Hernández",position:"Cocinero",salary:12000,status:"activo",checkIn:"08:02",checkOut:null,incidents:0},
    {id:"e2",name:"Karen Martínez",position:"Mesera",salary:9000,status:"activo",checkIn:"09:15",checkOut:null,incidents:1},
    {id:"e3",name:"Pedro Soto",position:"Lavaplatos",salary:7500,status:"ausente",checkIn:null,checkOut:null,incidents:2},
  ]);
  const now = new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});
  const punch=(id,type)=>setEmployees(p=>p.map(e=>e.id===id?{...e,[type==="in"?"checkIn":"checkOut"]:now,status:type==="in"?"activo":e.status}:e));
  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
        {[["Presentes",employees.filter(e=>e.checkIn&&!e.checkOut).length,"#059669","#ECFDF5"],["Ausentes",employees.filter(e=>e.status==="ausente").length,"#DC2626","#FEF2F2"],["Total nómina",`$${employees.reduce((s,e)=>s+e.salary,0).toLocaleString("es-MX")}`,,"#1D4ED8","#EFF6FF"]].map(([l,v,c,bg])=>(
          <div key={l} style={{background:bg||"#EFF6FF",border:`1px solid ${c||"#1D4ED8"}30`,borderRadius:12,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontFamily:"Sora,sans-serif",fontWeight:800,fontSize:22,color:c||"#1D4ED8"}}>{v}</div>
            <div style={{fontSize:12,color:"#64748B",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {employees.map(e=>(
          <div key={e.id} style={{background:"#fff",border:"1px solid #E2ECF8",borderRadius:14,padding:18,display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <Av initials={e.name.slice(0,2)} size={44} color={e.status==="ausente"?"#DC2626":"#1D4ED8"}/>
            <div style={{flex:1,minWidth:150}}>
              <div style={{fontWeight:700,fontSize:14,color:"#0F1F3D"}}>{e.name}</div>
              <div style={{fontSize:12,color:"#64748B"}}>{e.position} · ${e.salary.toLocaleString("es-MX")}/mes</div>
              {e.incidents>0&&<div style={{fontSize:11,color:"#D97706",marginTop:2}}>⚠️ {e.incidents} incidencia(s)</div>}
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
              {e.checkIn&&<span style={{fontSize:12,background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:8,padding:"4px 10px",color:"#059669"}}>🟢 Entrada {e.checkIn}</span>}
              {e.checkOut&&<span style={{fontSize:12,background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,padding:"4px 10px",color:"#DC2626"}}>🔴 Salida {e.checkOut}</span>}
              {!e.checkIn&&<button className="btn-primary btn-sm" onClick={()=>punch(e.id,"in")}>Registrar entrada</button>}
              {e.checkIn&&!e.checkOut&&<button className="btn-outline btn-sm" onClick={()=>punch(e.id,"out")}>Registrar salida</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ======================================================
   APP
====================================================== */
export default function App() {
  const [screen,setScreen] = useState("landing");
  const [currentUser,setCurrentUser] = useState(null);
  const [view,setView] = useState("feed");
  const [posts,setPosts] = useState(POSTS);
  const [profileTarget,setProfileTarget] = useState(null);
  const [chatTarget,setChatTarget] = useState(null);
  const [chatPost,setChatPost] = useState(null);
  const [purchasedApps,setPurchasedApps] = useState([]);

  const login = user => { setCurrentUser(user); setView(user.type==="admin"?"admin":"feed"); setScreen("app"); };
  const openProfile = u => { setProfileTarget(u); setView("profile_view"); };
  const openChat = (u, post) => { setChatTarget(u); setChatPost(post||null); setView("chat"); };
  const updateUser = u => { setCurrentUser(u); };

  const changeView = v => { setView(v); setChatTarget(null); setChatPost(null); setProfileTarget(null); };

  const handleAppPurchased = (app) => {
    setPurchasedApps(prev=>prev.find(a=>a.id===app.id)?prev:[...prev,app]);
  };

  if(screen==="landing") return <><GF/><Landing onLogin={()=>setScreen("login")} onReg={()=>setScreen("register")}/></>;
  if(screen==="login") return <><GF/><AuthPage mode="login" onSwitch={()=>setScreen("register")} onSuccess={login}/></>;
  if(screen==="register") return <><GF/><AuthPage mode="register" onSwitch={()=>setScreen("login")} onSuccess={login}/></>;

  const renderView = () => {
    if(view==="feed") return <FeedPage currentUser={currentUser} posts={posts} setPosts={setPosts} onOpenChat={openChat} onOpenProfile={openProfile}/>;
    if(view==="search") return <SearchPage currentUser={currentUser} onOpenProfile={openProfile} onOpenChat={openChat} posts={posts}/>;
    if(view==="catalog") return <CatalogPage currentUser={currentUser}/>;
    if(view==="chat") return <ChatPage currentUser={currentUser} initialContact={chatTarget} isSubView={currentUser.type==="sub"} initialPost={chatPost}/>;
    if(view==="calendar") return <CalendarPage currentUser={currentUser}/>;
    if(view==="ratings") return <RatingsPage currentUser={currentUser}/>;
    if(view==="profile") return <ProfilePage user={currentUser} isOwn={true} onUpdate={updateUser} currentUser={currentUser} onOpenProfile={openProfile} onOpenChat={openChat}/>;
    if(view==="profile_view") return <ProfilePage user={profileTarget||currentUser} isOwn={profileTarget?.id===currentUser.id} onUpdate={updateUser} currentUser={currentUser} onOpenProfile={openProfile} onOpenChat={openChat}/>;
    if(view==="vacantes") return <VacantesPage currentUser={currentUser} posts={posts} setPosts={setPosts}/>;
    if(view==="subaccounts") return <SubAccountsPage currentUser={currentUser}/>;
    if(view==="apps") return <AppsPage onAppPurchased={handleAppPurchased}/>;
    if(view?.startsWith("app_run_")) {
      const appId = view.replace("app_run_","");
      const app = APP_CATALOG.find(a=>a.id===appId);
      return <AppLaunchPage app={app}/>;
    }
    if(view==="admin"||view==="admin_users"||view==="admin_content"||view==="admin_reports") return <AdminPanel section={view}/>;
    return <FeedPage currentUser={currentUser} posts={posts} setPosts={setPosts} onOpenChat={openChat} onOpenProfile={openProfile}/>;
  };

  return (
    <>
      <GF/>
      <Layout user={currentUser} view={view} setView={changeView} purchasedApps={purchasedApps}>
        {renderView()}
      </Layout>
    </>
  );
}
