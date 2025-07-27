# Stretch script (4000x4000 box) adapted from @ThinkingPlanely on scratch

proc goto_pos_stretch pos p, Vec2 s {
    local old = costume_number();

    switch_costume "fenceless.gs//size0";
    set_size "Infinity";

    goto $p.x, $p.y;
    point_in_direction $p.d + 90;

    if $s.y > 0 {
        move ($s.y * ($p.s / 200)) - abs($s.x * ($p.s / 200));
        old += $s.x < 0;
        turn_left 90;
    } else {
        move ($s.y * ($p.s / 200)) + abs($s.x * ($p.s / 200));
        old += $s.x > 0;
        turn_right 90;
    }

    fnc_set_size abs($s.x * ($p.s / 100));
    switch_costume old;
    
    set_fisheye_effect 100 * (abs(-0.02227639471 / (log(1 - abs($s.y / $s.x) / 20))) - 1);
}
