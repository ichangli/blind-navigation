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

## 演示与正式环境

`run_demo.bat` 仅绑定本机地址，显式设置 `APP_ENV=demo`；仅此模式允许演示账号 `admin / 123456` 与初始化样例业务数据。不要将该启动器用于公网服务。

直接启动默认为 `APP_ENV=production`。复制 `.env.example` 为 `.env`，设置独立的 `JWT_SECRET`（至少 32 字符）与 `ADMIN_PASSWORD`（至少 12 字符）。例如用 `python -c "import secrets; print(secrets.token_urlsafe(48))"` 在本机生成密钥，勿提交真实值。正式模式不自动灌入样例业务记录。

正式启动会拒绝示例 JWT 密钥、弱管理员初始密码、通配或 null CORS 来源。已有数据库若仍使用演示管理员密码也会拒绝启动，修改环境变量不会静默覆盖已有账号密码；须先通过受控数据库维护重设其密码哈希。首次建库才使用 ADMIN_PASSWORD 初始化管理员。

CORS 仅填写实际可信 HTTP/HTTPS 来源。当前认证尚无登录限流，JWT 默认期限为 7 天，公网部署前应结合访问网关和会话策略进一步加固。

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
