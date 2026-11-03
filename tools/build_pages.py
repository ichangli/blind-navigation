"""Build the Pages artifact from complete project sources and demo adapters."""
from pathlib import Path
import json
import re
import shutil
import hashlib

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'site-demo'


def bundle_arcgis():
    """Populate the AMD cache before requesting SceneView, including in workers.

    A cold SceneView load otherwise fans out into hundreds of script requests.
    Keep the vendor files intact and use the loader's existing cache format.
    """
    for pattern in ['scene-modules-*.js', 'worker-init-*.js']:
        for old in (OUT / 'vendor/arcgis').glob(pattern):
            old.unlink()
    loader = (ROOT / 'vendor/arcgis-loader/init.js').read_text(encoding='utf-8')
    embedded = set(re.findall(r'"(esri/[^"\n]+)":function\(\)', loader))
    entries = []
    for path in sorted((ROOT / 'vendor/arcgis').rglob('*.js'), key=lambda p: p.as_posix()):
        relative = path.relative_to(ROOT / 'vendor/arcgis')
        if 'assets' in relative.parts or relative.name == 'esri.profile.js':
            continue
        module = 'esri/' + relative.with_suffix('').as_posix()
        if module in embedded:
            continue
        source = path.read_text(encoding='utf-8')
        if not re.search(r'\bdefine\(', source):
            raise ValueError('Expected an AMD vendor module: ' + module)
        entries.append(json.dumps(module) + ':function(){\n' + source + '\n}')
    source = 'require({cache:{\n' + ',\n'.join(entries) + ',\n"*noref":1}});\n'
    digest = hashlib.sha256(source.encode()).hexdigest()[:12]
    filename = 'scene-modules-' + digest + '.js'
    write(OUT / 'vendor/arcgis' / filename, source)
    # Workers start from a blob URL, so resolve imports against their loader URL.
    client = 'define(["esri/core/workers/RemoteClient"],function(Client){return Client;});\n'
    write(OUT / 'vendor/arcgis/worker-client.js', client)
    worker = ('var base=new URL(".",self.esriConfig.workers.loaderUrl);\n'
              'importScripts(new URL("init.js",base).href,new URL(' +
              json.dumps(filename) + ',base).href);\n'
              'var cache={"*noref":1};cache[new URL("worker-client.js",base).href]=function(){' +
              client + '};require({cache:cache});\n')
    worker_name = 'worker-init-' + hashlib.sha256(worker.encode()).hexdigest()[:12] + '.js'
    write(OUT / 'vendor/arcgis' / worker_name, worker)
    adapter = (OUT / 'demo-map.js').read_text(encoding='utf-8')
    adapter = adapter.replace('__ARCGIS_MODULE_BUNDLE__', filename).replace('__ARCGIS_WORKER_INIT__', worker_name)
    write(OUT / 'demo-map.js', adapter)


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8', newline='\n')


