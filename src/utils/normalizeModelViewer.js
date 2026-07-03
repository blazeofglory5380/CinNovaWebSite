import { Box3, Vector3 } from "three";

export const TARGET_MODEL_SPAN = 2.75;
export const TRANSFORMATION_CAMERA_ORBIT = "28deg 68deg 118%";

export function getModelRoot(viewer) {
    const model = viewer?.model;
    if (!model) return null;
    if (model.scene) return model.scene;
    if (model.group) return model.group;
    if (model.children?.length) return model;
    return null;
}

export function measureModelRoot(root) {
    const box = new Box3().setFromObject(root);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    return {
        size: { x: size.x, y: size.y, z: size.z },
        center: { x: center.x, y: center.y, z: center.z },
        minY: box.min.y,
        maxSpan: Math.max(size.x, size.y, size.z),
    };
}

export function alignModelRoot(root, targetSpan) {
    const box = new Box3().setFromObject(root);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);

    const maxSpan = Math.max(size.x, size.y, size.z);
    if (maxSpan <= 0) return null;

    const scale = targetSpan / maxSpan;
    root.scale.multiplyScalar(scale);
    root.updateMatrixWorld(true);

    box.setFromObject(root);
    box.getCenter(center);
    const minY = box.min.y;

    root.position.x -= center.x;
    root.position.y -= minY;
    root.position.z -= center.z;
    root.updateMatrixWorld(true);

    box.setFromObject(root);
    box.getSize(size);
    box.getCenter(center);

    return {
        targetSpan,
        scale,
        centerY: center.y,
        dimensions: { x: size.x, y: size.y, z: size.z },
    };
}

export function syncViewerCamera(viewer, cameraTargetY, orbit = TRANSFORMATION_CAMERA_ORBIT) {
    viewer.cameraTarget = `0m ${cameraTargetY.toFixed(3)}m 0m`;
    viewer.cameraOrbit = orbit;
    viewer.fieldOfView = "30deg";
    viewer.jumpCameraToGoal?.();
    viewer.updateFraming?.();
}

export function normalizeTransformationPair(beforeViewer, afterViewer, targetSpan = TARGET_MODEL_SPAN) {
    const beforeRoot = getModelRoot(beforeViewer);
    const afterRoot = getModelRoot(afterViewer);
    if (!beforeRoot || !afterRoot) return null;

    const sharedSpan = Math.max(targetSpan, 0.001);

    const beforeAlign = alignModelRoot(beforeRoot, sharedSpan);
    const afterAlign = alignModelRoot(afterRoot, sharedSpan);
    if (!beforeAlign || !afterAlign) return null;

    const cameraTargetY = Math.max(beforeAlign.centerY, afterAlign.centerY, 0.45);
    syncViewerCamera(beforeViewer, cameraTargetY);
    syncViewerCamera(afterViewer, cameraTargetY);

    return {
        sharedSpan,
        cameraTargetY,
        beforeAlign,
        afterAlign,
    };
}
