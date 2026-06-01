/* Suprema Pizza · Conteúdo Social — Estúdio (shell interativo) */
const {useState} = React;

const SABORES = [
  {id:'suprema', foto:'../../assets/photos/foto-01.jpg', l1:'Quando o queijo escorre…', l2:'a pizza tá no ponto.', narr:'massa fresca,\nqueijo que escorre.'},
  {id:'calabresa', foto:'../../assets/photos/foto-60.jpg', l1:'Não é qualquer pizza.', l2:'É A Suprema.', narr:'recheio até\na borda.'},
  {id:'brocolis', foto:'../../assets/photos/foto-30.jpg', l1:'Massa fresca, do jeito que', l2:'a gente faz há anos.', narr:'do forno\ndireto pra você.'},
  {id:'milho', foto:'../../assets/photos/foto-100.jpg', l1:'Direto do forno…', l2:'vem pra sua casa.', narr:'milho, bacon\ne catupiry.'},
  {id:'alho', foto:'../../assets/photos/foto-50.jpg', l1:'Cebola caramelizada e', l2:'pasta de alho premium.', narr:'o ouro do\nsabor.'},
  {id:'combo', foto:'../../assets/photos/foto-110.jpg', l1:'Se for pra exagerar,', l2:'que seja na pizza.', narr:'a noite pede\numa dessas.'},
];

const STOP_FRAMES = ['../../assets/photos/foto-01.jpg','../../assets/photos/foto-60.jpg','../../assets/photos/foto-30.jpg','../../assets/photos/foto-100.jpg'];
const FEED = ['../../assets/photos/foto-01.jpg','../../assets/photos/foto-60.jpg','../../assets/photos/foto-30.jpg','../../assets/photos/foto-100.jpg','../../assets/photos/foto-50.jpg','../../assets/photos/foto-110.jpg','../../assets/photos/foto-20.jpg','../../assets/photos/foto-80.jpg','../../assets/photos/foto-40.jpg'];

const FORMATS = [
  {id:'story', nome:'Story', sub:'9:16 · halo bege'},
  {id:'reel', nome:'Reel', sub:'9:16 · cinematográfico'},
  {id:'stop', nome:'Stop-Motion', sub:'9:16 · 4.8s loop'},
  {id:'feed', nome:'Feed', sub:'grade 1:1'},
];

function Field({label, value, onChange, bold}){
  return (
    <label style={{display:'block',marginBottom:14}}>
      <span style={{fontSize:10.5,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:SUPS.cinza,
        display:'block',marginBottom:6}}>{label}</span>
      <input value={value} onChange={e=>onChange(e.target.value)} style={{width:'100%',boxSizing:'border-box',
        background:SUPS.grafite2,border:`1px solid ${SUPS.linha}`,borderRadius:10,padding:'11px 13px',color:'#fff',
        fontFamily:'Poppins,sans-serif',fontSize:14,fontWeight:bold?700:400}}/>
    </label>
  );
}

