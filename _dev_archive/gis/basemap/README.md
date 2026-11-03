# 福田区深海蓝矢量底图

## 已生成成果

- ArcGIS Pro 工程：`E:\GIS_data\futian_deepsea_basemap\FutianDeepSeaBasemap.aprx`
- 文件地理数据库：`E:\GIS_data\futian_deepsea_basemap\FutianDeepSeaBasemap.gdb`
- 发布包：`E:\GIS_data\futian_deepsea_basemap\FutianDeepSeaBasemap.vtpk`
- 总体验证报告：`E:\GIS_data\futian_deepsea_basemap\validation_report.json`
- 数据提取报告：`E:\GIS_data\futian_deepsea_basemap\geojson\extraction_report.json`
- GDB 报告：`E:\GIS_data\futian_deepsea_basemap\gdb_report.json`

当前 VTPK 大小约 47.87 MiB，包含 4,258 条底图级道路、867 个水域面、1,427 个绿地面和 260 个分级候选注记点。建筑、设施、事件和无障碍详细路网未写入底图。

## 发布前视觉检查

1. 用 ArcGIS Pro 打开 `FutianDeepSeaBasemap.aprx`。
2. 打开地图 `FutianDeepSeaBasemap`。
3. 分别在约 1:150,000、1:30,000 和 1:5,000 检查全区、中景和步行近景。
4. 确认中文注记正常、道路层级逐步出现、底图没有亮色抢占专题路网视觉层级。
5. 也可在一个空白地图中直接添加 `FutianDeepSeaBasemap.vtpk`，确认它不要求修复本地数据源。

ArcGIS Pro 命令行打包时可能提示缺少 `locale/codepage/936.txt`。验证器已确认 VTPK 内字体路径使用 UTF-8，并且样式引用的“微软雅黑 Regular”字形资源确实存在；该警告不影响当前发布包。

## 在 GeoScene Portal 发布

1. 登录 GeoScene Portal，进入“个人中心”或“资源中心”。
2. 选择“添加项目”，从本机上传 `FutianDeepSeaBasemap.vtpk`。
3. 标题填写 `FutianDeepSeaBasemap`，文件夹选择 `BlindNavigation`。
4. 上传完成后，在项目详情页选择“发布”，发布为托管矢量切片图层。
5. 将托管矢量切片图层共享给“所有人”。
6. 在图层详情页确认可预览，再复制项目页地址和公开的 `VectorTileServer` 地址。

把这两个地址发给 Codex 后，再进行 Web 端接入；发布之前不要修改当前 Web 底图配置。

## 完整重建命令

```powershell
& 'D:\Python3.13\python.exe' 'D:\盲行\_dev_archive\gis\basemap\extract_futian_basemap.py' `
  --pbf 'E:\GIS_data\guangdong-260710.osm.pbf' `
  --boundary 'D:\盲行\shenzhen_data\processed\futian_boundary.geojson' `
  --park-points 'D:\盲行\shenzhen_data\processed\support\futian_community_parks.geojson' `
  --metro-points 'D:\盲行\shenzhen_data\processed\support\futian_metro_stations.geojson' `
  --output 'E:\GIS_data\futian_deepsea_basemap\geojson' `
  --buffer-m 2000

& 'E:\ArcGIS Pro3.6\bin\Python\Scripts\propy.bat' `
  'D:\盲行\_dev_archive\gis\basemap\build_futian_basemap_gdb.py' `
  --input-dir 'E:\GIS_data\futian_deepsea_basemap\geojson' `
  --output-root 'E:\GIS_data\futian_deepsea_basemap'

& 'E:\ArcGIS Pro3.6\bin\Python\Scripts\propy.bat' `
  'D:\盲行\_dev_archive\gis\basemap\configure_and_package_futian_basemap.py' `
  --root 'E:\GIS_data\futian_deepsea_basemap'

& 'D:\Python3.13\python.exe' 'D:\盲行\_dev_archive\gis\basemap\validate_futian_basemap.py' `
  --root 'E:\GIS_data\futian_deepsea_basemap'
```

验证成功时最后一个命令退出码为 0，且 `validation_report.json` 的 `status` 为 `passed`。
