# crescent fill/draw by @faretek1 on scratch 

# There is potentially a more optimal algo for this
# A crescent is defined by a main circle and a second circle cut out of it.
proc draw_crescent Circle c1, Circle c2, res {
    local PtX2 isct = intersect_circles($c1, $c2);
    if isct.x1 == intersect_circle_error_codes.notouch {
        draw_circle $c1, $res;
    } elif isct.x1 == intersect_circle_error_codes.circinside {
        if $c1.r > $c2.r {
            draw_circle $c1, $res;
            draw_circle $c2, $res;
        }

    } else {
        local d1 = DIR($c2.x, $c2.y, isct.x2, isct.y2);
        local d2 = DIR($c2.x, $c2.y, isct.x1, isct.y1);

        if d1 < d2 {
            draw_arc_edge pos_from_circle($c2, 180 + d1), -360 + (d2 - d1), $res;
        } else {
            draw_arc_edge pos_from_circle($c2, 180 + d1), d2 - d1, $res;
        }

        d1 = DIR($c1.x, $c1.y, isct.x2, isct.y2);
        d2 = DIR($c1.x, $c1.y, isct.x1, isct.y1);

        if d1 < d2 {
            draw_arc_edge pos_from_circle($c1, 180 + d1), -360 + (d2 - d1), $res;
        } else {
            draw_arc_edge pos_from_circle($c1, 180 + d1), d2 - d1, $res;
        }
    }
}

# There may be a more efficient way to do a crescent using stamps, however it eludes me right now
proc _shapefill_inner_crescent Circle c1, Circle c2, Circle a, dst, dx, dy, flip, res {
    if $dst > $c1.r + $c2.r {
        goto $c1.x, $c1.y;
        set_pen_size 2 * $c1.r;
        PEN_DU;
    } else {
        if $dst < abs($c1.r - $c2.r) and $flip {
            stop_this_script;
        } 
        local b = $a.r * sqrt(1 - ($dst * $dst) / (4 * $a.r * $a.r));
        local a1 = (($c1.r * $c1.r - $c2.r * $c2.r) + $dst * $dst) / (2 * $dst);
        local h1 = sqrt($c1.r * $c1.r - a1 * a1);

        local t1 = 360 + acos(h1 / b);
        local t2 = 180 - acos(h1 / b);

        if $flip {
            t1 -= 180;
            t2 += 180;
        }

        local v1 = $dx / $dst;
        local v2 = $dy / $dst;

        local t = t1;
        local f1 = $a.r * sin(t);
        local f2 = b * cos(t);

        repeat $res + 1 {
            local nf1 = $a.r * sin(t + (t2 - t1) / $res);
            local nf2 = b * cos(t + (t2 - t1) / $res);

            local x = $a.x + v1 * nf1 + v2 * nf2;
            local y = ($a.y + v2 * nf1) - v1 * nf2;
            local th = 2 * ((DIST($c2.x, $c2.y, x, y)) - $c2.r);
            
            goto $a.x + v1 * f1 + v2 * f2,
                 ($a.y + v2 * f1) - v1 * f2;
            
            local th2 = 2 * ((DIST($c2.x, $c2.y, x_position(), y_position())) - $c2.r);
            if th2 > th {
                set_pen_size th;
            } else {
                set_pen_size th2;
            }
            pen_down;

            t += (t2 - t1) / $res;
            f1 = nf1;
            f2 = nf2; 
        }
        pen_up;
    }
}

proc fill_crescent Circle c1, Circle c2, res {
    if $c1.x == $c2.x and $c1.y == $c2.y {
        fill_crescent $c1, Circle{x: $c2.x, y: $c2.y + "1e-5", r: $c2.r}, $res;
    } else {
        _shapefill_inner_crescent $c1, $c2, Circle{
                                      x: ($c1.x + $c2.x) / 2,
                                      y: ($c1.y + $c2.y) / 2,
                                      r: ($c1.r + $c2.r) / 2
                                  },
                                  DIST($c1.x, $c1.y, $c2.x, $c2.y), 
                                  $c2.x - $c1.x, $c2.y - $c1.y,
                                  $c1.r < $c2.r, 2 * $res + 1;
    }
}
