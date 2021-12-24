import './style.css'

/**
 * 
 * Base
 */
// Canvas
//const canvas = document.querySelector('canvas.webgl')

//Scene
function init() {
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
        renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(renderer.domElement);
        camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
        camera.position.set(0,0,500);
        controls = new OrbitControls(camera, renderer.domElement);
        
        pointlight = new THREE.PointLight(0xffffff,1);
        pointlight.position.set(200,200,200);
        scene.add(pointlight);
        let ballGeo = new THREE.SphereGeometry(100,64,64);
        let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
        let ballMesh = new THREE.Mesh(ballGeo,ballMat);
        scene.add(ballMesh);
        animate(); // rendering loop
}


// Text
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) =>
    {
        // Material
        const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        // Text
        const textGeometry = new TextGeometry(
            'mariCoin',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)

        // Donuts
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64)

        for(let i = 0; i < 100; i++)
        {
            const donut = new THREE.Mesh(donutGeometry, material)
            donut.position.x = (Math.random() - 0.5) * 10
            donut.position.y = (Math.random() - 0.5) * 10
            donut.position.z = (Math.random() - 0.5) * 10
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
        }
    }
)
/**
 * Objects
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/4.jpg')
gradientTexture.magFilter = THREE.NearestFilter

// Material
const material = new THREE.MeshNormalMaterial({
    color: 0xffff00,
    gradientMap: gradientTexture,
    side: THREE.DoubleSide
})


// Objects
const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.3, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1, 0),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)
const mesh4 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.3, 16, 60),
    material
)
const mesh5 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh6 = new THREE.Mesh(
    new THREE.OctahedronGeometry(1, 0), 
    material
)

mesh1.position.x = 2
mesh2.position.x = - 2
mesh3.position.x = 2
mesh4.position.x = - 2
mesh5.position.x = 2
mesh6.position.x = - 2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
mesh4.position.y = - objectsDistance * 3
mesh5.position.y = - objectsDistance * 4
mesh6.position.y = - objectsDistance * 5

scene.add(mesh1, mesh2, mesh3, mesh4, mesh5, mesh6)

const sectionMeshes = [ mesh1, mesh2, mesh3, mesh4, mesh5, mesh6 ]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('FFC700', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Particles
 */
// Geometry
const particlesCount = 2000
const positions = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    positions[i * 3 + 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 4] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 5] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial ({
color: parameters.materialColor,
sizeAttenuation: true,
transparent: true,
alphaTest: 0.5,
size: 0.05  
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
})

// SMOOTH SCROLLING SECTIONS

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(36, sizes.width / sizes.height, 1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    transparent: true,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection)
    {
        currentSection = newSection

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=5',
                y: '+=3',
                z: '+=8.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()