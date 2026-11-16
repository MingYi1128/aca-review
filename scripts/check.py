#!/usr/bin/env python3
"""Validate content/manifest.json: every referenced file exists, ids are unique, exam numbering matches solutions."""
import json, re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
m = json.loads((root / "content/manifest.json").read_text(encoding="utf-8"))
errs = []
ids = [x["id"] for x in m["lectures"] + m["exams"]]
errs += [f"duplicate id: {i}" for i in set(ids) if ids.count(i) > 1]
for x in m["lectures"]:
    if not (root / x["file"]).exists(): errs.append(f"missing {x['file']}")
for e in m["exams"]:
    for k in ("file", "solution"):
        if not (root / e[k]).exists(): errs.append(f"missing {e[k]}")
    if not isinstance(e.get("minutes"), int): errs.append(f"{e['id']}: minutes must be int")
    if (root / e["file"]).exists() and (root / e["solution"]).exists():
        q = re.findall(r"^\*\*(\d+)\.", (root / e["file"]).read_text(encoding="utf-8"), re.M)
        a = re.findall(r"^##+ (\d+)\.", (root / e["solution"]).read_text(encoding="utf-8"), re.M)
        skip = "check: skip-numbering" in (root / e["solution"]).read_text(encoding="utf-8")
        if q and a and q != a and not skip: errs.append(f"{e['id']}: question numbers {q} != solution numbers {a}")
print("\n".join(errs) or "OK: manifest valid")
sys.exit(1 if errs else 0)
