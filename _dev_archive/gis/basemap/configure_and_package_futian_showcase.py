"""Create the Futian showcase ArcGIS Pro project, symbols, layer files, and VTPK."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

import arcpy

if __package__:
    from .basemap_policy import SCALE_POLICY
    from .showcase_policy import ROAD_STYLE_POLICY, SHOWCASE_STYLE_POLICY
else:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from basemap.basemap_policy import SCALE_POLICY
    from basemap.showcase_policy import ROAD_STYLE_POLICY, SHOWCASE_STYLE_POLICY


PROJECT_TEMPLATE = Path(
    r"E:\ArcGIS Pro3.6\Resources\ArcToolBox\Services\routingservices\data\Blank.aprx"
)
APPROVED_ROOT = Path(r"E:\GIS_data\futian_showcase_basemap")
PACKAGE_MIN_SCALE = SCALE_POLICY["package_min"]
PACKAGE_MAX_SCALE = SCALE_POLICY["package_max"]
BASEMAP_MAP_NAME = "FutianShowcaseBasemap"
OPERATIONAL_MAP_NAME = "FutianShowcaseOperationalLayers"
SUMMARY = "福田区盲行系统展示型深海蓝矢量底图"
TAGS = "福田区,深海蓝,展示型水域,主干路,矢量切片,盲行,GeoScene"


def hex_to_rgba(value: str, alpha: int = 100) -> list[int]:
    """Convert a CSS color to ArcGIS RGB plus 0-100 alpha."""

    text = value.lstrip("#")
    if len(text) != 6:
        raise ValueError(f"Expected six-digit hex color, got {value!r}")
    return [int(text[index : index + 2], 16) for index in (0, 2, 4)] + [int(alpha)]


def water_layer_specs() -> list[dict[str, Any]]:
    return [
        {
            "water_class": "minor",
            "name": "水域-小型",
            "where": "water_class = 'minor'",
            "fill": SHOWCASE_STYLE_POLICY["water_minor"],
            "fill_alpha": 82,
            "outline_alpha": 35,
            "outline_width": 0.15,
        },
        {
            "water_class": "medium",
            "name": "水域-中型",
            "where": "water_class = 'medium'",
            "fill": SHOWCASE_STYLE_POLICY["water_medium"],
            "fill_alpha": 88,
            "outline_alpha": 55,
            "outline_width": 0.25,
        },
        {
            "water_class": "major",
            "name": "水域-主要",
            "where": "water_class = 'major'",
            "fill": SHOWCASE_STYLE_POLICY["water_major"],
            "fill_alpha": 96,
            "outline_alpha": 80,
            "outline_width": 0.45,
        },
    ]


def road_layer_specs() -> list[dict[str, Any]]:
    names = {"secondary": "精选次干路", "primary": "主干路", "expressway": "快速路"}
    strokes = {"glow": "外发光", "casing": "暗色包边", "core": "高亮核心"}
    output: list[dict[str, Any]] = []
    for road_class in ("secondary", "primary", "expressway"):
        style = ROAD_STYLE_POLICY[road_class]
        for stroke in ("glow", "casing", "core"):
            output.append(
                {
                    "road_class": road_class,
                    "stroke": stroke,
                    "name": f"道路-{names[road_class]}-{strokes[stroke]}",
                    "where": f"road_class = '{road_class}'",
                    "min_scale": float(style["min_scale"]),
                    "color": str(style[f"{stroke}_color"]),
                    "width": float(style[f"{stroke}_width"]),
                    "alpha": int(style[f"{stroke}_alpha"]),
                }
            )
    return output


def place_layer_specs() -> list[dict[str, Any]]:
    return [
        {
            "place_class": "suburb",
            "name": "注记-街道片区",
            "where": "place_class = 'suburb'",
            "min_scale": 150000,
            "font_size": 9.5,
        },
        {
            "place_class": "quarter",
            "name": "注记-社区片区",
            "where": "place_class = 'quarter'",
            "min_scale": 50000,
            "font_size": 8.5,
        },
        {
            "place_class": "park",
            "name": "注记-核心公园",
            "where": "place_class = 'park'",
            "min_scale": 50000,
            "font_size": 8.5,
        },
        {
            "place_class": "metro",
            "name": "注记-地铁站",
            "where": "place_class = 'metro'",
            "min_scale": 30000,
            "font_size": 8.5,
        },
    ]


def _normalized(path: Path) -> str:
    return os.path.normcase(os.path.abspath(os.fspath(path)))


def _validate_root(root: Path) -> None:
    if _normalized(root) != _normalized(APPROVED_ROOT):
        raise ValueError("Refusing to package outside the approved showcase directory")
    required = [
        root / "FutianShowcaseBasemap.gdb" / name
        for name in (
            "ShowcaseContext",
            "ShowcaseWater",
            "ShowcaseParks",
            "ShowcaseRoads",
            "ShowcasePlaces",
            "FutianBoundary",
        )
    ]
    missing = [str(path) for path in required if not arcpy.Exists(str(path))]
    if missing:
        raise FileNotFoundError("Missing showcase feature classes: " + ", ".join(missing))


def _add_layer(map_object, feature_class: Path, name: str, where: str = "", min_scale: float = 0):
    layer = map_object.addDataFromPath(str(feature_class))
    layer.name = name
    if where:
        layer.definitionQuery = where
    layer.minThreshold = float(min_scale)
    layer.maxThreshold = 0.0
    return layer


def _apply_polygon(
    layer,
    fill: str,
    outline: str,
    outline_width: float,
    fill_alpha: int = 100,
    outline_alpha: int = 100,
) -> None:
    symbology = layer.symbology
    symbology.updateRenderer("SimpleRenderer")
    symbol = symbology.renderer.symbol
    symbol.color = {"RGB": hex_to_rgba(fill, fill_alpha)}
    symbol.outlineColor = {"RGB": hex_to_rgba(outline, outline_alpha)}
    symbol.outlineWidth = float(outline_width)
    layer.symbology = symbology


def _apply_line(layer, color: str, width: float, alpha: int = 100) -> None:
    symbology = layer.symbology
    symbology.updateRenderer("SimpleRenderer")
    symbology.renderer.symbol.color = {"RGB": hex_to_rgba(color, alpha)}
    symbology.renderer.symbol.size = float(width)
    layer.symbology = symbology


def _apply_point(layer, color: str, size: float, alpha: int = 1) -> None:
    symbology = layer.symbology
    symbology.updateRenderer("SimpleRenderer")
    symbology.renderer.symbol.color = {"RGB": hex_to_rgba(color, alpha)}
    symbology.renderer.symbol.size = float(size)
    layer.symbology = symbology


def _cim_color(values: list[int]):
    color = arcpy.cim.CreateCIMObjectFromClassName("CIMRGBColor", "V3")
    color.values = values
    return color


def _configure_labels(layer, min_scale: float, font_size: float) -> None:
    label_classes = layer.listLabelClasses()
    if not label_classes:
        raise RuntimeError(f"Layer does not expose a label class: {layer.name}")
    label_class = label_classes[0]
    label_class.expression = "$feature.label_name"
    label_class.SQLQuery = "label_name IS NOT NULL AND label_name <> ''"
    label_class.visible = True
    cim_label = label_class.getDefinition("V3")
    cim_label.minimumScale = float(min_scale)
    cim_label.maximumScale = 0.0
    text_symbol = cim_label.textSymbol.symbol
    text_symbol.fontFamilyName = "Microsoft YaHei"
    text_symbol.fontStyleName = "Regular"
    text_symbol.height = float(font_size)
    text_symbol.symbol.symbolLayers[0].color = _cim_color(
        hex_to_rgba(SHOWCASE_STYLE_POLICY["label"])
    )
    halo_fill = arcpy.cim.CreateCIMObjectFromClassName("CIMSolidFill", "V3")
    halo_fill.color = _cim_color(hex_to_rgba(SHOWCASE_STYLE_POLICY["background"], 94))
    halo_symbol = arcpy.cim.CreateCIMObjectFromClassName("CIMPolygonSymbol", "V3")
    halo_symbol.symbolLayers = [halo_fill]
    text_symbol.haloSymbol = halo_symbol
    text_symbol.haloSize = 1.0
    label_class.setDefinition(cim_label)
    layer.showLabels = True


def _set_metadata(map_object, title: str, description: str) -> None:
    metadata = map_object.metadata
    metadata.title = title
    metadata.summary = SUMMARY
    metadata.description = description
    metadata.tags = TAGS
    metadata.save()


def save_layer_copy(layer, path: Path) -> None:
    """Persist a complete CIM layer document from a map Layer object."""

    layer.saveACopy(str(path))


def _clear_map(map_object) -> None:
    for layer in list(map_object.listLayers()):
        map_object.removeLayer(layer)
    try:
        map_object.spatialReference = arcpy.SpatialReference(3857)
    except (AttributeError, RuntimeError):
        pass


def _open_or_create_project(root: Path):
    project_path = root / "FutianShowcaseBasemap.aprx"
    if not project_path.is_file():
        template = arcpy.mp.ArcGISProject(str(PROJECT_TEMPLATE))
        template.saveACopy(str(project_path))
        del template
    project = arcpy.mp.ArcGISProject(str(project_path))
    project.defaultGeodatabase = str(root / "FutianShowcaseBasemap.gdb")

    base_maps = project.listMaps(BASEMAP_MAP_NAME)
    if base_maps:
        basemap = base_maps[0]
    else:
        candidates = [item for item in project.listMaps() if item.name != OPERATIONAL_MAP_NAME]
        basemap = candidates[0] if candidates else project.createMap(BASEMAP_MAP_NAME, "MAP")
        basemap.name = BASEMAP_MAP_NAME
    operational_maps = project.listMaps(OPERATIONAL_MAP_NAME)
    operational = (
        operational_maps[0]
        if operational_maps
        else project.createMap(OPERATIONAL_MAP_NAME, "MAP")
    )
    _clear_map(basemap)
    _clear_map(operational)
    return project, basemap, operational, project_path


def _configure_basemap(map_object, gdb: Path) -> None:
    context = _add_layer(map_object, gdb / "ShowcaseContext", "深海蓝陆地背景")
    _apply_polygon(
        context,
        SHOWCASE_STYLE_POLICY["land"],
        SHOWCASE_STYLE_POLICY["land"],
        0,
    )
    parks = _add_layer(map_object, gdb / "ShowcaseParks", "公园与绿地")
    _apply_polygon(parks, SHOWCASE_STYLE_POLICY["park"], "#1C5D61", 0.2, 92, 55)

    for spec in water_layer_specs():
        layer = _add_layer(map_object, gdb / "ShowcaseWater", spec["name"], spec["where"])
        _apply_polygon(
            layer,
            spec["fill"],
            SHOWCASE_STYLE_POLICY["water_outline"],
            spec["outline_width"],
            spec["fill_alpha"],
            spec["outline_alpha"],
        )

    for spec in road_layer_specs():
        layer = _add_layer(
            map_object,
            gdb / "ShowcaseRoads",
            spec["name"],
            spec["where"],
            spec["min_scale"],
        )
        _apply_line(layer, spec["color"], spec["width"], spec["alpha"])

    boundary = _add_layer(map_object, gdb / "FutianBoundary", "福田区界")
    _apply_polygon(
        boundary,
        SHOWCASE_STYLE_POLICY["land"],
        SHOWCASE_STYLE_POLICY["boundary"],
        1.2,
        1,
        90,
    )

    road_labels = _add_layer(
        map_object,
        gdb / "ShowcaseRoads",
        "注记-快速路与主干路",
        "display_rank <= 2 AND label_name IS NOT NULL AND label_name <> ''",
        50000,
    )
    _apply_line(road_labels, SHOWCASE_STYLE_POLICY["label"], 0.1, 1)
    _configure_labels(road_labels, 50000, 8.2)

    water_labels = _add_layer(
        map_object,
        gdb / "ShowcaseWater",
        "注记-主要水域",
        "display_rank = 1 AND label_name IS NOT NULL AND label_name <> ''",
        150000,
    )
    _apply_polygon(
        water_labels,
        SHOWCASE_STYLE_POLICY["water_major"],
        SHOWCASE_STYLE_POLICY["water_outline"],
        0.1,
        1,
        1,
    )
    _configure_labels(water_labels, 150000, 9.0)

    for spec in place_layer_specs():
        layer = _add_layer(
            map_object,
            gdb / "ShowcasePlaces",
            spec["name"],
            spec["where"],
            spec["min_scale"],
        )
        _apply_point(layer, SHOWCASE_STYLE_POLICY["label"], 1.0, 1)
        _configure_labels(layer, spec["min_scale"], spec["font_size"])

    district = _add_layer(
        map_object,
        gdb / "FutianBoundary",
        "注记-福田区",
        "label_name IS NOT NULL AND label_name <> ''",
        SCALE_POLICY["district_labels"],
    )
    _apply_polygon(
        district,
        SHOWCASE_STYLE_POLICY["land"],
        SHOWCASE_STYLE_POLICY["boundary"],
        0.1,
        1,
        1,
    )
    _configure_labels(district, SCALE_POLICY["district_labels"], 14.0)
    _set_metadata(
        map_object,
        BASEMAP_MAP_NAME,
        "深海蓝安静背景、分级水域与三层发光城市主干路，用于生成托管矢量切片。",
    )


def _configure_operational(map_object, gdb: Path, root: Path) -> list[Path]:
    water = _add_layer(map_object, gdb / "ShowcaseWater", "展示型水域（发布）")
    _apply_polygon(
        water,
        SHOWCASE_STYLE_POLICY["water_major"],
        SHOWCASE_STYLE_POLICY["water_outline"],
        0.45,
        88,
        80,
    )
    roads = _add_layer(map_object, gdb / "ShowcaseRoads", "展示型主干路（发布）")
    _apply_line(roads, "#39D1F2", 2.4, 96)
    _set_metadata(
        map_object,
        OPERATIONAL_MAP_NAME,
        "用于分别发布展示型水域和主干路要素服务；Web 端可根据字段二次渲染。",
    )
    water_file = root / "ShowcaseWater.lyrx"
    roads_file = root / "ShowcaseRoads.lyrx"
    save_layer_copy(water, water_file)
    save_layer_copy(roads, roads_file)
    return [water_file, roads_file]


def configure_project(root: Path):
    """Create both maps, all symbols, and standalone layer files."""

    root = Path(root)
    _validate_root(root)
    gdb = root / "FutianShowcaseBasemap.gdb"
    project, basemap, operational, project_path = _open_or_create_project(root)
    _configure_basemap(basemap, gdb)
    layer_files = _configure_operational(operational, gdb, root)
    project.save()
    return project, basemap, operational, project_path, layer_files


def configure_and_package(root: Path, configure_only: bool = False) -> dict[str, Any]:
    """Create the project and optionally package the VTPK."""

    arcpy.env.overwriteOutput = True
    root = Path(root)
    project, basemap, operational, project_path, layer_files = configure_project(root)
    vtpk_path = root / "FutianShowcaseBasemap.vtpk"
    status = "configured"
    if not configure_only:
        arcpy.management.CreateVectorTilePackage(
            basemap,
            str(vtpk_path),
            "ONLINE",
            tile_structure="INDEXED",
            min_cached_scale=PACKAGE_MIN_SCALE,
            max_cached_scale=PACKAGE_MAX_SCALE,
            summary=SUMMARY,
            tags=TAGS,
        )
        status = "packaged"
    project.save()
    report: dict[str, Any] = {
        "status": status,
        "project": str(project_path),
        "maps": {
            BASEMAP_MAP_NAME: [layer.name for layer in basemap.listLayers()],
            OPERATIONAL_MAP_NAME: [layer.name for layer in operational.listLayers()],
        },
        "vtpk": str(vtpk_path),
        "package_min_scale": PACKAGE_MIN_SCALE,
        "package_max_scale": PACKAGE_MAX_SCALE,
        "layer_files": [str(path) for path in layer_files],
    }
    (root / "map_package_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    manifest = {
        "publish_order": [
            {
                "artifact": str(vtpk_path),
                "title": "FutianShowcaseBasemap",
                "target": "Hosted vector tile layer",
            },
            {
                "map": OPERATIONAL_MAP_NAME,
                "layer": "展示型水域（发布）",
                "title": "FutianShowcaseWater",
                "target": "Hosted feature layer",
            },
            {
                "map": OPERATIONAL_MAP_NAME,
                "layer": "展示型主干路（发布）",
                "title": "FutianShowcaseRoads",
                "target": "Hosted feature layer",
            },
        ],
        "web_renderer_note": (
            "Dynamic water is applied in SceneView from waterbody_size and wave_strength; "
            "the VTPK intentionally contains only a static fallback."
        ),
    }
    (root / "publication_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    del project
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=APPROVED_ROOT)
    parser.add_argument("--configure-only", action="store_true")
    args = parser.parse_args()
    report = configure_and_package(args.root, args.configure_only)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
