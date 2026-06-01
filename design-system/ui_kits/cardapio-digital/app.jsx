/* Suprema Pizza · Cardápio Digital — app interativo (fluxo de pedido) */
const {useState} = React;

const TAMANHOS = [
  {id:'baby', nome:'Baby', det:'20cm · 4 fatias · 1 sabor', preco:38},
  {id:'media', nome:'Média', det:'30cm · 8 fatias · 2 sabores', preco:69},
  {id:'grande', nome:'Grande', det:'35cm · 12 fatias · 3 sabores', preco:91},
  {id:'gigante', nome:'Gigante', det:'45cm · 16 fatias · 4 sabores', preco:109},
];

const MENU = {
  'Destaques':[
    {id:'suprema', nome:'A Suprema', tag:'Mais pedida', desc:'O sabor que dá nome à casa: calabresa artesanal, muçarela, tomate e orégano na borda alta.', foto:'../../assets/photos/foto-01.jpg', precoLabel:'a partir de R$ 38'},
    {id:'meat', nome:'Calabresa Premium', tag:'Especial', desc:'Calabresa, carne temperada e fios de catupiry sobre muçarela derretida.', foto:'../../assets/photos/foto-60.jpg', precoLabel:'a partir de R$ 38'},
    {id:'brocolis', nome:'Bacon com Brócolis', desc:'Brócolis assado, bacon em cubos e muçarela. Rústica e marcante.', foto:'../../assets/photos/foto-30.jpg', precoLabel:'a partir de R$ 38'},
  ],
  'Salgadas':[
    {id:'milho', nome:'Milho, Bacon e Catupiry', tag:'Clássica', desc:'Milho, bacon crocante e catupiry cremoso.', foto:'../../assets/photos/foto-100.jpg', precoLabel:'a partir de R$ 38'},
    {id:'quatro', nome:'Quatro Estações', desc:'Quatro sabores numa pizza só — calabresa, frango, milho e mista.', foto:'../../assets/photos/foto-110.jpg', precoLabel:'a partir de R$ 69'},
    {id:'alho', nome:'Alho com Cebola Caramelizada', tag:'Premium', desc:'Pasta de alho premium e cebola caramelizada. Parceria Santa Massa.', foto:'../../assets/photos/foto-50.jpg', precoLabel:'a partir de R$ 38'},
  ],
  'Doces':[
    {id:'nutella', nome:'Nutella com Morangos', tag:'Doce', desc:'Nutella generosa e morangos frescos sobre massa fininha.', foto:'../../assets/photos/foto-20.jpg', precoLabel:'a partir de R$ 38'},
    {id:'brie', nome:'Geleia de Pimenta com Brie', desc:'Queijo brie derretido e geleia de pimenta artesanal. Agridoce na medida.', foto:'../../assets/photos/foto-80.jpg', precoLabel:'a partir de R$ 38'},
  ],
  'Bebidas':[
    {id:'guarana', nome:'Guaraná Antárctica 1,5L', desc:'Geladinho.', preco:'12,00'},
    {id:'refri2l', nome:'Refrigerante 2L', desc:'Coca-Cola, Fanta ou Sprite.', preco:'18,00'},
    {id:'longneck', nome:'Cerveja Long Neck', desc:'Heineken, Budweiser, Stella.', precoLabel:'a partir de R$ 12'},
    {id:'agua', nome:'Água com / sem Gás', desc:'500ml.', preco:'3,50'},
  ],
};

