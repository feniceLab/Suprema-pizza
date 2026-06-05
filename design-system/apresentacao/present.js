/* Suprema Pizza · Apresentação — comportamento compartilhado */
(function(){
  // barra de progresso
  var prog = document.getElementById('prog');
  function onScroll(){
    if(!prog) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    prog.style.width = (max>0 ? (h.scrollTop/max*100) : 0) + '%';
  }
  document.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // reveal on scroll
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

  // toast util
  function toast(msg){
    var t = document.getElementById('toast');
    if(!t){ t = document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function(){ t.classList.remove('show'); }, 1600);
  }
  function copy(text){
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text);
    } else {
      var ta=document.createElement('textarea'); ta.value=text;
      ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta);
      ta.select(); try{ document.execCommand('copy'); }catch(e){} document.body.removeChild(ta);
    }
  }

  // copiar HEX (card de cor inteiro)
  document.querySelectorAll('.pc[data-hex]').forEach(function(pc){
    pc.addEventListener('click', function(){
      var hex = pc.getAttribute('data-hex');
      copy(hex); toast(hex + ' copiado');
    });
  });

  // copiar TOKEN CSS — generalizado p/ [data-token]; stopPropagation p/ nao disparar o HEX do card pai
  document.querySelectorAll('[data-token]').forEach(function(el){
    // so vira clicavel quem nao for o proprio .pc (o .pc ja copia HEX)
    if(el.classList.contains('pc')) return;
    el.addEventListener('click', function(ev){
      ev.stopPropagation();
      var tk = el.getAttribute('data-token');
      copy(tk); toast(tk + ' copiado');
    });
  });

  // copiar COPY (banco de copys 9:16) — texto multilinha via data-copy
  document.querySelectorAll('[data-copy]').forEach(function(el){
    el.addEventListener('click', function(ev){
      ev.stopPropagation();
      var tx = el.getAttribute('data-copy');
      copy(tx); toast('copy copiada');
    });
  });
})();

/* scroll-spy do índice lateral (.ds-toc) — só ativa onde o aside existe */
(function(){
  var toc=document.querySelector('.ds-toc'); if(!toc) return;
  var links={}; toc.querySelectorAll('a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a;});
  var spy=new IntersectionObserver(function(es){
    es.forEach(function(e){ var a=links[e.target.id];
      if(a && e.isIntersecting){ toc.querySelectorAll('a.active').forEach(function(x){x.classList.remove('active');}); a.classList.add('active'); }
    });
  },{rootMargin:'-30% 0px -60% 0px',threshold:0});
  document.querySelectorAll('section[id]').forEach(function(s){spy.observe(s);});
})();
