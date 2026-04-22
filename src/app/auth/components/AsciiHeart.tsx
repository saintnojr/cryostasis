'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

const AsciiHeart: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = ''; 

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0, 0, 0);

        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 1.4; 

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        // --- ПЛОТНОСТЬ И ЧЕТКОСТЬ ---
        const charset = ' .:-=+*#%@'; 
        const effect = new AsciiEffect(renderer, charset, { 
            invert: true,
            resolution: 0.3, // Высокая детализация
            color: false,
        });
        
        effect.setSize(800, 800); 
        effect.domElement.style.color = 'white';
        effect.domElement.style.fontFamily = 'monospace';
        effect.domElement.style.fontSize = '6px'; // Очень мелкие символы
        effect.domElement.style.lineHeight = '6px';
        containerRef.current.appendChild(effect.domElement);

        // --- СВЕТ ДЛЯ ОБЪЕМА (Убираем плоскость) ---
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Основной фронтальный свет
        const mainLight = new THREE.DirectionalLight(0xffffff, 3);
        mainLight.position.set(1, 1, 2);
        scene.add(mainLight);

        // Контровой свет (создает "ободок" и объем сзади)
        const backLight = new THREE.DirectionalLight(0xffffff, 2);
        backLight.position.set(-2, 0, -2);
        scene.add(backLight);

        const heartPivot = new THREE.Group();
        scene.add(heartPivot);

        const loader = new GLTFLoader();
        loader.load('/models/heart.glb', (gltf) => {
            const model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            model.position.set(-center.x, -center.y, -center.z);

            const maxDim = Math.max(size.x, size.y, size.z);
            const scaleFactor = 1.6 / maxDim; 
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            model.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).material = new THREE.MeshPhongMaterial({
                        color: 0xffffff,
                        flatShading: true,
                        shininess: 30 // Блеск для выделения граней
                    });
                }
            });

            heartPivot.add(model);
        });

        let animationId: number;
        const startTime = Date.now();

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const elapsed = (Date.now() - startTime) * 0.001;

            if (heartPivot) {
                // Только спокойное вращение, НИКАКОГО биения
                heartPivot.rotation.y = elapsed * 0.4;
            }
            effect.render(scene, camera);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="flex justify-center items-center w-[800px] h-[800px] pointer-events-none select-none opacity-90"
        />
    );
};

export default AsciiHeart;