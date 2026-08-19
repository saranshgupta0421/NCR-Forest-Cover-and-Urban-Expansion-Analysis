# NCR-Forest-Cover-and-Urban-Expansion-Analysis

## Key Findings

**1. Net vegetation gain across all five NCR districts (2020–2025)**
NDVI-threshold analysis (Sentinel-2, GEE) showed vegetation growth in every district studied — 
21% (Delhi) to 85% (Gautam Buddha Nagar) — contrary to the expected urbanization-driven loss.
*Limitation: NDVI is used here as a forest-cover proxy, not a validated land-cover classification.*

**2. No consistent correlation between urban expansion and vegetation growth**
Cross-referenced against GHSL built-up-surface data. Gurgaon showed both the highest urban 
expansion (10.1 km²) and second-highest vegetation growth (61.6%); Gautam Buddha Nagar showed 
the lowest urban expansion and highest vegetation growth.
*Limitation: n=5 districts — directional observation, not a statistically valid correlation.*

**3. Notable methodological issues encountered and resolved**
- Seasonal date-window mismatches inflating apparent NDVI change
- `maxPixels` override required for full-resolution raster export
- NoData handling inconsistencies between GEE export and rasterio/numpy
- Unit-squaring bug: incorrectly applying pixelArea() to a GHSL band already in m²
