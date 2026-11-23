// Interactive Three.js hero scene. Gracefully degrades if the CDN is unavailable.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';

const canvas = document.querySelector('#hero3d');
const hero = document.querySelector('.hero');
if (canvas && hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setSize(hero.clientWidth, hero.clientHeight, false);
  renderer.setClearColor(0x08090d, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, hero.clientWidth / hero.clientHeight, .1, 100);
  camera.position.set(0, 0, 10);

  scene.add(new THREE.AmbientLight(0xb8c4ff, 1.4));
  const key = new THREE.PointLight(0xff604b, 24, 20); key.position.set(3, 2, 4); scene.add(key);
  const cool = new THREE.PointLight(0x8d82ff, 18, 18); cool.position.set(-4, -2, 3); scene.add(cool);

  const group = new THREE.Group(); group.position.set(2.05, .05, 0); scene.add(group);
  const knotGeo = new THREE.TorusKnotGeometry(1.23, .32, 180, 24, 2, 3);
  const knotMat = new THREE.MeshPhysicalMaterial({ color: 0xb6b2ca, metalness: .78, roughness: .2, clearcoat: 1, clearcoatRoughness: .12, emissive: 0x20131a, emissiveIntensity: .65 });
  const knot = new THREE.Mesh(knotGeo, knotMat); group.add(knot);

  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.1, .012, 8, 180), new THREE.MeshBasicMaterial({ color: 0xff604b, transparent: true, opacity: .7 }));
  halo.rotation.set(.85, .3, -.4); group.add(halo);
  const halo2 = new THREE.Mesh(new THREE.TorusGeometry(2.55, .008, 6, 180), new THREE.MeshBasicMaterial({ color: 0x9e96ff, transparent: true, opacity: .4 }));
  halo2.rotation.set(1.25, -.5, .35); group.add(halo2);

  // Network of glowing nodes around the central object.
  const nodes = [], positions = [];
  const nodeGeo = new THREE.SphereGeometry(.035, 10, 10);
  const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff765e });
  for (let i = 0; i < 54; i++) {
    const t = i * 2.399963, r = 2.2 + (i % 7) * .19;
    const x = Math.cos(t) * r, y = Math.sin(t * .83) * (1.45 + (i % 5) * .17), z = Math.sin(t) * r * .4;
    positions.push(new THREE.Vector3(x, y, z));
    const node = new THREE.Mesh(nodeGeo, nodeMat); node.position.set(x, y, z); group.add(node); nodes.push(node);
  }
  const linePositions = [];
  positions.forEach((p, i) => { for (let j = i + 1; j < positions.length; j++) if (p.distanceTo(positions[j]) < 1.05) { linePositions.push(p.x,p.y,p.z,positions[j].x,positions[j].y,positions[j].z); } });
  const netGeo = new THREE.BufferGeometry(); netGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  group.add(new THREE.LineSegments(netGeo, new THREE.LineBasicMaterial({ color: 0x827b9f, transparent: true, opacity: .18 })));

  // Sparse dust particles give the scene scale without a heavy texture.
  const dustCount = 550, dust = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) { dust[i*3] = (Math.random()-.5)*16; dust[i*3+1] = (Math.random()-.5)*9; dust[i*3+2] = (Math.random()-.5)*8; }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
  const dustPoints = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xb9b4ce, size: .012, transparent: true, opacity: .48 })); scene.add(dustPoints);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  hero.addEventListener('pointermove', e => { const b = hero.getBoundingClientRect(); pointer.tx = (e.clientX-b.left)/b.width-.5; pointer.ty = (e.clientY-b.top)/b.height-.5; }, { passive: true });
  hero.addEventListener('pointerleave', () => { pointer.tx = 0; pointer.ty = 0; }, { passive: true });
  let scrollY = 0; window.addEventListener('scroll', () => { scrollY = Math.min(window.scrollY / Math.max(hero.offsetHeight,1), 1); }, { passive: true });
  const clock = new THREE.Clock();
  function resize(){ const w=hero.clientWidth,h=hero.clientHeight; renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  new ResizeObserver(resize).observe(hero);
  function animate(){ requestAnimationFrame(animate); const t=clock.getElapsedTime(); pointer.x += (pointer.tx-pointer.x)*.035; pointer.y += (pointer.ty-pointer.y)*.035;
    knot.rotation.x = t*.12 + pointer.y*.22; knot.rotation.y = t*.19 + pointer.x*.35; knot.rotation.z = Math.sin(t*.16)*.12;
    group.rotation.y = pointer.x*.16; group.rotation.x = -pointer.y*.1; group.position.y = Math.sin(t*.45)*.11 - scrollY*.35;
    halo.rotation.z += .0018; halo2.rotation.x += .0011; dustPoints.rotation.y = t*.008;
    camera.position.x = pointer.x*.24; camera.position.y = -pointer.y*.16; camera.lookAt(0,0,0); renderer.render(scene,camera);
  }
  animate();
}
