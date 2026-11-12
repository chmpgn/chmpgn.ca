(function(){
var C={"salt": "3exNz1sHL67m5ihljoeyDQ==", "check": "UEJoIv3dWf54775CATndCI1A5zWH0cg4wTvBxF5AAzi9nQ==", "iter": 310000, "home": "accueil.html", "login": "index.html"};
function b2a(s){var b=atob(s),a=new Uint8Array(b.length);for(var i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return a}
function a2b(a){var s='';a=new Uint8Array(a);for(var i=0;i<a.length;i++)s+=String.fromCharCode(a[i]);return btoa(s)}
function imp(raw){return crypto.subtle.importKey('raw',raw,'AES-GCM',false,['decrypt'])}
function dec(key,d){d=d instanceof Uint8Array?d:b2a(d);return crypto.subtle.decrypt({name:'AES-GCM',iv:d.slice(0,12)},key,d.slice(12))}
function stored(){var k=null;try{k=localStorage.getItem('chmpgn-key')}catch(e){}if(!k)try{k=sessionStorage.getItem('chmpgn-key')}catch(e){}return k}
function load(){var k=stored();return k?imp(b2a(k)):null}
function save(v){var ok=false;try{localStorage.setItem('chmpgn-key',v);ok=true}catch(e){}try{sessionStorage.setItem('chmpgn-key',v);ok=true}catch(e){}return ok}
function logout(){try{localStorage.removeItem('chmpgn-key')}catch(e){}try{sessionStorage.removeItem('chmpgn-key')}catch(e){}}
function login(pass){return crypto.subtle.importKey('raw',new TextEncoder().encode(pass),'PBKDF2',false,['deriveBits'])
 .then(function(k){return crypto.subtle.deriveBits({name:'PBKDF2',salt:b2a(C.salt),iterations:C.iter,hash:'SHA-256'},k,256)})
 .then(function(bits){return imp(bits).then(function(key){return dec(key,C.check)}).then(function(){save(a2b(bits));return true})})}
function check(){var p=load();return p?p.then(function(k){return dec(k,C.check)}).then(function(){return true},function(){return false}):Promise.resolve(false)}
window.Gate={login:login,check:check,logout:logout,home:C.home};
var box=document.getElementById('enc');
if(box){var p=load();if(!p){location.replace(C.login);return}
 p.then(function(key){return dec(key,box.textContent.trim()).then(function(buf){
  document.body.insertAdjacentHTML('beforeend',new TextDecoder().decode(buf));
  var t=document.body.querySelector('title');if(t)document.title=t.textContent;
  [].forEach.call(document.querySelectorAll('img[data-enc]'),function(im){fetch(im.getAttribute('data-enc')).then(function(r){return r.arrayBuffer()}).then(function(b){return dec(key,new Uint8Array(b))}).then(function(b){im.src=URL.createObjectURL(new Blob([b],{type:'image/jpeg'}))})});
  return fetch('app.enc').then(function(r){return r.arrayBuffer()}).then(function(b){return dec(key,new Uint8Array(b))}).then(function(b){var s=document.createElement('script');s.src=URL.createObjectURL(new Blob([b],{type:'text/javascript'}));document.body.appendChild(s)})})
 }).catch(function(){logout();location.replace(C.login)})}
})();
