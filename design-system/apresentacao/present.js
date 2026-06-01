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

  // copiar HEX
  function toast(msg){
    var t = document.getElementById('toast');
    if(!t){ t = document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._t); t._t = setTimeout(function(){ t.classList.remove('show'); }, 1600);
  }
  document.querySelectorAll('.pc[data-hex]').forEach(function(pc){
    pc.addEventListener('click', function(){
      var hex = pc.getAttribute('data-hex');
      navigator.clipboard && navigator.clipboard.writeText(hex);
      toast(hex + ' copiado');
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
