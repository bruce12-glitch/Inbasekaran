const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.getElementById('character-motion');
const cards = [...document.querySelectorAll('[data-character]')];
const sources = {research:'#research .section-subtitle',awards:'#awards .timeline-sub',writing:'#writing .entry-desc',contact:'#contact > p:not(.eyebrow)'};
let paused = reduced.matches;
const instances = [];
function updateMotion() {
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.textContent = paused ? 'Play character motion' : 'Pause character motion';
  instances.forEach(item => item.lottie?.stop());
}
motionButton.addEventListener('click', () => {paused = !paused;updateMotion();});
reduced.addEventListener('change', () => {paused = reduced.matches;updateMotion();});
updateMotion();
for (const card of cards) {
  const key = card.dataset.character;
  card.querySelector('.character-panel p').textContent = document.querySelector(sources[key]).textContent.trim().replace(/\s+/g,' ');
  card.querySelector('button').addEventListener('click', () => {
    const target = document.getElementById(key);
    document.querySelectorAll('.character-highlighted').forEach(el => el.classList.remove('character-highlighted'));
    target.classList.add('character-highlighted');
    target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
    target.setAttribute('tabindex','-1');target.focus({preventScroll:true});
    setTimeout(() => {target.classList.remove('character-highlighted');target.removeAttribute('tabindex');},3500);
  });
}
// Original, decorative Lottie sparkle: play once on pointer or keyboard entry.
function sparkleData() {
  const dot=(x,y)=>({ty:'gr',it:[{ty:'el',p:{a:0,k:[x,y]},s:{a:0,k:[5,5]},d:1},{ty:'fl',c:{a:0,k:[.34,.27,.83,1]},o:{a:0,k:100},r:1},{ty:'tr',p:{a:0,k:[0,0]},a:{a:0,k:[0,0]},s:{a:0,k:[100,100]},r:{a:0,k:0},o:{a:0,k:100},sk:{a:0,k:0},sa:{a:0,k:0}}]});
  return {v:'5.7.4',fr:30,ip:0,op:30,w:200,h:200,nm:'Original portfolio sparkle',ddd:0,assets:[],layers:[{ddd:0,ind:1,ty:4,nm:'Sparkles',sr:1,ks:{o:{a:1,k:[{t:0,s:[0],e:[100],i:{x:[.67],y:[1]},o:{x:[.33],y:[0]}},{t:10,s:[100],e:[0],i:{x:[.67],y:[1]},o:{x:[.33],y:[0]}},{t:30,s:[0]}]},r:{a:0,k:0},p:{a:0,k:[100,100,0]},a:{a:0,k:[100,100,0]},s:{a:0,k:[100,100,100]}},ao:0,shapes:[dot(32,45),dot(165,40),dot(170,150)],ip:0,op:30,st:0,bm:0}]};
}
try {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js');
  for (const card of cards) {
    try { mountCharacter(THREE,card); } catch (error) { console.warn('Static mascot retained:',error.message); }
  }
} catch (error) { console.warn('3D unavailable; static mascot illustrations retained.',error.message); }
function mountCharacter(T,card) {
  const stage=card.querySelector('.character-stage'),key=card.dataset.character;
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,100);camera.position.set(0,1,8);camera.lookAt(0,.4,0);
  scene.add(new T.HemisphereLight(0xffffff,0x8c7c99,2.8));const light=new T.DirectionalLight(0xffffff,4);light.position.set(-3,5,6);scene.add(light);
  const figure=new T.Group();scene.add(figure);figure.rotation.y=-.22;
  const palette={research:0xbac8ed,awards:0xf2d888,writing:0xefbaa4,contact:0xb5d9c3};
  const clay=new T.MeshStandardMaterial({color:palette[key],roughness:.63});const ink=new T.MeshStandardMaterial({color:0x302d39,roughness:.7});const white=new T.MeshStandardMaterial({color:0xfffcf5,roughness:.55});const gold=new T.MeshStandardMaterial({color:0xd7a952,metalness:.35,roughness:.35});
  const mesh=(g,m,x,y,z,sx=1,sy=1,sz=1)=>{const obj=new T.Mesh(g,m);obj.position.set(x,y,z);obj.scale.set(sx,sy,sz);figure.add(obj);return obj;};
  const ball=(m,x,y,z,sx,sy=sx,sz=sx)=>mesh(new T.SphereGeometry(1,32,24),m,x,y,z,sx,sy,sz);
  ball(clay,0,-.2,0,.65,.8,.45);ball(clay,0,.95,0,.74,.67,.6);
  for(const side of [-1,1]){ball(clay,side*.72,-.12,.07,.2,.45,.23).rotation.z=side*.35;ball(ink,side*.34,-.94,.17,.27,.16,.35);ball(clay,side*.75,.95,0,.14,.18,.17);}
  const eyes=[-1,1].map(side=>ball(ink,side*.23,1.02,.56,.064,.09,.05));
  ball(white,-.025,.83,.59,.13,.035,.03);
  // Small articulated joints, lapel, buttons, and satchel give the clay figure depth.
  ball(white,0,.02,.45,.19,.25,.035);for(const y of [-.15,-.35])ball(ink,.32,y,.42,.035);
  if(key==='research'){
    mesh(new T.TorusGeometry(.28,.045,12,40),gold,.9,.43,.6);const handle=mesh(new T.CylinderGeometry(.045,.045,.42,16),ink,1.08,.12,.6);handle.rotation.z=.6;
    ball(white,0,1.52,0,.78,.11,.65);
  } else if(key==='awards'){
    mesh(new T.CylinderGeometry(.26,.12,.4,32),gold,.7,.2,.67);mesh(new T.CylinderGeometry(.045,.045,.28,16),gold,.7,-.12,.67);mesh(new T.BoxGeometry(.5,.08,.28),gold,.7,-.29,.67);
    for(const side of [-1,1])mesh(new T.TorusGeometry(.17,.035,10,24),gold,.7+side*.24,.21,.67);
    const crown=mesh(new T.CylinderGeometry(.45,.38,.16,6),gold,0,1.56,0);crown.rotation.y=.3;
  } else if(key==='writing'){
    const book=mesh(new T.BoxGeometry(.68,.48,.16),white,-.35,-.12,.64);book.rotation.z=.18;
    mesh(new T.BoxGeometry(.08,.5,.19),clay,-.66,-.12,.64);
    const pen=mesh(new T.CylinderGeometry(.06,.06,.94,6),gold,.78,.26,.58);pen.rotation.z=-.35;mesh(new T.ConeGeometry(.065,.16,6),ink,.94,.72,.58).rotation.z=-.35;
    mesh(new T.TorusGeometry(.16,.025,8,24),ink,-.23,1.02,.6);mesh(new T.TorusGeometry(.16,.025,8,24),ink,.23,1.02,.6);
  } else {
    mesh(new T.BoxGeometry(.95,.58,.12),white,0,-.18,.65);
    for(const side of [-1,1]){const fold=mesh(new T.BoxGeometry(.53,.025,.025),clay,side*.23,-.1,.73);fold.rotation.z=side*.55;}
    ball(gold,.65,1.5,0,.12);mesh(new T.CylinderGeometry(.025,.025,.4,12),ink,.65,1.3,0);
  }
  let hover=false,visible=false,raf=0,disposed=false;
  let lottieAnimation;
  if(window.lottie){lottieAnimation=window.lottie.loadAnimation({container:card.querySelector('.character-lottie'),renderer:'svg',loop:false,autoplay:false,animationData:sparkleData()});}
  const item={lottie:lottieAnimation};instances.push(item);
  const resize=new ResizeObserver(()=>{renderer.setSize(stage.clientWidth,stage.clientHeight);camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();});resize.observe(stage);
  stage.appendChild(renderer.domElement);card.querySelector('.character-fallback').hidden=true;
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!raf)tick(0);});observer.observe(stage);
  function tick(ms){if(disposed)return;const t=ms/1000;if(!paused&&!reduced.matches){figure.position.y=Math.sin(t*1.6)*.055;figure.rotation.y=(hover?.15:-.22)+Math.sin(t*.7)*.06;eyes.forEach(eye=>eye.scale.y=(t%4.8<.13?.014:.09));}else{figure.position.y=0;figure.rotation.y=-.22;eyes.forEach(eye=>eye.scale.y=.09);}renderer.render(scene,camera);raf=visible&&!document.hidden?requestAnimationFrame(tick):0;}
  const enter=()=>{hover=true;if(!paused&&!reduced.matches)lottieAnimation?.goToAndPlay(0,true);};
  card.addEventListener('pointerenter',enter);card.addEventListener('pointerleave',()=>hover=false);card.addEventListener('focusin',enter);card.addEventListener('focusout',()=>hover=false);
  const visibility=()=>{if(!document.hidden&&visible&&!raf)tick(0);};document.addEventListener('visibilitychange',visibility);
  window.addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(raf);observer.disconnect();resize.disconnect();document.removeEventListener('visibilitychange',visibility);lottieAnimation?.destroy();scene.traverse(obj=>{obj.geometry?.dispose();if(obj.material)obj.material.dispose();});renderer.dispose();},{once:true});
}
