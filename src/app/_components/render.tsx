"use client";
import React from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const loader = new GLTFLoader();
const clock = new THREE.Clock();

export default function Render() {
  const ref = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const mixerRef = React.useRef<THREE.AnimationMixer | null>(null);
  const animationsRef = React.useRef<THREE.AnimationClip[] | null>(null);
  const clipRef = React.useRef<THREE.AnimationClip | null>(null);
  const actionRef = React.useRef<THREE.AnimationAction | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);

  React.useEffect(() => {
    if (ref.current) {
      rendererRef.current = new THREE.WebGLRenderer();
      sceneRef.current = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      sceneRef.current.add(cube);
      camera.position.z = 5;
      sceneRef.current.background = new THREE.Color(0xffffff);
      sceneRef.current.add(camera);
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      ref.current.appendChild(rendererRef.current.domElement);
      rendererRef.current.setAnimationLoop(() => {
        if (!sceneRef.current) return;
        rendererRef.current?.render(sceneRef.current, camera);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      });
    }
    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [ref]);
  return (
    <div className="relative min-h-screen w-[99vw]">
      <button
        className="absolute right-10 top-10 bg-cyan-400"
        onClick={() => {
          loader
            .loadAsync("/REP_TESTE.glb")
            .then((gltf) => {
              if (!rendererRef.current) return;
              console.log(gltf);
              const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
              );
              camera.position.z = 10;
              const light = new THREE.AmbientLight(0xffffff);
              light.intensity = .3;
              light.castShadow = true;
              const pointLight = new THREE.PointLight(0xffffff, 10, 100);
              pointLight.position.set(10, 0, 0);

              sceneRef.current = gltf.scene as unknown as THREE.Scene;
              sceneRef.current.background = new THREE.Color(0xffffff);
              sceneRef.current.add(light);
              sceneRef.current.add(pointLight);
              sceneRef.current.add(camera);
              for (const child of gltf.scene.children) {
                if (child.name === "Armature") {
                  console.log(child);
                  for (const group of child.children) {
                    if (group.name === "Sphere007") {
                      console.log(group);
                      for (const mesh of group.children) {
                        console.log(mesh);
                        if (mesh instanceof THREE.Mesh) {
                          mesh.castShadow = true;
                          mesh.receiveShadow = true;
                          if (mesh.name === "Sphere020_2") {
                            mesh.material.transparent = true;
                          } else {
                            (
                              mesh.material as THREE.MeshStandardMaterial
                            ).roughness = 0.0;
                            (
                              mesh.material as THREE.MeshStandardMaterial
                            ).metalness = 0.0;
                            (
                              mesh.material as THREE.MeshStandardMaterial
                            ).roughnessMap = null;
                            (
                              mesh.material as THREE.MeshStandardMaterial
                            ).metalnessMap = null;
                          }
                        }
                      }
                    }
                  }
                }
              }
              mixerRef.current = new THREE.AnimationMixer(gltf.scene);
              console.log(gltf.animations);
              const clips = gltf.animations;
              animationsRef.current = clips;
              clipRef.current = THREE.AnimationClip.findByName(clips, "Wave");
              console.log(clipRef.current);
              actionRef.current = mixerRef.current.clipAction(clipRef.current);
              console.log(actionRef.current);

              const controls = new OrbitControls(
                camera,
                rendererRef.current?.domElement,
              );
              controls.enableDamping = true;
              controls.dampingFactor = 0.25;

              rendererRef.current?.render(sceneRef.current, camera);
              rendererRef.current?.setAnimationLoop(() => {
                if (!sceneRef.current) return;
                if (mixerRef.current) mixerRef.current.update(clock.getDelta());
                rendererRef.current?.render(sceneRef.current, camera);
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }}
      >
        Load
      </button>
      <button
        className="absolute right-10 top-20 bg-cyan-400"
        onClick={() => {
          if (!animationsRef.current) return console.error("No animations");
          if (!mixerRef.current) return console.error("No mixer");
          if (!clipRef.current) return console.error("No clip");
          const angry = THREE.AnimationClip.findByName(
            animationsRef.current,
            "Wave",
          );
          if (!angry) return console.error("No Wave");
          mixerRef.current.stopAllAction();
          actionRef.current = mixerRef.current.clipAction(angry);
          actionRef.current.reset();
          actionRef.current.setLoop(THREE.LoopOnce, 1);
          actionRef.current.play();
        }}
      >
        Wave
      </button>
      <button
        className="absolute right-10 top-32 bg-cyan-400"
        onClick={() => {
          if (!animationsRef.current) return console.error("No animations");
          if (!mixerRef.current) return console.error("No mixer");
          if (!clipRef.current) return console.error("No clip");
          const angry = THREE.AnimationClip.findByName(
            animationsRef.current,
            "Angry",
          );
          if (!angry) return console.error("No angry");
          mixerRef.current.stopAllAction();
          actionRef.current = mixerRef.current.clipAction(angry);
          actionRef.current.reset();
          actionRef.current.setLoop(THREE.LoopOnce, 1);
          actionRef.current.play();
        }}
      >
        Angry
      </button>
      <button
        className="absolute right-32 top-32 text-red-500 px-2"
        onClick={() => {
          if (!animationsRef.current) return console.error("No animations");
          if (!mixerRef.current) return console.error("No mixer");
          if (!clipRef.current) return console.error("No clip");
          const angry = THREE.AnimationClip.findByName(
            animationsRef.current,
            "MakeL",
          );
          if (!angry) return console.error("No L :D");
          mixerRef.current.stopAllAction();
          actionRef.current = mixerRef.current.clipAction(angry);
          actionRef.current.reset();
          actionRef.current.setLoop(THREE.LoopOnce, 1);
          actionRef.current.play();
        }}
      >
        Make the L
      </button>
      <button
        className="absolute right-10 top-44 bg-cyan-400"
        onClick={() => {
          if (!sceneRef.current) return;
          const geometry = new THREE.BoxGeometry();
          const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          material.roughness = 0.1
          material.envMap = sceneRef.current.background as THREE.CubeTexture
          material.emissive = new THREE.Color(0x00ff00)
          material.emissiveIntensity = 2
          const cube = new THREE.Mesh(geometry, material);
          cube.castShadow = true;
          cube.receiveShadow = true
          cube.position.x = Math.random() * 10 - 5;
          cube.position.y = Math.random() * 10 - 5;
          cube.position.z = Math.random() * 10 - 5;
          sceneRef.current.add(cube);
        }}
      >
        Add cube
      </button>

      <div className="min-h-screen w-[99vw]" ref={ref}></div>
    </div>
  );
}
