var geometry = 
    /* color: #ffffff */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[77.0197931274651, 28.77139498446926],
          [77.0197931274651, 28.44708386600988],
          [77.39744815676198, 28.44708386600988],
          [77.39744815676198, 28.77139498446926]]], null, false);


var lay_2020 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterBounds(geometry).filterDate('2020-10-01','2020-11-30').filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
var image2020 = lay_2020.median()
var lay_2025 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED').filterBounds(geometry).filterDate('2025-10-01','2025-11-30').filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',20))
var image2025 = lay_2025.median()
var ndvi2020 = image2020.normalizedDifference(['B8','B4']).rename('NDVI_2020')
var ndvi2025 = image2025.normalizedDifference(['B8','B4']).rename('NDVI_2025')
var ndvi_change = ndvi2025.subtract(ndvi2020).rename('NDVI_CHANGE')
Map.centerObject(geometry);
var ndvi_change_masked = ndvi_change.updateMask(ndvi_change.abs().gt(0.1));
Map.addLayer(ndvi_change_masked.clip(geometry), 
  {min: -0.4, max: 0.4, palette: ['red','black','green']}, 
  'NDVI CHANGE 2020-2025 (masked)')
  Map.addLayer(ndvi2020.clip(geometry),{min:0,max:1,palette: ['white','green']})
var gaul = ee.FeatureCollection('FAO/GAUL/2015/level2')
var district = gaul.filterBounds(geometry)
print(district.size())
var forest2020 = ndvi2020.gt(0.5)
var forest2025 = ndvi2025.gt(0.5)
var forestArea2020 = forest2020.multiply(ee.Image.pixelArea()).divide(1e6)
Map.addLayer(forest2025.clip(geometry),{min:0.5 , max:1 , palette : ['white','green']}, "Forest-COver")
var stats2020 = forestArea2020.reduceRegions({
  collection: district,
  reducer: ee.Reducer.sum(),
  scale: 10,
  crs: 'EPSG:4326'
})
print(stats2020)
Export.table.toDrive({
  collection: stats2020,
  description: 'Forest_Area_2020_by_District',
  fileFormat: 'CSV',
  selectors: ['ADM2_NAME', 'sum']
});
var forestArea2025 = forest2025.multiply(ee.Image.pixelArea()).divide(1e6)
var stats2025 = forestArea2025.reduceRegions({
  collection: district,
  reducer: ee.Reducer.sum(),
  scale:10,
  crs:'EPSG:4326'
})
Export.table.toDrive({
  collection:stats2025,
  description: 'Forest_Area_2025_By_District',
  fileFormat: 'CSV',
  selectors: ['ADM2_NAME','sum']
});
Export.image.toDrive({
  image: ndvi_change_masked.clip(geometry),
  region: geometry,
  scale: 10,
  maxPixels: 1e9,
  crs: 'EPSG:4326',
  description:'Ndvi_changed'
})
var built2020 = ee.ImageCollection("JRC/GHSL/P2023A/GHS_BUILT_S")
  .filterDate('2020-01-01', '2020-12-31')
  .first()
  .select('built_surface');

var built2025 = ee.ImageCollection("JRC/GHSL/P2023A/GHS_BUILT_S")
  .filterDate('2025-01-01', '2025-12-31')
  .first()
  .select('built_surface');

var builtChange = built2025.subtract(built2020).divide(1e6);
var builtChangeStats = builtChange.reduceRegions({
  collection: district, 
  reducer: ee.Reducer.sum(),
  scale: 100, 
  crs: 'EPSG:4326'
});
Export.table.toDrive({
  collection: builtChangeStats,
  fileFormat: 'CSV',
  selectors: ['ADM2_NAME','sum'],
  description: 'Urban_expansion_2020_and_2025'
  
})