function App(){
  const [fmt,setFmt] = useState('story');
  const [sIdx,setSIdx] = useState(0);
  const [l1,setL1] = useState(SABORES[0].l1);
  const [l2,setL2] = useState(SABORES[0].l2);
  const [playing,setPlaying] = useState(false);
  const s = SABORES[sIdx];

  const pickSabor = (i)=>{ setSIdx(i); setL1(SABORES[i].l1); setL2(SABORES[i].l2); };

  return (
    <div style={{minHeight:'100vh',background:SUPS.carvao,color:'#fff',fontFamily:'Poppins,sans-serif'}}>
      {/* Header */}
      <header style={{display:'flex',alignItems:'center',gap:12,padding:'14px 26px',borderBottom:`2px solid ${SUPS.vermelho}`}}>
        <img src="../../assets/logo-suprema-branco.png" style={{height:32}}/>
        <div style={{lineHeight:1.1}}>
          <div style={{fontWeight:800,fontSize:15,textTransform:'uppercase',letterSpacing:'.03em',whiteSpace:'nowrap'}}>Estúdio de Conteúdo</div>
          <div style={{fontSize:11,color:SUPS.cinza}}>Fenice Lab · peças sociais 9:16</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:7,fontSize:11.5,color:SUPS.cinza}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:SUPS.vermelho,display:'inline-block'}}></span>1080 × 1920
        </div>
      </header>

      <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:0,minHeight:'calc(100vh - 64px)'}}>
        {/* Palco */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'30px 20px',
          background:'radial-gradient(circle at 50% 35%, #161310, #0c0a09 75%)'}}>
          {/* tabs de formato */}
          <div style={{display:'flex',gap:8,marginBottom:26,flexWrap:'wrap',justifyContent:'center'}}>
            {FORMATS.map(f=>(
              <button key={f.id} onClick={()=>setFmt(f.id)} style={{background:fmt===f.id?SUPS.vermelho:'rgba(255,255,255,.06)',
                border:`1px solid ${fmt===f.id?SUPS.vermelho:SUPS.linha}`,color:fmt===f.id?'#fff':SUPS.cinza,
                borderRadius:999,padding:'8px 16px',cursor:'pointer',fontFamily:'Poppins,sans-serif',
                fontWeight:fmt===f.id?700:500,fontSize:13}}>{f.nome}</button>
            ))}
          </div>

          {fmt==='story' && <StoryPiece foto={s.foto} l1={l1} l2={l2} W={300}/>}
          {fmt==='reel' && <ReelPiece foto={s.foto} narr={s.narr} W={300} playing={playing}/>}
          {fmt==='stop' && <StopMotionPiece frames={STOP_FRAMES} l1={l1} l2={l2} W={300}/>}
          {fmt==='feed' && <FeedGrid posts={FEED} W={320}/>}

          <div style={{marginTop:18,fontSize:12,color:SUPS.cinzaEsc,textAlign:'center',maxWidth:300}}>
            {FORMATS.find(f=>f.id===fmt).sub}
            {fmt==='reel' && <button onClick={()=>setPlaying(p=>!p)} style={{marginLeft:10,background:'none',border:`1px solid ${SUPS.linha}`,
              color:'#fff',borderRadius:999,padding:'4px 12px',cursor:'pointer',fontSize:11,fontFamily:'Poppins,sans-serif'}}>{playing?'❚❚ pausar':'▶ play'}</button>}
          </div>
        </div>

        {/* Painel de controle */}
        <aside style={{background:SUPS.grafite,borderLeft:`1px solid ${SUPS.linha}`,padding:'22px 22px 40px',overflowY:'auto'}}>
          <div style={{fontSize:10.5,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:SUPS.cinza,marginBottom:12}}>Sabor</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:24}}>
            {SABORES.map((sb,i)=>(
              <button key={sb.id} onClick={()=>pickSabor(i)} style={{position:'relative',aspectRatio:'1/1',borderRadius:10,
                overflow:'hidden',border:`2px solid ${i===sIdx?SUPS.vermelho:'transparent'}`,cursor:'pointer',padding:0,
                backgroundImage:`url('${sb.foto}')`,backgroundSize:'cover',backgroundPosition:'center'}}>
                {i===sIdx && <span style={{position:'absolute',inset:0,boxShadow:`inset 0 0 0 2px ${SUPS.vermelho}`,borderRadius:8}}></span>}
              </button>
            ))}
          </div>

          {(fmt==='story'||fmt==='stop') && <>
            <div style={{fontSize:10.5,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:SUPS.cinza,marginBottom:12}}>Copy · 2 linhas</div>
            <Field label="Linha 1 · gancho (Regular)" value={l1} onChange={setL1}/>
            <Field label="Linha 2 · punchline (Bold)" value={l2} onChange={setL2} bold/>
            <div style={{background:SUPS.grafite2,border:`1px solid ${SUPS.linha}`,borderRadius:10,padding:'12px 14px',marginTop:4}}>
              <div style={{fontSize:11,color:SUPS.cinza,lineHeight:1.6}}>
                <b style={{color:SUPS.vermelhoLt}}>Regra:</b> 5–10 palavras por linha · linha 1 termina em "…" · sem emoji, hashtag ou preço.
              </div>
            </div>
          </>}

          {fmt==='reel' && <div style={{fontSize:12.5,color:SUPS.cinza,lineHeight:1.7}}>
            <div style={{fontWeight:700,color:'#fff',marginBottom:6}}>Narração na tela</div>
            "{s.narr.replace('\n',' ')}"<br/><br/>
            Maiúscula, fonte fina branca, centro vertical (altura do produto). Aparece e some com fade. Tela limpa nos picos (cheese pull). Abre e fecha em fade do preto.
          </div>}

          {fmt==='feed' && <div style={{fontSize:12.5,color:SUPS.cinza,lineHeight:1.7}}>
            <div style={{fontWeight:700,color:'#fff',marginBottom:6}}>Grade do feed</div>
            Fotografia real, quente e apetitosa. Sem texto sobre a foto na grade — a legenda vai no post. Mix semanal: salgado → premium → bastidores → salgado → branding → doce → doce.
          </div>}
        </aside>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
