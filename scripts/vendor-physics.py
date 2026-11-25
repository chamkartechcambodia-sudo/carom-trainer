#!/usr/bin/env python3
"""Trich loi vat ly tu tailuge/billiards vao src/vendor/billiards.

Cach dung:  python3 scripts/vendor-physics.py <duong-dan-toi-ban-checkout-upstream>
Ban upstream da kiem: commit 555bc720d52fdf43cdeb5fad313f22c1f6b2cfc7
Script chi sao chep va cat bo phan giao dien 3D; khong sua cong thuc vat ly.
"""
import re, shutil, sys
from pathlib import Path

up = Path(sys.argv[1]) / "src"
out = Path(__file__).resolve().parent.parent / "src" / "vendor" / "billiards"
HEADER = ("// @ts-nocheck\n"
          "// Nguon: https://github.com/tailuge/billiards (GPL-3.0), commit 555bc72.\n"
          "// File nay duoc sinh boi scripts/vendor-physics.py. KHONG sua tay.\n")

COPY = [
    "model/ball.ts", "model/outcome.ts",
    "model/physics/collision.ts", "model/physics/collisionthrow.ts",
    "model/physics/constants.ts", "model/physics/cushion.ts",
    "model/physics/knuckle.ts", "model/physics/mathavan.ts",
    "model/physics/physics.ts", "model/physics/pocket.ts",
    "model/physics/stronge.ts",
    "utils/three-utils.ts", "utils/utils.ts",
    "view/tablegeometry.ts", "view/pocketgeometry.ts",
]

def must(text, old, new, name):
    if old not in text:
        sys.exit(f"PATCH FAILED in {name}: khong tim thay doan:\n{old}")
    return text.replace(old, new, 1)

def patch_ball(t):
    n = "model/ball.ts"
    t = must(t, 'import { BallMesh } from "../view/ballmesh"\n', "", n)
    t = must(t, 'import { BallAppearance } from "../view/ballappearance"\n', "", n)
    t = must(t, "  readonly ballmesh!: BallMesh\n", "  readonly ballmesh: any = undefined\n", n)
    t = must(t, "  readonly appearance: BallAppearance | undefined\n", "  readonly appearance: any\n", n)
    t = must(t, "appearance?: BallAppearance) {", "appearance?: any) {", n)
    t = re.sub(r"    if \(typeof document !== \"undefined\"\) \{\n      this\.ballmesh = new BallMesh\([\s\S]*?\n      \)\n    \}\n", "", t, count=1)
    if "new BallMesh" in t:
        sys.exit("PATCH FAILED in model/ball.ts: con sot new BallMesh")
    return t

def patch_utils(t):
    n = "utils/utils.ts"
    a = t.index("export function round(")
    b = t.index("// Chat emoji pool")
    return t[a:b].rstrip() + "\n"

PATCH = {"model/ball.ts": patch_ball, "utils/utils.ts": patch_utils}

if out.exists():
    for f in COPY:
        p = out / f
        if p.exists():
            p.unlink()
for f in COPY:
    text = (up / f).read_text(encoding="utf-8")
    if f in PATCH:
        text = PATCH[f](text)
    dst = out / f
    dst.parent.mkdir(parents=True, exist_ok=True)
    dst.write_text(HEADER + text, encoding="utf-8")
print(f"Da trich {len(COPY)} file vao {out}")