/* ---- Tela de detalhe do sabor ---- */
function FlavorDetail({item, onClose, onAdd}){
  const [tam, setTam] = useState('grande');
  const t = TAMANHOS.find(x=>x.id===tam);
  return (
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',justifyContent:'center',background:'rgba(0,0,0,.5)'}}>
     <div style={{width:'min(440px,100%)',background:SUP.carvao,display:'flex',flexDirection:'column',animation:'sheetUp .28s cubic-bezier(.2,.7,.3,1)',height:'100%'}}>
      <div style={{position:'relative',height:280,flexShrink:0}}>
        <img src={item.foto} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(15,15,15,.3),transparent 30%,rgba(15,15,15,.95))'}}></div>
        <button onClick={onClose} style={{position:'absolute',top:14,left:14,width:42,height:42,borderRadius:999,
          background:'rgba(0,0,0,.5)',border:'none',color:'#fff',cursor:'pointer',display:'grid',placeItems:'center',backdropFilter:'blur(6px)'}}><BackIcon/></button>
        <div style={{position:'absolute',left:20,right:20,bottom:16}}>
          {item.tag && <span style={{fontSize:10,fontWeight:700,letterSpacing:'.16em',textTransform:'uppercase',
            color:SUP.vermelhoLt,background:'rgba(214,40,40,.2)',padding:'4px 10px',borderRadius:7}}>{item.tag}</span>}
          <div style={{fontWeight:800,fontSize:28,textTransform:'uppercase',lineHeight:1.05,marginTop:8,color:'#fff'}}>{item.nome}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'18px 20px'}}>
        <p style={{color:SUP.cinza,fontSize:14.5,lineHeight:1.6,margin:'0 0 20px'}}>{item.desc}</p>
        <div style={{fontSize:11,fontWeight:600,letterSpacing:'.16em',textTransform:'uppercase',color:'#fff',marginBottom:12}}>Escolha o tamanho</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {TAMANHOS.map(x=>(
            <button key={x.id} onClick={()=>setTam(x.id)} style={{display:'flex',alignItems:'center',gap:12,width:'100%',textAlign:'left',
              background:tam===x.id?'rgba(214,40,40,.1)':SUP.grafite,
              border:`1.5px solid ${tam===x.id?SUP.vermelho:SUP.linha}`,borderRadius:14,padding:'14px 16px',cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>
              <span style={{width:20,height:20,borderRadius:999,border:`2px solid ${tam===x.id?SUP.vermelho:SUP.cinzaEsc}`,
                display:'grid',placeItems:'center',flexShrink:0}}>
                {tam===x.id && <span style={{width:9,height:9,borderRadius:999,background:SUP.vermelho}}></span>}
              </span>
              <span style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:15,color:'#fff'}}>{x.nome}</div>
                <div style={{fontSize:12,color:SUP.cinza}}>{x.det}</div>
              </span>
              <span style={{fontWeight:700,color:SUP.vermelho,fontSize:15}}>R$ {x.preco}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:'14px 20px 20px',borderTop:`1px solid ${SUP.linha}`,flexShrink:0}}>
        <button onClick={()=>onAdd(item,t)} style={{width:'100%',background:SUP.vermelho,color:'#fff',border:'none',
          borderRadius:14,padding:'16px',fontWeight:700,fontSize:15,cursor:'pointer',fontFamily:'Poppins,sans-serif',
          display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span>Adicionar à sacola</span><span>R$ {t.preco},00</span>
        </button>
      </div>
     </div>
    </div>
  );
}

/* ---- Sacola ---- */
function BagSheet({items, onClose, onClear}){
  const total = items.reduce((s,i)=>s+i.tam.preco,0);
  return (
    <div style={{position:'fixed',inset:0,zIndex:110,display:'flex',justifyContent:'center'}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(0,0,0,.6)'}}></div>
      <div style={{position:'absolute',left:'50%',transform:'translateX(-50%)',bottom:0,width:'min(440px,100%)',background:SUP.grafite,borderRadius:'22px 22px 0 0',
        maxHeight:'82%',display:'flex',flexDirection:'column',animation:'sheetUp .3s cubic-bezier(.2,.7,.3,1)',
        boxShadow:'0 -18px 48px rgba(0,0,0,.6)'}}>
        <div style={{padding:'18px 20px 12px',display:'flex',alignItems:'center',borderBottom:`1px solid ${SUP.linha}`}}>
          <div style={{fontWeight:800,fontSize:20,textTransform:'uppercase',color:'#fff'}}>Sua sacola</div>
          <button onClick={onClose} style={{marginLeft:'auto',background:'none',border:'none',color:SUP.cinza,cursor:'pointer'}}><CloseIcon/></button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:'6px 20px'}}>
          {items.length===0 && <div style={{padding:'40px 0',textAlign:'center',color:SUP.cinzaEsc}}>Sua sacola está vazia.<br/>Bora escolher uma pizza?</div>}
          {items.map((i,idx)=>(
            <div key={idx} style={{display:'flex',gap:12,padding:'14px 0',borderBottom:`1px solid ${SUP.linha}`,alignItems:'center'}}>
              {i.foto && <img src={i.foto} alt="" style={{width:52,height:52,borderRadius:10,objectFit:'cover'}}/>}
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14.5,color:'#fff'}}>{i.nome}</div>
                <div style={{fontSize:12,color:SUP.cinza}}>{i.tam.nome} · {i.tam.det.split('·')[0]}</div>
              </div>
              <div style={{fontWeight:700,color:SUP.vermelho}}>R$ {i.tam.preco}</div>
            </div>
          ))}
        </div>
        {items.length>0 && <div style={{padding:'14px 20px 22px',borderTop:`1px solid ${SUP.linha}`}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:12,color:SUP.cinza,fontSize:13}}>
            <span>Entrega</span><span>R$ 6,90</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16,fontWeight:800,fontSize:18,color:'#fff'}}>
            <span>Total</span><span>R$ {total+6},90</span>
          </div>
          <button style={{width:'100%',background:SUP.vermelho,color:'#fff',border:'none',borderRadius:14,padding:'16px',
            fontWeight:700,fontSize:15,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Fechar pedido no WhatsApp</button>
          <button onClick={onClear} style={{width:'100%',background:'none',color:SUP.cinzaEsc,border:'none',padding:'12px',
            fontSize:13,cursor:'pointer',fontFamily:'Poppins,sans-serif'}}>Limpar sacola</button>
        </div>}
      </div>
    </div>
  );
}

