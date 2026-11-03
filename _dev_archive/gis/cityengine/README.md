# 福田建筑白模 CityEngine 资产

本目录用于 CityEngine 2025.1。建筑输入数据位于：

`D:/盲行/shenzhen_data/processed/buildings/futian_buildings_cityengine.geojson`

规则文件：

`D:/盲行/_dev_archive/gis/cityengine/rules/FutianWhiteModel.cga`

设计原则：

- 低层建筑保持轻量暖白模型。
- 中层建筑增加楼层横向分带。
- 80 米以上建筑使用淡蓝灰玻璃幕墙与竖向分格。
- 按住宅、商业、公共、工业、附属建筑分类配色。
- 屋顶增加轻量设备层，让城市天际线更自然。
- 路线和无障碍事件是视觉主体，因此建筑材质保持低饱和度。

首次导入和规则生成步骤将在建筑质量检查完成后给出。

自动规则分配脚本：

`D:/盲行/_dev_archive/gis/cityengine/scripts/apply_futian_rule.py`
