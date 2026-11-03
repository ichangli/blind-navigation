# 无障碍出行助手后端

本后端是一个 Windows 本机可运行的 FastAPI 单体服务，负责注册登录、移动端无障碍上报、PostgreSQL 入库、Web 无障碍治理端事件/地图/图表 API。

## 启动

```bat
python -m venv .venv
.venv\Scripts\activate
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r backend\requirements.txt
python backend\init_db.py
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

默认管理员：

```text
admin / 123456
```

当前本机 `.env` 已按实际 PostgreSQL 配置为：

```text
127.0.0.1:1234 / blind_path
```

## 三维建筑白模

后端默认挂载福田区 8,897 栋建筑的 GeoJSON：

```text
D:/盲行/shenzhen_data/processed/buildings/futian_buildings_cityengine.geojson
```

浏览器访问地址：

```text
http://127.0.0.1:8000/data/buildings/futian_buildings_cityengine.geojson
```

`GET /api/web/map/config` 会优先返回同源的 I3S SceneLayer 代理地址
`/api/web/map/scene`。Web 管理端按镜头范围分块并使用 LOD 渲染完整 8,897 栋
建筑；远程服务不可用时，才回退到 `localBuildings` GeoJSON，并在 ArcGIS
`SceneView` 中按 `height_m` 字段拉伸建筑。

I3S 资源由 FastAPI 流式转发并保留上游缓存头。这也用于兼容浏览器不信任
GeoScene 内网证书链的情况，是否校验证书由 `GEOSCENE_VERIFY_SSL` 控制。

当前已验证并接入的 GeoScene 白模服务：

```text
https://ichangli.gisonline.cn/server/rest/services/Hosted/FutianTiles/SceneServer
```

当前已验证并接入的无障碍路线分析服务：

```text
https://ichangli.gisonline.cn/server/rest/services/rouate/FutianAccessibleRoute_v2/NAServer
Route 图层：路径
阻抗：SafeMinutes
```

旧的 `WUHAN_3DTILES_DIR`/`WUHAN_3DTILES_ROUTE` 配置仍保留为兼容性兜底，未配置时不启用。

接口文档：

```text
http://127.0.0.1:8000/docs
```
