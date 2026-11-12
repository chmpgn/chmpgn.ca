(function(){
var L='fr';
function render(){var en=L==='en',n=document.querySelectorAll('[data-en]'),i;
 for(i=0;i<n.length;i++){if(n[i].dataset.fr==null)n[i].dataset.fr=n[i].innerHTML;n[i].innerHTML=en?n[i].dataset.en:n[i].dataset.fr}
 document.documentElement.lang=en?'en':'fr-CA';
 document.getElementById('lang-fr').setAttribute('aria-pressed',String(!en));
 document.getElementById('lang-en').setAttribute('aria-pressed',String(en));
 label()}
function setLang(l){L=l;try{localStorage.setItem('chmpgn-lang',l)}catch(e){}render()}
document.getElementById('lang-fr').onclick=function(){setLang('fr')};
document.getElementById('lang-en').onclick=function(){setLang('en')};

/* ---- accès privé ---- */
var open=document.getElementById('gate-open'),form=document.getElementById('gate'),pass=document.getElementById('gate-pass'),msg=document.getElementById('gate-msg'),inside=false;
function label(){open.textContent=inside?(L==='en'?'Enter the site':'Entrer dans le site'):(L==='en'?'Private access':'Accès privé')}
function go(){location.href=window.Gate.home+(L==='en'?'#en':'')}
function say(fr,en){msg.textContent=L==='en'?en:fr;msg.hidden=false}
if(window.Gate&&window.crypto&&crypto.subtle)window.Gate.check().then(function(ok){inside=ok;label()});
open.onclick=function(){if(inside)return go();form.hidden=!form.hidden;if(!form.hidden)pass.focus()};
form.addEventListener('submit',function(e){e.preventDefault();
 if(!(window.Gate&&window.crypto&&crypto.subtle))return say('Ce navigateur ne permet pas la connexion sécurisée.','This browser does not support secure sign-in.');
 if(!pass.value)return say('Entrez le mot de passe.','Enter the password.');
 say('Vérification…','Checking…');
 window.Gate.login(pass.value).then(go,function(){say('Mot de passe incorrect.','Incorrect password.');pass.select()})});

/* ---- maison 3D : alterne entre l'état actuel et le redesign ---- */
var cv=document.getElementById('house');
if(cv){(function(){
 var cx=cv.getContext('2d'),ang=-0.65,t=0,target=0,drag=null,tick=0,auto=!matchMedia('(prefers-reduced-motion: reduce)').matches;
 function box(x0,x1,y0,y1,z0,z1){var p=[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],e=[];
  [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(function(q){e.push([p[q[0]],p[q[1]]])});return e}
 function rz(x0,x1,y0,y1,z){return [[[x0,y0,z],[x1,y0,z]],[[x1,y0,z],[x1,y1,z]],[[x1,y1,z],[x0,y1,z]],[[x0,y1,z],[x0,y0,z]]]}
 var base=box(-1,1,0,1,-.7,.7).concat([[[-1,1.6,0],[1,1.6,0]],[[-1,1,-.7],[-1,1.6,0]],[[-1,1,.7],[-1,1.6,0]],[[1,1,-.7],[1,1.6,0]],[[1,1,.7],[1,1.6,0]]],
  rz(-.15,.15,0,.55,.7),rz(-.78,-.42,.4,.78,.7),rz(.42,.78,.4,.78,.7));
 var add=box(1,1.9,0,.85,-.7,.35).concat(rz(1.12,1.78,.08,.72,.35),
  [[[1,.02,.35],[1,.02,1.15]],[[1,.02,1.15],[1.9,.02,1.15]],[[1.9,.02,1.15],[1.9,.02,.35]]],
  rz(-.3,.3,1.05,1.3,.42),[[[-.3,1.3,.42],[-.3,1.3,.2]],[[.3,1.3,.42],[.3,1.3,.2]]]);
 if(!auto){t=target=1}
 function frame(){
  var d=Math.min(devicePixelRatio||1,2),w=cv.clientWidth,h=cv.clientHeight;
  if(cv.width!==Math.round(w*d)){cv.width=Math.round(w*d);cv.height=Math.round(h*d)}cx.setTransform(d,0,0,d,0,0);
  var cs=getComputedStyle(cv),ink=cs.color,acc=cs.getPropertyValue('--hl').trim()||ink,line=cs.getPropertyValue('--dot').trim()||ink;
  if(auto){if(++tick%360===0)target=1-target;t+=(target-t)*.05;if(!drag)ang+=.003}
  var S=Math.min(w,h)*.3,ca=Math.cos(ang),sa=Math.sin(ang),cp=Math.cos(.38),sp=Math.sin(.38);
  function P(v){var x=v[0]-.45*t,y=v[1]-.65,z=v[2],X=x*ca+z*sa,Z=-x*sa+z*ca,Y=y*cp-Z*sp,Z2=y*sp+Z*cp,k=S*5/(5+Z2);return [w/2+X*k,h/2-Y*k]}
  cx.clearRect(0,0,w,h);cx.fillStyle=line;
  for(var gx=-2.4;gx<=3.3;gx+=.4)for(var gz=-2;gz<=2.01;gz+=.4){var g=P([gx,0,gz]);cx.beginPath();cx.arc(g[0],g[1],1.3,0,6.3);cx.fill()}
  cx.lineCap='round';cx.lineWidth=1.6;cx.strokeStyle=ink;cx.beginPath();
  base.forEach(function(e){var a=P(e[0]),b=P(e[1]);cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1])});cx.stroke();
  if(t>.01){cx.globalAlpha=Math.min(1,t*1.4);cx.strokeStyle=acc;cx.lineWidth=2.2;cx.beginPath();
   add.forEach(function(e){function m(v){return v[0]>=1?[1+(v[0]-1)*t,v[1]*t,v[2]]:[v[0],1.05+(v[1]-1.05)*t,v[2]]}
    var a=P(m(e[0])),b=P(m(e[1]));cx.moveTo(a[0],a[1]);cx.lineTo(b[0],b[1])});cx.stroke();cx.globalAlpha=1}
  if(auto)requestAnimationFrame(frame);
 }
 cv.addEventListener('pointerdown',function(e){drag={x:e.clientX,a:ang};cv.setPointerCapture(e.pointerId)});
 cv.addEventListener('pointermove',function(e){if(drag){ang=drag.a+(e.clientX-drag.x)*.01;if(!auto)requestAnimationFrame(frame)}});
 function up(){drag=null}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 addEventListener('resize',function(){if(!auto)requestAnimationFrame(frame)});
 requestAnimationFrame(frame);
})()}

try{var sv=localStorage.getItem('chmpgn-lang');if(sv==='en'||sv==='fr')L=sv}catch(e){}
if(location.hash==='#en')L='en';
render();
})();
