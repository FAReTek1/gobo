costumes "backpack/pengine/pengine/stlf/*.svg";

# Uh, why doesn't this use a line?
proc STLF Node p1, Node p2, th, style, cap {
    local dist = DIST($p1.x, $p1.y, $p2.x, $p2.y);
    if dist > $th {
        goto_pos_stretch pos{
            x: ($p1.x + $p2.x) / 2,
            y: ($p1.y + $p2.y) / 2,
            s: 100,
            d: DIR($p2.x, $p2.y, $p1.x, $p1.y)
        }, WxH {
            w: dist - $th,
            h: $th
        };
        switch_costume $style;
        cstamp;

        set_fisheye_effect 0;
        size_hack $th;
        switch_costume $cap;
        pos_hack $p1.x + 0.5 * $th * sin(direction()),
                 $p1.y + 0.5 * $th * cos(direction());
        cstamp;

        pos_hack $p2.x - 0.5 * $th * sin(direction()),
                 $p2.y - 0.5 * $th * cos(direction());
        cstamp;

    } else {
        goto_pos_stretch pos{
            x: ($p1.x + $p2.x) / 2,
            y: ($p1.y + $p2.y) / 2,
            s: 100,
            d: DIR($p2.x, $p2.y, $p1.x, $p1.y)
        }, WxH {
            w: dist,
            h: $th
        };
        switch_costume $cap;
        cstamp;
    }
}