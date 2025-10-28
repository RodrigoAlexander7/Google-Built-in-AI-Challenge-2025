'use client';
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/layout/NavBar';
import Footer from '@/components/layout/Footer';
import './home.css';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy-load 3D components client-side
const Canvas = dynamic(() => import('@react-three/fiber').then(m => m.Canvas), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then(m => m.OrbitControls), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(m => m.Float), { ssr: false });
const Stars = dynamic(() => import('@react-three/drei').then(m => m.Stars), { ssr: false });

function Blob() {
  return (
    // Gentle floating icosahedron
    // The Float component provides subtle motion without manual frames
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial color={'#67E8F9'} metalness={0.25} roughness={0.35} />
      </mesh>
    </Float>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Wheel -> scroll to next section
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        e.preventDefault();
        document.getElementById('info')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-[100svh] overflow-hidden hero-bg text-white">
      <div className="absolute inset-0 -z-10 opacity-50 grid-overlay" />
      <div className="absolute inset-0 -z-10">
        {mounted && (
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1.1} />
              {/* Background stars */}
              <Stars radius={60} depth={40} count={2000} factor={3} saturation={0} fade speed={1} />
              <Blob />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
            </Canvas>
          </Suspense>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        <motion.span initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold px-3 py-1 rounded-full ring-1 ring-white/15 bg-white/5 backdrop-blur-md">
          Nuevo • Tutor IA Multimodular
        </motion.span>
        <motion.h1 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.05 }} className="mt-5 max-w-4xl text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Aprende más rápido con un Tutor IA que te guía, practica y juega
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="mt-5 max-w-2xl text-base md:text-lg text-white/80">
          Unifica resúmenes, práctica guiada, tarjetas, rutas de aprendizaje y minijuegos en un solo lugar.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }} className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <a href="#features" className="btn-primary">Explorar módulos</a>
          <a href="#how" className="btn-secondary">Cómo se usa</a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left w-full max-w-4xl">
          <div className="stat">
            <span className="stat-label">Módulos</span>
            <span className="stat-value">5</span>
          </div>
          <div className="stat">
            <span className="stat-label">Estudiantes</span>
            <span className="stat-value">+1K</span>
          </div>
          <div className="stat">
            <span className="stat-label">Ahorro de tiempo</span>
            <span className="stat-value">~60%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Soporte</span>
            <span className="stat-value">24/7</span>
          </div>
        </motion.div>

        <button aria-label="Desplazar a la siguiente sección" onClick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })} className="scroll-indicator mt-16" />
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section id="info" className="section container">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="card">
          <h3 className="card-title">¿Qué hace tu proyecto?</h3>
          <p className="card-text">
            Es un Tutor mediante IA que integra cinco módulos: Resúmenes (Summarizer), Práctica guiada (Practice), Tarjetas (FlashCards), Rutas personalizadas (LearningPath) y juegos generados por IA (LearnPlay).
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.05 }} className="card">
          <h3 className="card-title">¿A quién ayuda?</h3>
          <p className="card-text">
            A estudiantes de diversas áreas. Incluimos menús con opciones guiadas para evitar prompts complejos y acelerar su flujo de estudio.
          </p>
        </motion.div>
        <motion.div id="how" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="card">
          <h3 className="card-title">¿Cómo se usa?</h3>
          <ol className="list-decimal list-inside text-white/80 space-y-2">
            <li>Elige un módulo (p.ej., Summarizer o Practice).</li>
            <li>Sube tu material o pega el contenido.</li>
            <li>Selecciona objetivo (resumir, practicar, memorizar, planificar o jugar).</li>
            <li>La IA genera contenido y te guía con pasos claros y medibles.</li>
          </ol>
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="section container">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="section-title">Problema y solución</h3>
          <p className="card-text">
            Estudiar con múltiples herramientas dispersas fragmenta la atención y aumenta el tiempo invertido. Nuestra solución reúne todo en una sola experiencia coherente: resume, practica, memoriza y juega con el mismo contexto; además, genera rutas de aprendizaje adaptadas.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="card p-0 overflow-hidden">
          {/* Imagen sugerida: problem-solution-graphic.png */}
          <img src="/images/problem-solution-graphic.png" alt="Problema y solución" className="w-full h-64 object-cover" />
        </motion.div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { key: 'summarizer', title: 'Summarizer', desc: 'Convierte textos densos en ideas clave y resúmenes accionables.', img: '/images/feature-summarizer.gif' },
    { key: 'practice', title: 'Practice', desc: 'Ejercicios generados por IA con feedback inmediato.', img: '/images/feature-practice.gif' },
    { key: 'flashcards', title: 'FlashCards', desc: 'Tarjetas inteligentes con repetición espaciada.', img: '/images/feature-flashcards.gif' },
    { key: 'learningpath', title: 'LearningPath', desc: 'Ruta personalizada según tu nivel y meta.', img: '/images/feature-learningpath.gif' },
    { key: 'learnplay', title: 'LearnPlay', desc: 'Minijuegos generados por IA para aprender jugando.', img: '/images/feature-learnplay.gif' },
  ];
  return (
    <section id="features" className="section container">
      <h3 className="section-title text-center">Características principales</h3>
      <p className="text-center text-white/70 max-w-2xl mx-auto">
        Diseñadas para mantenerte en flujo: aprende, practica y juega sin cambiar de contexto.
      </p>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(f => (
          <motion.div key={f.key} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="card hover:translate-y-[-2px] transition-transform">
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10">
              {/* Reemplaza por el GIF o imagen sugerida */}
              <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-4 text-lg font-semibold">{f.title}</h4>
            <p className="card-text mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    { name: 'Integrante 1', role: 'IA / Backend', img: '/images/team-1.jpg' },
    { name: 'Integrante 2', role: 'Frontend / UX', img: '/images/team-2.jpg' },
    { name: 'Integrante 3', role: 'PM / Investigación', img: '/images/team-3.jpg' },
  ];
  return (
    <section id="team" className="section container">
      <h3 className="section-title text-center">El equipo</h3>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {team.map(m => (
          <motion.div key={m.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="card text-center">
            <div className="mx-auto h-24 w-24 rounded-full overflow-hidden ring-1 ring-white/15">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <h4 className="mt-3 font-semibold">{m.name}</h4>
            <p className="text-white/70 text-sm">{m.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative">
        <HeroSection />
        <InfoSection />
        <FeaturesSection />
        <ProblemSection />
        <TeamSection />
      </main>
      <Footer />
    </>
  );
}
