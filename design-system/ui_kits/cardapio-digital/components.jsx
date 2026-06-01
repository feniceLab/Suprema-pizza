/* Suprema Pizza · Cardápio Digital — componentes apresentacionais */

const SUP = {
  carvao:'#0F0F0F', grafite:'#161616', grafite2:'#1F1F1F', grafite3:'#2A2A2A',
  vermelho:'#D62828', vermelhoDk:'#B71C1C', vermelhoLt:'#E84B4B',
  branco:'#FFFFFF', cinza:'#9A9A9A', cinzaEsc:'#6E6E6E', linha:'rgba(255,255,255,.08)',
  linhaForte:'rgba(255,255,255,.16)'
};

/* ---- Wordmark do logo em texto ---- */
function Wordmark({size=20, color=SUP.vermelho}){
  return (
    <span style={{display:'inline-flex',flexDirection:'column',lineHeight:.82,color}}>
      <span style={{fontWeight:800,fontSize:size,letterSpacing:'.01em',textTransform:'uppercase'}}>SUPREMA</span>
      <span style={{fontWeight:300,fontSize:size*.42,letterSpacing:'.42em',textTransform:'uppercase',paddingLeft:'.04em',marginTop:2}}>PIZZA</span>
    </span>
  );
}

/* ---- Barra superior do app ---- */
function TopBar({onBag, bagCount}){
  return (
    <header style={{position:'sticky',top:0,zIndex:20,background:SUP.carvao,
      borderBottom:`2px solid ${SUP.vermelho}`,padding:'14px 18px',
      display:'flex',alignItems:'center',gap:12}}>
      <img src="../../assets/logo-suprema-branco.png" alt="Suprema Pizza" style={{height:34}}/>
      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:14}}>
        <div style={{display:'flex',alignItems:'center',gap:6,color:SUP.cinza,fontSize:12}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:'#3FB950',display:'inline-block'}}></span>
          Aberto · 18h–23h
        </div>
        <button onClick={onBag} aria-label="Sacola" style={{position:'relative',background:SUP.grafite2,
          border:`1px solid ${SUP.linhaForte}`,borderRadius:12,width:44,height:44,cursor:'pointer',
          display:'grid',placeItems:'center'}}>
          <BagIcon/>
          {bagCount>0 && <span style={{position:'absolute',top:-6,right:-6,background:SUP.vermelho,color:'#fff',
            fontSize:11,fontWeight:700,minWidth:20,height:20,borderRadius:999,display:'grid',placeItems:'center',
            padding:'0 5px'}}>{bagCount}</span>}
        </button>
      </div>
    </header>
  );
}

/* ---- Hero do delivery ---- */
function DeliveryHero(){
  return (
    <div style={{position:'relative',height:200,overflow:'hidden'}}>
      <img src="../../assets/photos/foto-01.jpg" alt="" style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 60%'}}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(15,15,15,.1),rgba(15,15,15,.95))'}}></div>
      <div style={{position:'absolute',left:18,right:18,bottom:16}}>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',color:SUP.vermelhoLt,marginBottom:6}}>Pizzaria · Blumenau/SC</div>
        <div style={{fontWeight:800,fontSize:26,textTransform:'uppercase',lineHeight:1.02,color:'#fff'}}>Quando o queijo escorre,<br/>a pizza tá no ponto.</div>
        <div style={{display:'flex',gap:12,marginTop:10,fontSize:12.5,color:SUP.cinza,whiteSpace:'nowrap'}}>
          <span style={{color:'#fff'}}>★ 4,9</span><span>·</span><span>40–55 min</span><span>·</span><span>Entrega R$ 6,90</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Chips de categoria ---- */
function CategoryChips({cats, active, onPick}){
  return (
    <div style={{display:'flex',gap:9,padding:'14px 18px',overflowX:'auto',position:'sticky',top:64,
      background:SUP.carvao,zIndex:15,borderBottom:`1px solid ${SUP.linha}`}}>
      {cats.map(c=>(
        <button key={c} onClick={()=>onPick(c)} style={{whiteSpace:'nowrap',flexShrink:0,
          background:active===c?SUP.vermelho:SUP.grafite2,
          border:`1px solid ${active===c?SUP.vermelho:SUP.linha}`,
          color:active===c?'#fff':SUP.cinza,fontWeight:active===c?600:500,
          fontSize:13,padding:'9px 16px',borderRadius:999,cursor:'pointer',
          fontFamily:'Poppins,sans-serif'}}>{c}</button>
      ))}
    </div>
  );
}

/* ---- Linha de item do cardápio ---- */
function MenuRow({item, onOpen}){
  return (
    <button onClick={()=>onOpen(item)} style={{display:'flex',gap:14,width:'100%',textAlign:'left',
      background:'transparent',border:'none',borderBottom:`1px solid ${SUP.linha}`,
      padding:'16px 18px',cursor:'pointer',alignItems:'center',fontFamily:'Poppins,sans-serif'}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
          {item.tag && <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',
            color:SUP.vermelhoLt,background:'rgba(214,40,40,.14)',padding:'2px 7px',borderRadius:6}}>{item.tag}</span>}
        </div>
        <div style={{fontWeight:700,fontSize:16,color:'#fff'}}>{item.nome}</div>
        <div style={{fontSize:12.5,color:SUP.cinza,lineHeight:1.45,marginTop:3,
          display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.desc}</div>
        <div style={{fontWeight:700,color:SUP.vermelho,fontSize:15,marginTop:7,fontVariantNumeric:'tabular-nums'}}>
          {item.precoLabel || `R$ ${item.preco}`}
        </div>
      </div>
      {item.foto && <div style={{position:'relative',flexShrink:0}}>
        <img src={item.foto} alt="" style={{width:96,height:96,objectFit:'cover',borderRadius:12,border:`1px solid ${SUP.linha}`}}/>
        <span style={{position:'absolute',bottom:-8,right:-8,width:30,height:30,borderRadius:999,background:SUP.vermelho,
          color:'#fff',display:'grid',placeItems:'center',fontSize:18,boxShadow:'0 4px 12px rgba(0,0,0,.4)'}}>+</span>
      </div>}
    </button>
  );
}

/* ---- Ícones (traço fino, estilo Lucide) ---- */
function BagIcon(){return(<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>);}
function CloseIcon(){return(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>);}
function BackIcon(){return(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>);}

Object.assign(window,{SUP,Wordmark,TopBar,DeliveryHero,CategoryChips,MenuRow,BagIcon,CloseIcon,BackIcon});