def build():
    OUT.mkdir(exist_ok=True)
    for folder in ['styles', 'data']:
        shutil.copytree(ROOT / folder, OUT / folder, dirs_exist_ok=True, ignore=shutil.ignore_patterns('*.db', 'uploads', '__pycache__'))
    for path in (ROOT / 'demo').glob('*'):
        if path.is_file():
            shutil.copy2(path, OUT / path.name)
    shutil.copytree(ROOT / 'demo' / 'data', OUT / 'data', dirs_exist_ok=True)
    for folder in ['leaflet']:
        shutil.copytree(ROOT / 'vendor' / folder, OUT / 'vendor' / folder, dirs_exist_ok=True)
    shutil.copytree(ROOT / 'vendor' / 'arcgis', OUT / 'vendor' / 'arcgis' / 'esri', dirs_exist_ok=True)
    shutil.copy2(ROOT / 'vendor' / 'arcgis-loader' / 'init.js', OUT / 'vendor' / 'arcgis' / 'init.js')
    bundle_arcgis()
    shutil.copy2(ROOT / 'shenzhen_data/processed/buildings/futian_buildings_cityengine.geojson', OUT / 'data/buildings.geojson')
    for name in ['context', 'parks', 'roads', 'water']:
        shutil.copy2(ROOT / f'datasets/basemap/{name}.geojson', OUT / f'data/{name}.geojson')
    shutil.copy2(ROOT / 'datasets/showcase/showcase_water.geojson', OUT / 'data/showcase_water.geojson')

    web_mock = json.loads((ROOT / 'data/web-mock-api.json').read_text(encoding='utf-8-sig'))
    cfg = web_mock['mapConfig']
    cfg['localBuildings']['url'] = './data/buildings.geojson'
    cfg['basemap'] = {'provider': 'local'}
    cfg['layers'].update({'roadThematicEnabled': True, 'roadFeatureCount': 52201, 'roadLayerId': 0, 'waterLayerUrl': ''})
    web_mock['dashboard']['stats'][1]['label'] = '示范数据可通行率（样例）'
    web_mock['dashboard']['stats'][1]['change'] = '作品样例指标，非实时监测'
    for period in web_mock['chartPeriods'].values():
        if isinstance(period, dict) and 'title' in period:
            period['title'] += ' · 演示历史'
    write(OUT / 'data/web-mock-api.json', json.dumps(web_mock, ensure_ascii=False))

    shared_head = '<link rel="stylesheet" href="./vendor/leaflet/leaflet.css"><link rel="stylesheet" href="./demo.css"><script src="./vendor/leaflet/leaflet.js"></script><script src="./demo-runtime.js"></script>'
    for filename, adapter in [('Web管理端.html','demo-map.js'), ('移动端.html','demo-mobile.js')]:
        source = (ROOT / filename).read_text(encoding='utf-8-sig')
        source = source.replace('</head>', shared_head + '</head>')
        source = source.replace('</body>', '<script src="./' + adapter + '"></script></body>')
        source = source.replace('a11y_', 'blind-navigation:demo:v1:a11y_')
        source = source.replace('GeoScene · 深圳福田', '本地数据 · 深圳福田')
        source = source.replace('深圳 · 今日晴 32°C', '深圳福田 · 在线演示（非实时天气）')
        source = source.replace('默认使用福田演示点，确保比赛现场稳定调用 GeoScene 无障碍路网。', '采用固定演示起点和三个离线路线案例；不提供任意目的地实时求解。')
        source = source.replace('系统将调用现有 GeoScene 无障碍路网，规划从当前演示起点或设备位置步行到该站的接驳路线。', '站点位置来自本地数据。首版路线仅支持三个案例目的地，其他站点可查看设施信息。')
        source = source.replace('显示真实路线', '显示预设路线案例')
        source = source.replace('实时导航', '路线案例演示').replace('真实定位', '演示起点')
        source = source.replace('GeoScene', '本地数据')
        write(OUT / filename, source)
    for filename, method in [('web.js','getWebApiBase'), ('mobile.js','getMobileApiBase')]:
        source = (ROOT / filename).read_text(encoding='utf-8-sig')
        source, n = re.subn(r'function ' + method + r'\(config\) \{[\s\S]*?^\}', 'function ' + method + '(config) { return window.BlindDemo.apiBase; }', source, count=1, flags=re.M)
        if n != 1:
            raise RuntimeError('Source API function changed: ' + method)
        source = source.replace('a11y_', 'blind-navigation:demo:v1:a11y_')
        if filename == 'web.js':
            for field in ['description','address','landmark']:
                source = source.replace("' + ed." + field + " + '", "' + escapeMapText(ed." + field + ") + '")
            source = source.replace("var base = 'https://js.arcgis.com/4.30/';", "var base = './vendor/arcgis/';")
            source = source.replace("loadScriptOnce('geoscene-arcgis-js', base)", "loadScriptOnce('geoscene-arcgis-js', base + 'init.js')")
            source = source.replace("base + 'esri/themes/dark/main.css'", "base + 'esri/assets/esri/themes/dark/main.css'")
            source = source.replace('<b>GeoScene</b>', '<b>离线案例</b>')
        else:
            source = source.replace('geoscene-safe-route','demo-safe-route').replace('GeoScene安全路线','安全权重案例').replace('GeoScene 无障碍安全路线已绘制','预设路线案例已绘制').replace('高德常规步行','距离优先案例').replace('普通步行兜底','预设路线案例')
            source = source.replace('实时导航','路线案例播报').replace('真实路线','路线案例')
        source = source.replace('(backend-api)', '(browser-demo)')
        write(OUT / filename, source)
    for filename in ['road-visuals.js','water-visuals.js']:
        shutil.copy2(ROOT / filename, OUT / filename)
    for login in ['登录.html','移动端登录.html']:
        write(OUT / login, '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=./index.html"><title>进入盲行演示</title><a href="./index.html">进入在线演示</a></html>')
    write(OUT / '.nojekyll', '')
    # A changed adapter/loader path must not reuse a visitor's old script cache.
    def asset_version(match):
        target = OUT / match.group(2).removeprefix('./')
        if not target.is_file():
            raise FileNotFoundError('Referenced demo asset is missing: ' + match.group(2))
        digest = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
        return match.group(1) + match.group(2) + '?v=' + digest + match.group(3)
    for html in OUT.glob('*.html'):
        source = html.read_text(encoding='utf-8')
        source = re.sub(r'''((?:src|href)=["'])(\./[^"']+\.(?:js|css))(?:\?[^"']*)?(["'])''', asset_version, source)
        write(html, source)
    files = [p for p in OUT.rglob('*') if p.is_file()]
    print(json.dumps({'files':len(files),'MiB':round(sum(p.stat().st_size for p in files)/1048576,2),'artifact':str(OUT)},ensure_ascii=False))


if __name__ == '__main__':
    build()
