proc fill_circle Circle c {
    # literally paint a dot
    goto $c.x, $c.y;
    set_pen_size 2 * $c.r;
    pen_down; pen_up;
}

proc draw_circle Circle c, res {
    local angle = 0;
    goto $c.x, $c.y + $c.r;
    pen_down;

    repeat $res {
        angle += 360 / $res;
        goto $c.x + $c.r * sin(angle), $c.y + $c.r * cos(angle);
    }

    pen_up;
}

# Alternate name: fill vesica
proc clip_circles Circle c1, Circle c2 {
    # render the intersection between 2 circles. todo: make a struct that this outputs and seperate rendering and clipping
    local PtX2 isct = intersect_circles($c1, $c2);
    if isct.x1 == intersect_circle_error_codes.circinside {
        if $c1.r > $c2.r {
            fill_circle $c2;
        } else {
            fill_circle $c1;
        }
        
    } elif isct.x1 != intersect_circle_error_codes.notouch {
        local d1 = DIR($c2.x, $c2.y, isct.x2, isct.y2);
        local d2 = DIR($c2.x, $c2.y, isct.x1, isct.y1);

        if d1 < d2 {
            fill_segment pos_from_circle($c2, 180 + d1), -360 + (d2 - d1);
        } else {
            fill_segment pos_from_circle($c2, 180 + d1), d2 - d1;
        }

        d1 = DIR($c1.x, $c1.y, isct.x2, isct.y2);
        d2 = DIR($c1.x, $c1.y, isct.x1, isct.y1);

        if d1 < d2 {
            fill_segment pos_from_circle($c1, 180 + d2), d1 - d2;
        } else {
            fill_segment pos_from_circle($c1, 180 + d2), -360 + (d1 - d2);
        }
    }
}