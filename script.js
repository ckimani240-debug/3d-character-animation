const scene = new THREE.Scene();

scene.background = new THREE.Color(0x111111);



// CAMERA

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.set(0,1.6,4);

camera.lookAt(0,1,0);



// RENDERER

const renderer = new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.setPixelRatio(
Math.min(window.devicePixelRatio,2)
);

document.body.appendChild(
renderer.domElement
);



// LIGHTS

const hemiLight = new THREE.HemisphereLight(
0xffffff,
0x444444,
2.5
);

scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(
0xffffff,
1.5
);

dirLight.position.set(5,10,5);

scene.add(dirLight);



// FLOOR

const floor = new THREE.Mesh(

new THREE.PlaneGeometry(20,20),

new THREE.MeshStandardMaterial({
color:0x444444
})

);

floor.rotation.x = -Math.PI / 2;

floor.position.y = -2;

scene.add(floor);



// MODEL VARIABLES

let model;

let mixer;



// GLTF LOADER

const loader = new THREE.GLTFLoader();

loader.load(

'./models/character.glb',

function(gltf){

console.log("MODEL LOADED");

model = gltf.scene;

scene.add(model);



// NORMAL CHARACTER SIZE

model.scale.set(
1,
1,
1
);



// POSITION

model.position.set(
0,
-1,
0
);



// FACE CAMERA

model.rotation.y = Math.PI;



// FIX MATERIALS

model.traverse((child)=>{

if(child.isMesh){

child.castShadow = true;

child.receiveShadow = true;

if(child.material){

child.material.side =
THREE.DoubleSide;

}

}

});



// PLAY MIXAMO ANIMATION

if(gltf.animations.length > 0){

mixer =
new THREE.AnimationMixer(model);

const action =
mixer.clipAction(
gltf.animations[0]
);

action.play();

}

},

undefined,

function(error){

console.error(error);

}

);



// CLOCK

const clock = new THREE.Clock();



// ANIMATION LOOP

function animate(){

requestAnimationFrame(animate);

const delta = clock.getDelta();



// UPDATE MIXAMO ANIMATION

if(mixer){

mixer.update(delta);

}



// NATURAL SPEAKING MOTION

if(model){

const time = Date.now() * 0.0015;



// LIGHT HEAD SWAY

model.rotation.y =
Math.PI + Math.sin(time * 2) * 0.03;



// TALKING EFFECT

model.rotation.x =
Math.sin(time * 5) * 0.01;



// SMALL GIGGLE MOTION

model.rotation.z =
Math.sin(time * 4) * 0.005;

}



renderer.render(
scene,
camera
);

}

animate();



// RESPONSIVE RESIZE

window.addEventListener(

'resize',

()=>{

camera.aspect =
window.innerWidth /
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

}

);