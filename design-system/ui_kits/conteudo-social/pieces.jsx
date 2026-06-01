/* Suprema Pizza · Conteúdo Social — renderizadores de peça (9:16) */

const SUPS = {
  carvao:'#0F0F0F', grafite:'#161616', grafite2:'#1F1F1F',
  vermelho:'#D62828', vermelhoLt:'#E84B4B', branco:'#FFFFFF',
  cinza:'#9A9A9A', cinzaEsc:'#6E6E6E', bege:'#FFEBDC', tinta:'#1A1A1A',
  linha:'rgba(255,255,255,.08)'
};

/* Halo bege orgânico (assinatura da legenda). Aplicado em <span> inline. */
function Halo({children, bold, scale=1}){
  return (
    <span style={{
      WebkitBoxDecorationBreak:'clone', boxDecorationBreak:'clone',
      background:SUPS.bege, color:SUPS.tinta,
      fontWeight: bold?700:400, lineHeight:1.62,
      padding:`${.06*scale}em ${.30*scale}em`, borderRadius:`${.5*scale}em`,
      boxShadow:`-${.15*scale}em 0 0 ${SUPS.bege}, ${.15*scale}em 0 0 ${SUPS.bege}`
    }}>{children}</span>
  );
}

/* Logo branca no rodapé */
function PieceLogo({w=88, opacity=.92}){
  return <img src="../../assets/logo-suprema-branco.png" alt="Suprema Pizza"
    style={{position:'absolute',bottom:'6%',left:'50%',transform:'translateX(-50%)',width:w,opacity}}/>;
}

/* ---------- STORY (foto cheia + halo no topo + logo) ---------- */
function StoryPiece({foto, l1, l2, W=300}){
  const H = W*16/9;
  return (
    <div style={{position:'relative',width:W,height:H,borderRadius:18,overflow:'hidden',
      background:`#222 center/cover`,backgroundImage:`url('${foto}')`,boxShadow:'0 18px 48px rgba(0,0,0,.6)'}}>
      <div style={{position:'absolute',top:'9%',left:0,right:0,textAlign:'center',padding:'0 8%',
        fontSize:W*.064,lineHeight:1.7}}>
        <Halo scale={1}>{l1}</Halo>{' '}<Halo bold scale={1}>{l2}</Halo>
      </div>
      <PieceLogo w={W*.3}/>
    </div>
  );
}

/* ---------- REEL (moldura cinematográfica + narração central branca) ---------- */
function ReelPiece({foto, narr, W=300, playing}){
  const H = W*16/9;
  return (
    <div style={{position:'relative',width:W,height:H,borderRadius:18,overflow:'hidden',background:'#000',
      boxShadow:'0 18px 48px rgba(0,0,0,.6)'}}>
      <div style={{position:'absolute',inset:0,backgroundImage:`url('${foto}')`,backgroundSize:'cover',
        backgroundPosition:'center',transform:playing?'scale(1.06)':'scale(1)',transition:'transform 4s linear'}}></div>
      {/* barras cinematográficas */}
      <div style={{position:'absolute',top:0,left:0,right:0,height:'8%',background:'#000'}}></div>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'8%',background:'#000'}}></div>
      {/* narração no centro (altura do produto), maiúscula, fina, sombra */}
      <div style={{position:'absolute',top:'46%',left:0,right:0,transform:'translateY(-50%)',textAlign:'center',
        padding:'0 10%',color:'#fff',fontWeight:300,letterSpacing:'.02em',textTransform:'uppercase',
        fontSize:W*.072,lineHeight:1.25,textShadow:'0 2px 14px rgba(0,0,0,.7)'}}>{narr}</div>
      <PieceLogo w={W*.26} opacity={.85}/>
    </div>
  );
}

/* ---------- STOP-MOTION (cicla frames + halo fixo) ---------- */
function StopMotionPiece({frames, l1, l2, W=300}){
  const [i,setI] = React.useState(0);
  React.useEffect(()=>{
    const t=setInterval(()=>setI(p=>(p+1)%frames.length),420);
    return ()=>clearInterval(t);
  },[frames.length]);
  const H = W*16/9;
  return (
    <div style={{position:'relative',width:W,height:H,borderRadius:18,overflow:'hidden',background:'#000',
      boxShadow:'0 18px 48px rgba(0,0,0,.6)'}}>
      {frames.map((f,idx)=>(
        <div key={idx} style={{position:'absolute',inset:0,backgroundImage:`url('${f}')`,backgroundSize:'cover',
          backgroundPosition:'center',opacity:idx===i?1:0,transition:'opacity .12s'}}></div>
      ))}
      <div style={{position:'absolute',top:'9%',left:0,right:0,textAlign:'center',padding:'0 8%',
        fontSize:W*.064,lineHeight:1.7}}>
        <Halo>{l1}</Halo>{' '}<Halo bold>{l2}</Halo>
      </div>
      <PieceLogo w={W*.3}/>
      {/* indicador de frames */}
      <div style={{position:'absolute',bottom:'2.5%',left:'50%',transform:'translateX(-50%)',display:'flex',gap:5}}>
        {frames.map((_,idx)=><span key={idx} style={{width:5,height:5,borderRadius:9,background:idx===i?SUPS.vermelhoLt:'rgba(255,255,255,.4)'}}></span>)}
      </div>
    </div>
  );
}

/* ---------- FEED (grade estilo Instagram) ---------- */
function FeedGrid({posts, W=300}){
  return (
    <div style={{width:W,background:SUPS.grafite,borderRadius:18,overflow:'hidden',boxShadow:'0 18px 48px rgba(0,0,0,.6)'}}>
      <div style={{display:'flex',alignItems:'center',gap:9,padding:'12px 14px',borderBottom:`1px solid ${SUPS.linha}`}}>
        <div style={{width:34,height:34,borderRadius:999,background:'#000',display:'grid',placeItems:'center',border:`1.5px solid ${SUPS.vermelho}`}}>
          <img src="../../assets/logo-suprema-branco.png" style={{width:24}}/>
        </div>
        <div style={{lineHeight:1.1}}>
          <div style={{fontWeight:700,fontSize:12.5,color:'#fff'}}>asupremapizza</div>
          <div style={{fontSize:10.5,color:SUPS.cinza}}>Blumenau, SC</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:2}}>
        {posts.map((p,i)=>(
          <div key={i} style={{position:'relative',aspectRatio:'1/1',backgroundImage:`url('${p}')`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window,{SUPS,Halo,PieceLogo,StoryPiece,ReelPiece,StopMotionPiece,FeedGrid});
