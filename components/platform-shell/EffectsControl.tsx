"use client";
import { useEffect, useState } from 'react';
import { effectsLabels, effectsModes, effectsStore, initialEffects } from './platform-effects.js';

export function useEffects() {
  const [state, setState] = useState(initialEffects);
  useEffect(() => {
    const stop = effectsStore.subscribe(setState);
    effectsStore.start(); setState(effectsStore.get());
    return stop;
  }, []);
  return state;
}
export function EffectsControl({ locale = 'en' }: { locale?: string }) {
  const state = useEffects(), copy = effectsLabels[locale] || effectsLabels.en;
  return <label className="af-platform-shell__effects"><span>{copy.title}</span><select aria-label={copy.title} value={state.mode} onChange={event => effectsStore.set(event.target.value)}>
    {effectsModes.map(mode => <option key={mode} value={mode}>{copy[mode]}{mode === 'auto' && state.mode === 'auto' && state.ready ? ` · ${copy[state.quality]}` : ''}</option>)}
  </select><small aria-live="polite">{state.mode === 'auto' && state.ready ? `${copy.auto} · ${copy[state.quality]}` : ''}</small></label>;
}
