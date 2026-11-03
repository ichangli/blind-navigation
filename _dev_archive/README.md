# 开发归档（比赛提交时排除）

这个目录保存仍有维护价值、但不参与作品日常运行的代码和开发记录。它不是废弃文件目录；真正过时或无用的内容位于 `none`。

## 分类

- `tests/backend_api`：后端 API、GeoScene 代理、导航和便携环境测试。目录名特意避开 `backend`，防止遮蔽运行包。
- `tests/frontend`：Web 端、移动端和地图交互测试。
- `tests/gis`：底图与展示数据生产工具测试。
- `gis/network`：福田路网、支撑数据与网络数据集生产脚本。
- `gis/buildings`：建筑轮廓提取和 CityEngine 输入准备脚本。
- `gis/basemap`：深海蓝矢量底图、水域和展示型道路制作工具。
- `gis/cityengine`：白模规则、批处理脚本及操作说明。
- `project_history/superpowers`：历次功能设计和实施计划。
- `project_history/source_cleanup`：本次源码整理的设计与计划。

## 后续使用

以下命令均在项目根目录 `D:\盲行` 执行。

```powershell
# 后端测试
.\.venv\Scripts\python.exe -m pytest .\_dev_archive\tests\backend_api -q

# GIS 策略和验证器测试（普通项目虚拟环境）
.\.venv\Scripts\python.exe -m pytest `
  .\_dev_archive\tests\gis\test_basemap_policy.py `
  .\_dev_archive\tests\gis\test_basemap_validator.py `
  .\_dev_archive\tests\gis\test_showcase_policy.py `
  .\_dev_archive\tests\gis\test_showcase_validator.py -q

# GeoPandas 数据提取测试（数据处理 Python 环境）
& 'D:\Python3.13\python.exe' -m pytest `
  .\_dev_archive\tests\gis\test_basemap_extractor.py `
  .\_dev_archive\tests\gis\test_showcase_data.py -q

# ArcPy 制图和 GDB 测试（ArcGIS Pro 环境）
& 'E:\ArcGIS Pro3.6\bin\Python\Scripts\propy.bat' -m pytest `
  .\_dev_archive\tests\gis\test_basemap_arcgis_map.py `
  .\_dev_archive\tests\gis\test_basemap_gdb_builder.py `
  .\_dev_archive\tests\gis\test_showcase_arcgis_map.py `
  .\_dev_archive\tests\gis\test_showcase_gdb_builder.py -q

# Web 与移动端测试
node --test .\_dev_archive\tests\frontend\*.test.js
```

ArcGIS Pro、Network Analyst 与 CityEngine 工具的具体用法，分别查看 `gis/basemap`、`gis/network` 和 `gis/cityengine` 内的说明及脚本头部注释。

## 比赛源码提交规则

提交源码时排除以下目录：

- `_dev_archive`：开发测试和数据制作工具。
- `none`：废弃及过时内容。
- `.venv`：本机 Python 虚拟环境。
- `dist`：便携演示成品，应作为演示包单独提交。

主项目仍保留 `build_demo_package.py` 和 `build_demo_package.bat`，便于代码更新后重新生成便携演示版。
