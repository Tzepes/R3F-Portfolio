import './style.css'
import * as THREE from 'three'
import {useRef} from 'react'
import {useThree, useLoader, useFrame} from '@react-three/fiber'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {Text, TransformControls} from '@react-three/drei'
import TWEEN from '@tweenjs/tween.js'

export default function Experience() {

    let loaded = false;
    const loadingManager = new THREE.LoadingManager(
        //Loaded
        () =>{
            OrientObjectOnSphere(infMeshRef, infMeshPos.x, infMeshPos.y, infMeshPos.z);
            loaded = true;
        },
        //Progress
        () => {

        }
    )
    
    //Camera
    const {camera} = useThree();
	camera.position.x = 1;   
    camera.position.y = 5
    camera.position.z = 45;  
    camera.rotation.x = 0.7;    

    const planet = useLoader(GLTFLoader, './low_poly_planet/lowPolPlanet.glb')
    const apartmentBlocks = useLoader(GLTFLoader, './cartoon_lowpoly_panel_city_house.glb')
    const projectsBuilding = useLoader(GLTFLoader, './low_poly_sci-fi_lab.glb')
    const antenaBuilding = useLoader(GLTFLoader, './antena.glb')

    const infMeshRef = useRef();
    const projMeshRef = useRef();
    const edRefMesh = useRef();
    const infMeshPos = sphereCoords(20, 50, 40)
    const projMeshPos = sphereCoords(20, 120, 40)
    const edMeshPos = sphereCoords(25, 80, 40)

   
    const homePageGroup = useRef();
    const textRef = useRef();

    // Function to toggle visibility of the group
    const toggleVisibility = () => {
        if (homePageGroup.current) {
            homePageGroup.current.visible = !homePageGroup.current.visible;
        }
    };

    let lerpVect = new THREE.Vector3(1, 5, 45);
    var startCamRot = new THREE.Euler().copy(camera.rotation);
    let zoomed = false;
    const informationClick = () =>{
        if(!zoomed){
            lerpVect = new THREE.Vector3(8, 8, 40);
            setTweenRot(0.8, -0.2, -0.2)
            zoomed = true;
        } else {
            lerpVect = new THREE.Vector3(1, 5, 45)
            setTweenRot(startCamRot.x, startCamRot.y, startCamRot.z);
            zoomed = false;
        }
    }

    const projectsClick = () =>{
        if(!zoomed){
            lerpVect = new THREE.Vector3(-5, 10, 40);
            setTweenRot(0.7, 0.5, 0.4)
            zoomed = true;
        } else {
            lerpVect = new THREE.Vector3(1, 5, 45)
            setTweenRot(startCamRot.x, startCamRot.y, startCamRot.z);
            zoomed = false;
        }
    }

    const educationClick = () =>{
        if(!zoomed){
            lerpVect = new THREE.Vector3(2, 14, 39);
            setTweenRot( 0.8, -0.2, -0.1)
            zoomed = true;
        } else {
            lerpVect = new THREE.Vector3(1, 5, 45)
            setTweenRot(startCamRot.x, startCamRot.y, startCamRot.z);
            zoomed = false;
        }
    }

    window.addEventListener("wheel", (event) => {
        switch(event.deltaY){
            case 100:
                lerpVect = new THREE.Vector3(1, 5, 45)
                setTweenRot(startCamRot.x, startCamRot.y, startCamRot.z);
                zoomed = false;
        }
    });

    function setTweenRot(Rx, Rz, Ry){
        
        new TWEEN.Tween(camera.rotation)
            .to({
                x: Rx,
                y: Ry,
                z: Rz
            }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    useFrame(()=>{
        camera.position.lerp(lerpVect, 0.02)

        textRef.current.lookAt(camera.position);

        TWEEN.update();
    })

    function sphereCoords(lat, lng, r) {
        let theta = lat * Math.PI/180;
        let phi = lng * Math.PI/180;

        let x = (r * Math.sin(theta) * Math.cos(phi));
        let y = (r * Math.sin(theta) * Math.sin(phi));
        let z = (r * Math.cos(theta));

        return new THREE.Vector3(x, y, z);
    }

    function OrientObjectOnSphere(object, objX, objY, objZ){
        const normalVectors = new THREE.Vector3(objX, objY, objZ).normalize();
        object.current.lookAt(object.current.position.clone().add(normalVectors));
    }

    return <>

        <ambientLight intensity = {0.1}/>
        <directionalLight intensity={2}/>

        <group ref={homePageGroup}>
            <mesh ref={infMeshRef} position={[infMeshPos.x, infMeshPos.y, infMeshPos.z]} onClick={informationClick} visible={false}>
                <boxGeometry/>
            </mesh>

            <primitive object={apartmentBlocks.scene} 
                    position={[infMeshPos.x, infMeshPos.y, infMeshPos.z]} 
                    rotation={[1.4, 3.3, 0.2]}
                    scale={2}>
                <Text 
                    ref={textRef}
                    fontSize={0.3}
                    position={[0, 1.5, 0]}
                    rotation={[0, 2, 0]}
                    >
                    Information
                </Text>
            </primitive>

            <mesh ref={projMeshRef} position={[projMeshPos.x, projMeshPos.y, projMeshPos.z]} onClick={projectsClick}>
                <boxGeometry/>
                <meshBasicMaterial color="blue"/>
                <Text 
                    ref={textRef}
                    fontSize={0.6}
                    position={[0, 1.5, 1]}
                >
                    Projects
                </Text>
            </mesh>

            <primitive object={projectsBuilding.scene}
                position={[projMeshPos.x, projMeshPos.y + 0.2, projMeshPos.z + 0.1]}
                rotation={[1.0, 1.1, 0.3]}
                scale={0.15}
                >
            </primitive>

            <primitive object={antenaBuilding.scene}
                position={[projMeshPos.x + 1.5, projMeshPos.y + 0.7, projMeshPos.z]}
                rotation={[1.5, 3.9, 0.2]}
                scale={0.05}
                >
            </primitive>

            <mesh ref={edRefMesh} position={[edMeshPos.x, edMeshPos.y, edMeshPos.z]} onClick={educationClick}>
                <boxGeometry/>
                <meshBasicMaterial color="red"/>
                <Text 
                    ref={textRef}
                    fontSize={0.6}
                    position={[0, 3, 0]}
                >
                    Education
                </Text>
            </mesh>

            <primitive object={planet.scene} scale={11.2} rotation-y={5} rotation-x={-0.1}/>
        </group>
    </>
}   