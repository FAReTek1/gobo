costumes "backpack/pengine/pengine/segment/*.svg";

proc fill_segment pos pos, ext {
    if $ext > 0.703125 {
        if $ext < 360{
            local i = floor(ln($ext / 360) / 0.6931471805599453);
            switch_costume "shapefill segment " & i;

            pos_hack $pos.x, $pos.y;
            size_hack $pos.s * 2;
            point_in_direction $pos.d;

            cstamp;

            i = 360 * antiln(i * 0.6931471805599453);
            if abs(i - $ext) > 0.0000000000001 {
                turn_right $ext - i;
                cstamp;
                local fin = $pos.d + $ext;
                local md = $pos.d + $ext / 2;

                switch_costume "size0";
                set_size "Infinity";
                fill_tri sin($pos.d) * $pos.s + $pos.x,
                         cos($pos.d) * $pos.s + $pos.y,
                         sin(fin) * $pos.s + $pos.x,
                         cos(fin) * $pos.s + $pos.y,
                         sin(md) * $pos.s + $pos.x,
                         cos(md) * $pos.s + $pos.y;
                }
        } else {
            goto $pos.x, $pos.y;
            set_pen_size $pos.s * 2;
            pen_down;pen_up;
        }
    } elif $ext < -0.703125 {
        fill_segment pos{x: $pos.x, y: $pos.y, s: $pos.s, d: $pos.d + $ext}, -$ext;
    } 
}

proc draw_segment pos p, ext, res {
    goto $p.x + $p.s * sin($p.d), 
         $p.y + $p.s * cos($p.d);
    pen_down;

    local angle = $p.d;
    repeat $res {
        angle += $ext / $res;
        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
    }

    goto $p.x + $p.s * sin($p.d), 
         $p.y + $p.s * cos($p.d);

    pen_up;
}
