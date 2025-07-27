# 'Cone'/pen-cap filler by @faretek1 and @wolther on scratch --
costumes "backpack/pengine/pengine/cone/*.svg";

proc fill_cone pos p, ext {
    if 0 < $ext and $ext < 180 {
        local r1 = $p.s / cos($ext / 2);
        local r2 = $p.s / cos($ext / 4);
        fill_tri $p.x + r1 * sin($p.d + $ext / 2),
                 $p.y + r1 * cos($p.d + $ext / 2),
                 $p.x + r2 * sin($p.d + $ext / 4),
                 $p.y + r2 * cos($p.d + $ext / 4),
                 $p.x + r2 * sin($p.d + $ext * 0.75),
                 $p.y + r2 * cos($p.d + $ext * 0.75);

        goto_pos pos{
            x: $p.x, y: $p.y,
            s: $p.s * 2,
            d: $p.d
        };

        local i = ceil(log(360 / $ext) / 0.301);
        if i < 6{
            switch_costume "shapefill cone" & i;
            cstamp;

            turn_right $ext - 360 / antilog(0.301 * i);
            cstamp;
        }
    }
}