/* ---- App raiz ---- */
function App(){
  const [cat, setCat] = useState('Destaques');
  const [detail, setDetail] = useState(null);
  const [bag, setBag] = useState([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const add = (item, tam)=>{
    setBag(b=>[...b,{nome:item.nome,foto:item.foto,tam}]);
    setDetail(null);
    setToast(`${item.nome} adicionada`);
    setTimeout(()=>setToast(null),1800);
  };

  return (
    <div style={{position:'relative',width:'100%',maxWidth:440,margin:'0 auto',minHeight:'100vh',
      background:SUP.carvao,overflow:'hidden',boxShadow:'0 0 80px rgba(0,0,0,.6)'}}>
      <TopBar onBag={()=>setBagOpen(true)} bagCount={bag.length}/>
      <DeliveryHero/>
      <CategoryChips cats={Object.keys(MENU)} active={cat} onPick={setCat}/>
      <div style={{paddingBottom:90}}>
        {MENU[cat].map(item=> <MenuRow key={item.id} item={item} onOpen={i=> i.foto ? setDetail(i) : add(i,{nome:'Un',det:'·',preco:parseInt(i.preco)||12})}/>)}
      </div>

      {bag.length>0 && !bagOpen && !detail &&
        <button onClick={()=>setBagOpen(true)} style={{position:'fixed',left:'50%',transform:'translateX(-50%)',bottom:18,
          width:'min(404px,90%)',background:SUP.vermelho,color:'#fff',border:'none',borderRadius:14,padding:'15px 20px',
          fontWeight:700,fontSize:15,cursor:'pointer',fontFamily:'Poppins,sans-serif',display:'flex',justifyContent:'space-between',
          boxShadow:'0 10px 30px rgba(214,40,40,.35)',zIndex:30}}>
          <span>Ver sacola · {bag.length} {bag.length>1?'itens':'item'}</span>
          <span>R$ {bag.reduce((s,i)=>s+i.tam.preco,0)},00</span>
        </button>}

      {detail && <FlavorDetail item={detail} onClose={()=>setDetail(null)} onAdd={add}/>}
      {bagOpen && <BagSheet items={bag} onClose={()=>setBagOpen(false)} onClear={()=>{setBag([]);setBagOpen(false);}}/>}

      {toast && <div style={{position:'fixed',left:'50%',transform:'translateX(-50%)',bottom:84,background:'#fff',color:'#0F0F0F',
        fontWeight:700,fontSize:13,padding:'10px 20px',borderRadius:999,zIndex:60,boxShadow:'0 8px 24px rgba(0,0,0,.4)'}}>{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
