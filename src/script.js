import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { getCardinalPoints } from './utils'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    labelRenderer.setSize(sizes.width, sizes.height)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
camera.layers.enableAll();
camera.layers.toggle(2);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Planet
 */

const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('8k_earth_nightmap.jpg')
})
const planet = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1, 30, 30),
    material
)
scene.add(planet)

// Add Pin
function calcPosFromLatLngRad(lat, lng) {
    const phi = (90-lat)*(Math.PI/180)
    const theta = (lng+180)*(Math.PI/180)
    const x = -(Math.sin(phi)*Math.cos(theta))
    const y = Math.cos(phi)
    const z = (Math.sin(phi)*Math.sin(theta))
    return {x, y, z}
}

document.querySelectorAll(".pins > *").forEach(p => {
    const coords = p.querySelector('.coord').innerText.replace(/\s/g, '').split(',')
    const lat = Number(coords[0])
    const lng = Number(coords[1])

    console.log({lat, lng})
    const pos = calcPosFromLatLngRad(lat, lng)

    const point = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(0.01, 0.01, 1, 1)
    )
    point.layers.enableAll()
    point.position.set(pos.x, pos.y, pos.z)
    point.layers.enableAll()
    scene.add(point)

    const mark = new CSS2DObject(p);
    mark.position.set(0, 0, 0);
    point.add(mark);
    mark.layers.set(0);
})

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(sizes.width, sizes.height);
labelRenderer.domElement.setAttribute("id", "labels");
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.querySelector('.container').prepend( labelRenderer.domElement );


/**
 * Animate
 */

const raycaster = new THREE.Raycaster()
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    labelRenderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()