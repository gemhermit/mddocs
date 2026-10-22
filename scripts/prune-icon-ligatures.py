#!/usr/bin/env python3
"""裁剪 Material Icons 字体的连字（ligature）规则，只保留指定图标。

为什么需要这一步：
Material Icons 是一套「连字字体」——界面里写的是文本 "menu_book"，
靠 GSUB 的连字规则把它变成一个图形字形。完整字体带 2000 多条连字规则，
而 pyftsubset 只用 --text 裁剪时会把整张连字表保留下来
（实测 2188 个字形只降到 1713，体积只省三分之一）。

正确做法是两步：
  1. 先把 GSUB 里用不到的连字规则删掉（本脚本）
  2. 再对裁剪后的字体跑 pyftsubset --text，闭包就只剩这几个图标了

用法：python3 scripts/prune-icon-ligatures.py <源字体> <输出字体> <图标名>...
"""

import sys
from fontTools.ttLib import TTFont


def ligature_text(first_glyph, component, glyph_to_char):
    """连字规则里存的是「字形名」，不是文本。

    同一套图标在不同字体变体里的编码还不一样：
      - Material Icons Round：组件是字面 '_'、'm'……
      - Material Icons（实心）：组件是 'underscore'、'one' 这类字形名
    所以统一用 cmap 反查把字形名还原成字符，再拼成图标名。
    """
    def to_char(name):
        return glyph_to_char.get(name, name)

    if isinstance(component, str):
        return to_char(first_glyph) + ''.join(to_char(c) for c in component)
    return to_char(first_glyph) + ''.join(to_char(c) for c in component)


def build_glyph_to_char(font):
    """cmap 是 unicode → 字形名，这里反过来要「字形名 → 字符」。"""
    mapping = {}
    for code, glyph_name in font.getBestCmap().items():
        try:
            char = chr(code)
        except ValueError:
            continue
        # 同一个字符可能有多个字形名，保留第一个即可
        mapping.setdefault(glyph_name, char)
    return mapping


def prune_ligature_subst(subst, keep, glyph_to_char):
    removed = 0
    for first_glyph, ligature_set in list(subst.ligatures.items()):
        # 不同 fontTools 版本里，值可能是 LigatureSet 对象，也可能直接是 list
        if hasattr(ligature_set, 'ligatures'):
            entries = ligature_set.ligatures
        else:
            entries = ligature_set

        kept = []
        for ligature in entries:
            if ligature_text(first_glyph, ligature.Component, glyph_to_char) in keep:
                kept.append(ligature)
            else:
                removed += 1

        if hasattr(ligature_set, 'ligatures'):
            ligature_set.ligatures = kept
        else:
            # 该版本 fontTools 里存的就是 list，必须显式写回，否则裁剪不生效
            subst.ligatures[first_glyph] = kept
        if not kept:
            del subst.ligatures[first_glyph]
    return removed


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        return 1

    src, dst = sys.argv[1], sys.argv[2]
    keep = set(sys.argv[3:])

    font = TTFont(src)
    if 'GSUB' not in font:
        print('[warn] 字体没有 GSUB 表，无法裁剪连字')
        font.save(dst)
        return 0

    removed = 0
    glyph_to_char = build_glyph_to_char(font)
    for lookup in font['GSUB'].table.LookupList.Lookup:
        for subtable in lookup.SubTable:
            if hasattr(subtable, 'ligatures'):
                removed += prune_ligature_subst(subtable, keep, glyph_to_char)

    font.save(dst)
    print(f'裁剪连字规则 {removed} 条，保留 {len(keep)} 个图标')
    return 0


if __name__ == '__main__':
    sys.exit(main())
