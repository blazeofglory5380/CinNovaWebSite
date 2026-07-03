import type { Scene3DWrapperProps } from '../core/types';
import { cn } from '../core/utils';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useLazyMotion } from '../hooks/useLazyMotion';

/**
 * Placeholder wrapper for Meshy-generated 3D assets.
 * No Meshy SDK — reserved for future integration.
 */
export function MeshyScene({
  children,
  className,
  fallback,
  loading,
  reducedMotionFallback,
  onReady,
  ariaLabel = '3D scene',
  lazy = true,
}: Scene3DWrapperProps) {
  const reduced = useReducedMotion();
  const ready = useLazyMotion();

  if (reduced && reducedMotionFallback) return <>{reducedMotionFallback}</>;
  if (reduced && fallback) return <>{fallback}</>;
  if (lazy && !ready && loading) return <>{loading}</>;

  return (
    <div
      className={cn('cn-m-3d-scene cn-m-3d-meshy', className)}
      data-engine="meshy"
      role="img"
      aria-label={ariaLabel}
      onLoad={() => onReady?.()}
    >
      {children ?? fallback ?? (
        <div className="cn-m-3d-placeholder">Meshy scene slot</div>
      )}
    </div>
  );
}

export function ThreeScene(props: Scene3DWrapperProps) {
  return (
    <MeshyScene {...props} className={cn('cn-m-3d-three', props.className)} ariaLabel={props.ariaLabel ?? 'Three.js scene'}>
      {props.children ?? props.fallback ?? <div className="cn-m-3d-placeholder">Three.js scene slot</div>}
    </MeshyScene>
  );
}

export function ReactThreeFiberScene(props: Scene3DWrapperProps) {
  return (
    <MeshyScene {...props} className={cn('cn-m-3d-r3f', props.className)} ariaLabel={props.ariaLabel ?? 'React Three Fiber scene'}>
      {props.children ?? props.fallback ?? <div className="cn-m-3d-placeholder">R3F scene slot</div>}
    </MeshyScene>
  );
}

export function UnityWebGLScene(props: Scene3DWrapperProps) {
  return (
    <MeshyScene {...props} className={cn('cn-m-3d-unity', props.className)} ariaLabel={props.ariaLabel ?? 'Unity WebGL scene'}>
      {props.children ?? props.fallback ?? <div className="cn-m-3d-placeholder">Unity WebGL slot</div>}
    </MeshyScene>
  );
}
