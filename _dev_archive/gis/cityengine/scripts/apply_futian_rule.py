"""Assign and generate the Futian white-model rule in the active CityEngine scene."""

import sys

if sys.platform.startswith("java"):
    from scripting import *
else:
    from cityengine import *


ce = CE()
RULE = "/FutianWhiteModel/rules/FutianWhiteModel.cga"


def main():
    selected = [obj for obj in ce.selection() if ce.isShape(obj)]
    shapes = selected or ce.getObjectsFrom(ce.scene, ce.isShape)
    if not shapes:
        raise RuntimeError("当前场景没有建筑面，请先导入 FutianBuildings_CGCS2000。")
    ce.setRuleFile(shapes, RULE, True)
    ce.setStartRule(shapes, "Building")
    ce.generateModels(shapes, True, False)
    ce.saveFile()
    print("Futian white model generated: {} shapes".format(len(shapes)))


if __name__ == "__main__":
    main()
