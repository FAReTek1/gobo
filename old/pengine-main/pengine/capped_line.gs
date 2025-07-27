costumes "backpack/pengine/pengine/capped_line/*.svg";

proc fill_capped_line Line l, th, trans {
    local dst = DIST($l.x1, $l.y1, $l.x2, $l.y2);
    if dst < $th {
        local mul = ($th / 2) / dst; 

        # tail recursion is ok
        local mdx = ($l.x1 + $l.x2) / 2;
        local mdy = ($l.y1 + $l.y2) / 2;

        local dx = $l.x1 - $l.x2;
        local dy = $l.y1 - $l.y2;

        fill_capped_line Line{
                            x1: mdx - dy * mul,
                            y1: mdy + dx * mul,
                            x2: mdx + dy * mul,
                            y2: mdy - dx * mul
                         },
                         dst,
                         $trans;
        
    } else {
        if $trans > 0 {
            local cost = "shapefill pencap trans";
        } else {
            local cost = "shapefill pencap opaq";
        }

        point_in_direction DIR($l.x1, $l.y1, $l.x2, $l.y2);

        switch_costume cost;
        pos_size_hack $l.x2 + (dst - $th / 2) * sin(direction()),
                      $l.y2 + (dst - $th / 2) * cos(direction()),
                      $th;

        set_ghost_effect $trans;
        cstamp;
        set_pen_transparency 100;
        set_pen_size $th;
        pen_down;
        set_pen_transparency $trans;
        
        turn_right 180;
        pos_size_hack $l.x1 + (dst - $th / 2) * sin(direction()),
                      $l.y1 + (dst - $th / 2) * cos(direction()),
                      $th;
        pen_up;
        cstamp;
    }
}

proc draw_capped_line Line l, th {
    local vx = line_dx($l);
    local vy = line_dy($l);
    local coef = $th / (2 * sqrt(vx * vx + vy * vy));

    if coef == "Infinity" {stop_this_script;}

    vx *= coef;
    vy *= coef;

    goto $l.x1 + vy, $l.y1 - vx;
    pen_down;
    goto $l.x1 - vy, $l.y1 + vx;
    goto $l.x2 - vy, $l.y2 + vx;
    goto $l.x2 + vy, $l.y2 - vx;
    goto $l.x1 + vy, $l.y1 - vx;
    pen_up;
}