import { Camera } from 'lucide-react';
import { useStore, compressImage } from '../lib/store';

/** The reference photo is never published: it is uploaded here and kept only in this browser's IndexedDB. */
export function ProfilePhoto({ className = 'h-72' }: { className?: string }) {
  const { state, update } = useStore();
  const onFile = async (f?: File) => { if (f) { const url = await compressImage(f, 900); update((s) => ({ ...s, profilePhoto: url })); } };
  return (
    <label className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg bg-sand/60 text-center ${className}`}>
      {state.profilePhoto ? <img src={state.profilePhoto} alt="My reference photo" className="h-full w-full object-cover object-top" /> : (
        <span className="px-4 text-xs text-choc-soft"><Camera className="mx-auto mb-2 h-6 w-6" />Add your reference photo.<br />It stays on this device and is never uploaded.</span>
      )}
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
    </label>
  );
}
