"""Create the styled ArcGIS Pro map and vector tile package without editing source data."""

from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Any

import arcpy

if __package__:
    from .basemap_policy import SCALE_POLICY, STYLE_POLICY
else:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from basemap.basemap_policy import SCALE_POLICY, STYLE_POLICY


PROJECT_TEMPLATE = Path(
    r"E:\ArcGIS Pro3.6\Resources\ArcToolBox\Services\routingservices\data\Blank.aprx"
)
APPROVED_ROOT = Path(r"E:\GIS_data\futian_deepsea_basemap")
PACKAGE_MIN_SCALE = SCALE_POLICY["package_min"]
PACKAGE_MAX_SCALE = SCALE_POLICY["package_max"]
MAP_NAME = "FutianDeepSeaBasemap"
SUMMARY = "福田区盲行系统自托管深海蓝矢量底图"
TAGS = "福田区,深海蓝,矢量切片,盲行,GeoScene"


def hex_to_rgba(value: str, alpha: int = 100) -> list[int]:
    """Convert a CSS hex color to ArcGIS RGB values with 0-100 alpha."""

    text = value.lstrip("#")
    if len(text) != 6:
        raise ValueError(f"Expected six-digit hex color, got {value!r}")
    return [int(text[index : index + 2], 16) for index in (0, 2, 4)] + [int(alpha)]


def road_layer_specs() -> list[dict[str, Any]]:
    return [
        {
            "road_class": "tertiary",
            "name": "道路-次干路",
            "where": "road_class = 'tertiary'",
            "min_scale": 30000,
            "color": "#1D3D54",
            "width": 0.8,
        },
        {
            "road_class": "secondary",
            "name": "道路-次要主干路",
            "where": "road_class = 'secondary'",
            "min_scale": 80000,
            "color": "#244963",
            "width": 1.25,
        },
        {
            "road_class": "primary",
            "name": "道路-主干路",
            "where": "road_class = 'primary'",
            "min_scale": 150000,
            "color": "#2D5874",
            "width": 1.8,
        },
        {
            "road_class": "expressway",
            "name": "道路-快速路",
            "where": "road_class = 'expressway'",
            "min_scale": 0,
            "color": "#366784",
            "width": 2.2,
        },
    ]


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
        raise ValueError("Refusing to package outside the approved derived-data directory")
    required = [
        root / "FutianDeepSeaBasemap.gdb" / name
        for name in (
            "DeepSeaContext",
            "DeepSeaWater",
            "DeepSeaParks",
            "DeepSeaRoads",
            "DeepSeaPlaces",
            "FutianBoundary",
        )
    ]
    missing = [str(path) for path in required if not arcpy.Exists(str(path))]
    if missing:
        raise FileNotFoundError("Missing basemap feature classes: " + ", ".join(missing))


def _add_layer(map_object, feature_class: Path, name: str, where: str = "", min_scale: float = 0):
    layer = map_object.addDataFromPath(str(feature_class))
    layer.name = name
    if where:
        layer.definitionQuery = where
    layer.minThreshold = float(min_scale)
    layer.maxThreshold = 0.0
    return layer


def _apply_polygon(layer, fill: str, outline: str, outline_width: float, fill_alpha: int = 100) -> None:
    symbology = layer.symbology
    symbology.updateRenderer("SimpleRenderer")
    symbol = symbology.renderer.symbol
    symbol.color = {"RGB": hex_to_rgba(fill, fill_alpha)}
    symbol.outlineColor = {"RGB": hex_to_rgba(outline, 100 if outline_width else 0)}
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
        hex_to_rgba(STYLE_POLICY["label"])
    )
    halo_fill = arcpy.cim.CreateCIMObjectFromClassName("CIMSolidFill", "V3")
    halo_fill.color = _cim_color(hex_to_rgba(STYLE_POLICY["background"], 92))
    halo_symbol = arcpy.cim.CreateCIMObjectFromClassName("CIMPolygonSymbol", "V3")
    halo_symbol.symbolLayers = [halo_fill]
    text_symbol.haloSymbol = halo_symbol
    text_symbol.haloSize = 1.0
    label_class.setDefinition(cim_label)
    layer.showLabels = True


def _set_map_metadata(map_object) -> None:
    metadata = map_object.metadata
    metadata.title = MAP_NAME
    metadata.summary = SUMMARY
    metadata.description = (
        "福田区及周边两千米范围的极简深海蓝矢量底图。"
        "建筑、无障碍路网、设施和事件作为独立业务图层叠加。"
    )
    metadata.tags = TAGS
    metadata.save()


