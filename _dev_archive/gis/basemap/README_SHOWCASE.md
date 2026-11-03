# 福田展示型深海蓝底图 v2

这组成果与已发布的 `FutianDeepSeaBasemap` 完全隔离，不会覆盖旧版数据或服务。

## 已生成产物

- ArcGIS Pro 工程：`E:\GIS_data\futian_showcase_basemap\FutianShowcaseBasemap.aprx`
- 文件地理数据库：`E:\GIS_data\futian_showcase_basemap\FutianShowcaseBasemap.gdb`
- 矢量切片包：`E:\GIS_data\futian_showcase_basemap\FutianShowcaseBasemap.vtpk`
- 水域图层文件：`E:\GIS_data\futian_showcase_basemap\ShowcaseWater.lyrx`
- 主干路图层文件：`E:\GIS_data\futian_showcase_basemap\ShowcaseRoads.lyrx`
- 综合验证报告：`E:\GIS_data\futian_showcase_basemap\validation_report.json`

## 数据处理结果

- 原始水域 867 个：先修复、去重和平面融合，再删除小于 1,000 平方米的碎片。
- 原始底图道路 4,258 个碎段：排除无名路段，按道路等级和名称融合；次干路只保留同名长度不小于 3km 的组。
- 道路字段包含外发光、暗色包边和亮色核心三层线的颜色、透明度和线宽。
- 水域字段包含 `waterbody_size` 和 `wave_strength`，可供 Web 端 `WaterSymbol3DLayer` 渲染。

## 如何在 ArcGIS Pro 中检查

1. 打开 `FutianShowcaseBasemap.aprx`。
2. 打开地图 `FutianShowcaseBasemap`，这是 VTPK 底图预览。
3. 依次在约 1:150,000、1:30,000 和 1:5,000 检查全区、中景和近景。
4. 快速路应最亮，主干路次之，精选次干路只在中近景出现。
5. 打开地图 `FutianShowcaseOperationalLayers`，检查两个待发布图层的字段和几何。

## 后续发布顺序

1. 上传 `FutianShowcaseBasemap.vtpk`，发布为托管矢量切片图层，建议标题 `FutianShowcaseBasemap`。
2. 在 ArcGIS Pro 中只选中 `FutianShowcaseOperationalLayers` 里的“展示型水域（发布）”，分享为托管要素图层 `FutianShowcaseWater`。
3. 如需要独立点击/控制高亮骨架路，再将“展示型主干路（发布）”发布为 `FutianShowcaseRoads`。
4. 共享级别设为“所有人（公开）”，再把项目地址和 REST 服务地址发给 Codex 做 Web 接入。

VTPK 中的水面是静态后备样式。真正的轻微波纹由 Web `SceneView` 对 `FutianShowcaseWater` 要素服务使用 `WaterSymbol3DLayer` 实现，不需要重做 VTPK。

## 完整重建命令

```powershell
& 'D:\Python3.13\python.exe' 'D:\盲行\_dev_archive\gis\basemap\build_showcase_data.py' `
  --input-dir 'E:\GIS_data\futian_deepsea_basemap\geojson' `
  --output-dir 'E:\GIS_data\futian_showcase_basemap\geojson'

& 'E:\ArcGIS Pro3.6\bin\Python\Scripts\propy.bat' `
  'D:\盲行\_dev_archive\gis\basemap\build_futian_showcase_gdb.py' `
  --source-input 'E:\GIS_data\futian_deepsea_basemap\geojson' `
  --derived-input 'E:\GIS_data\futian_showcase_basemap\geojson' `
  --output-root 'E:\GIS_data\futian_showcase_basemap'

& 'E:\ArcGIS Pro3.6\bin\Python\Scripts\propy.bat' `
  'D:\盲行\_dev_archive\gis\basemap\configure_and_package_futian_showcase.py' `
  --root 'E:\GIS_data\futian_showcase_basemap'

& 'D:\Python3.13\python.exe' 'D:\盲行\_dev_archive\gis\basemap\validate_futian_showcase.py' `
  --root 'E:\GIS_data\futian_showcase_basemap'
```
