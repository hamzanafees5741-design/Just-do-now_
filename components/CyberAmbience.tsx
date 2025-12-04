import React, { useEffect, useRef } from 'react';

interface CyberAmbienceProps {
  enabled: boolean;
  volume?: number;
}

const CyberAmbience: React.FC<CyberAmbienceProps> = ({ enabled, volume = 0.08 }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const isRunning = useRef(false);

  useEffect(() => {
    const initAudio = () => {
      if (audioCtxRef.current) return;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      // Master Gain
      const gainNode = audioCtxRef.current.createGain();
      gainNode.gain.value = 0;
      gainNode.connect(audioCtxRef.current.destination);
      gainNodeRef.current = gainNode;

      // --- LAYER 1: Deep Drone (55Hz) ---
      const osc1 = audioCtxRef.current.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.value = 55; // Low A
      
      const filter1 = audioCtxRef.current.createBiquadFilter();
      filter1.type = 'lowpass';
      filter1.frequency.value = 180; // Muffled
      filter1.Q.value = 1;

      const pan1 = audioCtxRef.current.createStereoPanner();
      pan1.pan.value = -0.3;

      osc1.connect(filter1).connect(pan1).connect(gainNode);
      osc1.start();
      oscillatorsRef.current.push(osc1);

      // --- LAYER 2: Binaural Pulse (55.5Hz) ---
      const osc2 = audioCtxRef.current.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 55.5; // Slight detune for pulsing
      
      const pan2 = audioCtxRef.current.createStereoPanner();
      pan2.pan.value = 0.3;

      osc2.connect(pan2).connect(gainNode);
      osc2.start();
      oscillatorsRef.current.push(osc2);

      // --- LAYER 3: High Ethereal Shimmer (Wind) ---
      const osc3 = audioCtxRef.current.createOscillator();
      osc3.type = 'triangle';
      osc3.frequency.value = 220;
      
      const filter3 = audioCtxRef.current.createBiquadFilter();
      filter3.type = 'bandpass';
      filter3.frequency.value = 400;
      
      const gain3 = audioCtxRef.current.createGain();
      gain3.gain.value = 0.1; // Quieter

      // LFO for filter sweep (Wind effect)
      const lfo = audioCtxRef.current.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // Very slow
      const lfoGain = audioCtxRef.current.createGain();
      lfoGain.gain.value = 200;
      lfo.connect(lfoGain).connect(filter3.frequency);
      lfo.start();
      oscillatorsRef.current.push(lfo);

      osc3.connect(filter3).connect(gain3).connect(gainNode);
      osc3.start();
      oscillatorsRef.current.push(osc3);
      
      isRunning.current = true;
    };

    if (enabled) {
      if (!audioCtxRef.current) {
        initAudio();
      }
      
      if (audioCtxRef.current?.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Ramp up volume
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(volume, audioCtxRef.current.currentTime + 3);
      }

    } else {
      // Ramp down volume
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.cancelScheduledValues(audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 1.5);
        
        // Optionally suspend after fade out to save CPU
        setTimeout(() => {
          if (!enabled && audioCtxRef.current?.state === 'running') {
             audioCtxRef.current.suspend();
          }
        }, 1600);
      }
    }
  }, [enabled, volume]);

  return null;
};

export default CyberAmbience;