def _open_or_create_project(root: Path):
    output_project = root / f"{MAP_NAME}.aprx"
    if not output_project.is_file():
        template = arcpy.mp.ArcGISProject(str(PROJECT_TEMPLATE))
        template.saveACopy(str(output_project))
        del template
    project = arcpy.mp.ArcGISProject(str(output_project))
    project.defaultGeodatabase = str(root / "FutianDeepSeaBasemap.gdb")
    maps = project.listMaps(MAP_NAME)
    if maps:
        map_object = maps[0]
    else:
        all_maps = project.listMaps()
        map_object = all_maps[0] if all_maps else project.createMap(MAP_NAME, "MAP")
        map_object.name = MAP_NAME
    for layer in list(map_object.listLayers()):
        map_object.removeLayer(layer)
    return project, map_object, output_project


def configure_map(root: Path):
    """Create an idempotent styled map and save the generated ArcGIS project."""

    root = Path(root)
    _validate_root(root)
    gdb = root / "FutianDeepSeaBasemap.gdb"
    project, map_object, project_path = _open_or_create_project(root)

    context = _add_layer(map_object, gdb / "DeepSeaContext", "深海蓝陆地背景")
    _apply_polygon(context, STYLE_POLICY["land"], STYLE_POLICY["land"], 0)
    water = _add_layer(map_object, gdb / "DeepSeaWater", "水域")
    _apply_polygon(water, STYLE_POLICY["water"], "#0A2A46", 0.25)
    parks = _add_layer(map_object, gdb / "DeepSeaParks", "公园与绿地")
    _apply_polygon(parks, STYLE_POLICY["park"], "#19505A", 0.2)

    for spec in road_layer_specs():
        layer = _add_layer(
            map_object,
            gdb / "DeepSeaRoads",
            spec["name"],
            spec["where"],
            spec["min_scale"],
        )
        _apply_line(layer, spec["color"], spec["width"])

    boundary = _add_layer(map_object, gdb / "FutianBoundary", "福田区界")
    _apply_polygon(boundary, STYLE_POLICY["land"], STYLE_POLICY["boundary"], 1.2, 1)

    road_labels = _add_layer(
        map_object,
        gdb / "DeepSeaRoads",
        "注记-主干路",
        "label_name IS NOT NULL AND label_name <> ''",
        SCALE_POLICY["road_labels"],
    )
    _apply_line(road_labels, STYLE_POLICY["label"], 0.1, 1)
    _configure_labels(road_labels, SCALE_POLICY["road_labels"], 8.0)

    for spec in place_layer_specs():
        layer = _add_layer(
            map_object,
            gdb / "DeepSeaPlaces",
            spec["name"],
            spec["where"],
            spec["min_scale"],
        )
        _apply_point(layer, STYLE_POLICY["label"], 1.0, 1)
        _configure_labels(layer, spec["min_scale"], spec["font_size"])

    district_labels = _add_layer(
        map_object,
        gdb / "FutianBoundary",
        "注记-福田区",
        "label_name IS NOT NULL AND label_name <> ''",
        SCALE_POLICY["district_labels"],
    )
    _apply_polygon(
        district_labels,
        STYLE_POLICY["land"],
        STYLE_POLICY["boundary"],
        0.1,
        1,
    )
    _configure_labels(district_labels, SCALE_POLICY["district_labels"], 14.0)

    _set_map_metadata(map_object)
    project.save()
    return project, map_object, project_path


def configure_and_package(root: Path, configure_only: bool = False) -> dict[str, Any]:
    """Create the project and, unless requested otherwise, build the VTPK."""

    arcpy.env.overwriteOutput = True
    root = Path(root)
    project, map_object, project_path = configure_map(root)
    vtpk_path = root / f"{MAP_NAME}.vtpk"
    status = "configured"
    if not configure_only:
        arcpy.management.CreateVectorTilePackage(
            map_object,
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
    report = {
        "status": status,
        "project": str(project_path),
        "map": MAP_NAME,
        "vtpk": str(vtpk_path),
        "package_min_scale": PACKAGE_MIN_SCALE,
        "package_max_scale": PACKAGE_MAX_SCALE,
        "layer_count": len(map_object.listLayers()),
        "layers": [layer.name for layer in map_object.listLayers()],
    }
    (root / "map_package_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8"
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
