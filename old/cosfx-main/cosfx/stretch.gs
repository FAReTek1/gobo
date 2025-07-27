# Stretch script (4000x4000 box) adapted from @ThinkingPlanely on scratch

proc goto_pos_stretch pos p, WxH s {
    local old = costume_number();

    switch_costume "size0";
    set_size "Infinity";

    goto $p.x, $p.y;
    point_in_direction $p.d + 90;

    if $s.h > 0 {
        move ($s.h * ($p.s / 200)) - abs($s.w * ($p.s / 200));
        if $s.w < 0 {
            old++;
        }
        turn_left 90;
    } else {
        move ($s.h * ($p.s / 200)) + abs($s.w * ($p.s / 200));
        if $s.w > 0 {
            old++;
        }
        turn_right 90;
    }

    size_hack abs($s.w * ($p.s / 100));
    switch_costume old;
    
    set_fisheye_effect 100 * (abs(-0.02227639471 / (log(1 - abs($s.h / $s.w) / 20))) - 1);
}
