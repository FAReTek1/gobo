# Dynamic-width lines defined by 2 circles
# Inspired by @chooper100 but no code adaption
# by faretek1
proc _shapefill_inner_fill_dw_line_fast Circle c1, Circle c2, dx, dy{
    # Fast line fill, but not 100% accurate
    local dst = sqrt($dx * $dx + $dy * $dy);

    local vx = $dy / -dst;
    local vy = $dx / dst;

    local th = $c1.r / 4;
    set_pen_size $c1.r;
    goto $c1.x, $c1.y;
    pen_down;

    local x = $c1.x;
    local y = $c1.y;
    local done = false;

    until done {
        local m = (2 * th - $c1.r) / ($c2.r - $c1.r);

        if m > 1 {
            done = true;
            th = th * 2 - $c2.r * 0.5;
            
            set_pen_size $c2.r;

            goto x + th * vx, y + th * vy;
            goto $c2.x, $c2.y;
            goto x - th * vx, y - th * vy;

            pen_up;
        } else {
            local ox = x;
            local oy = y;

            x = $c1.x + m * $dx;
            y = $c1.y + m * $dy;

            set_pen_size 2 * th;
            goto ox + th * vx, oy + th * vy;
            goto x, y;
            goto ox - th * vx, oy - th * vy;

            th *= 0.5;
        }
    }

}

proc fill_dw_line_fast Circle c1, Circle c2 {
    if $c1.r == $c2.r {
        set_pen_size $c1.r * 2;
        goto $c1.x, $c1.y;
        pen_down;
        goto $c2.x, $c2.y;
        pen_up;

    } elif $c1.r > $c2.r {
        _shapefill_inner_fill_dw_line_fast Circle{x: $c1.x, y: $c1.y, r: $c1.r * 2},
                                           Circle{x: $c2.x, y: $c2.y, r: $c2.r * 2},
                                           $c2.x - $c1.x, $c2.y - $c1.y;
    } else {
        _shapefill_inner_fill_dw_line_fast Circle{x: $c2.x, y: $c2.y, r: $c2.r * 2},
                                           Circle{x: $c1.x, y: $c1.y, r: $c1.r * 2},
                                           $c1.x - $c2.x, $c1.y - $c2.y;
    }
}

################################################################

# Uses quad fill and tangent calcuation
# by faretek1
proc fill_dw_line_perfect Circle c1, Circle c2 {
    # Fill a dw line using a quad fill
    if $c1.r == $c2.r {
        goto $c1.x, $c1.y;
        set_pen_size $c1.r * 2;
        pen_down;
        goto $c2.x, $c2.y;
        pen_up;

    } elif $c2.r > $c1.r {
        fill_dw_line_perfect $c2, $c1;

    } else {
        local ir = ($c1.r - $c2.r);
        local PtX2 ps = get_tangent_points_of_circle_to_point(
            Circle{
                x: 0, 
                y: 0, 
                r: ir
            }, Node{
                x: $c2.x - $c1.x,
                y: $c2.y - $c1.y
            });
        
        if ps.x1 == intersect_circle_error_codes.circinside {
            goto $c1.x, $c1.y;
            set_pen_size $c1.r * 2;
            pen_down;
            pen_up;

        } elif ps.x1 != intersect_circle_error_codes.notouch {
            ps.x1 /= ir;
            ps.y1 /= ir;
            ps.x2 /= ir;
            ps.y2 /= ir;

            goto $c1.x, $c1.y;
            set_pen_size $c1.r * 2;
            PEN_DU;

            goto $c2.x, $c2.y;
            set_pen_size $c2.r * 2;
            PEN_DU;

            fill_quad 
                Node {
                    x: $c1.x + ($c1.r - 0.5) * ps.x1,
                    y: $c1.y + ($c1.r - 0.5) * ps.y1
                },
                Node {
                    x: $c2.x + ($c2.r - 0.5) * ps.x1,
                    y: $c2.y + ($c2.r - 0.5) * ps.y1
                },
                Node {
                    x: $c2.x + ($c2.r - 0.5) * ps.x2,
                    y: $c2.y + ($c2.r - 0.5) * ps.y2
                },
                Node {
                    x: $c1.x + ($c1.r - 0.5) * ps.x2,
                    y: $c1.y + ($c1.r - 0.5) * ps.y2
                };
        }
    }
}
