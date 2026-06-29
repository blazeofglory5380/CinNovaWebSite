import ProductHero3D from "./ProductHero3D.jsx";

/**
 * Real Estate AI hero with old-to-new farmhouse GLB transition.
 * Config + copy come from productHero3DConfigs["real-estate"] (heroVisual: "transformation").
 */
function RealEstateTransformationHero(props) {
    return <ProductHero3D {...props} heroVisual="transformation" />;
}

export default RealEstateTransformationHero;
