"""Add a SafeMinutes edge cost to an exported ArcGIS network template."""

from __future__ import annotations

import argparse
import xml.etree.ElementTree as ET
from pathlib import Path


def child(parent, name):
    result = parent.find(name)
    if result is None:
        raise RuntimeError(f"Missing XML element: {name}")
    return result


def set_expression(assignment, expression):
    for prop in assignment.findall(".//PropertySetProperty"):
        key = prop.find("Key")
        if key is not None and key.text == "Expression":
            child(prop, "Value").text = expression
            return
    raise RuntimeError("Field evaluator expression not found")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--name", default="FutianAccessibleSafe_ND")
    parser.add_argument("--source-name", default="AccessibleRoads_Safe")
    parser.add_argument("--minimal", action="store_true")
    args = parser.parse_args()
    tree = ET.parse(args.input)
    root = tree.getroot()
    root.set("xmlns:xs", "http://www.w3.org/2001/XMLSchema")
    root.set("xmlns:typens", "http://www.esri.com/schemas/ArcGIS/3.6.0")
    child(root, "Name").text = args.name
    child(root, "LogicalNetworkName").text = args.name
    child(root, "CatalogPath").text = f"/FD=FutianNetwork/ND={args.name}"
    for source in root.findall(".//EdgeFeatureSource"):
        if child(source, "Name").text == "AccessibleRoads_Final":
            child(source, "Name").text = args.source_name
    for source in root.findall(".//SystemJunctionSource"):
        child(source, "Name").text = f"{args.name}_Junctions"
    for source_name in root.findall(".//NetworkSourceName"):
        if source_name.text == "AccessibleRoads_Final":
            source_name.text = args.source_name

    attrs = child(root, "EvaluatedNetworkAttributes")
    length_attr = next(item for item in attrs.findall("EvaluatedNetworkAttribute") if child(item, "Name").text == "Length")
    if not args.minimal:
        child(length_attr, "Name").text = "SafeMinutes"
        child(length_attr, "Units").text = "Minutes"
        child(length_attr, "UseByDefault").text = "true"

    assignments = child(root, "NetworkAssignments")
    length_assignments = [
        item for item in assignments.findall("NetworkAssignment")
        if child(item, "NetworkAttributeName").text == "Length"
    ]
    for assignment in length_assignments:
        if not args.minimal:
            child(assignment, "NetworkAttributeName").text = "SafeMinutes"
        source = assignment.find("NetworkSourceName")
        direction = assignment.find("NetworkEdgeDirection")
        if source is not None and source.text == args.source_name and direction is not None:
            set_expression(assignment, "!safe_min!")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    tree.write(args.output, encoding="utf-8", xml_declaration=True)
    print(args.output)


if __name__ == "__main__":
    main()
