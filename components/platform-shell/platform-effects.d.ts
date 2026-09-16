export type EffectsMode = 'off' | 'low' | 'standard' | 'high' | 'auto';
export type EffectsState = Readonly<{mode: EffectsMode; quality: Exclude<EffectsMode, 'auto'>; enabled: boolean; ready: boolean}>;
export const effectsModes: EffectsMode[];
export const effectsLabels: Record<string, Record<EffectsMode | 'title', string>>;
export const initialEffects: EffectsState;
export function effectsCookieDomain(host?: string): string;
export function automaticEffects(input?: {reduced?: boolean; memory?: number; cores?: number; saveData?: boolean}): EffectsState['quality'];
export function createEffectsStore(env?: typeof globalThis): {
  start(): void; get(): EffectsState; set(mode: string): boolean; refresh(): void; lowerQuality(): void;
  subscribe(callback: (state: EffectsState) => void): () => void; toggle(): void; reportFrame(ms: number): void;
};
export const effectsStore: ReturnType<typeof createEffectsStore>;
