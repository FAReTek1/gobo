proc draw_regply pos p, sides {
    local angle = $p.d;
    repeat $sides + 1 {
        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
        pen_down;
        angle += 360 / $sides;
    }
    pen_up;
}

proc fill_regply pos p, sides, res {
    local i_mul = 2 * cos(180 / $sides);
    local s_mul = (2 - i_mul) / 4;

    goto $p.x, $p.y;
    set_pen_size $p.s * i_mul;
    pen_down;

    local p_mul = s_mul;
    repeat $res {
        set_pen_size $p.s * i_mul * p_mul;

        local r = $p.s * (1 - p_mul);
        local angle = $p.d;

        repeat $sides + 1 {
            goto $p.x + r * sin(angle),
                 $p.y + r * cos(angle);
            angle += 360 / $sides;
        }

        p_mul *= s_mul;
    }
    pen_up;
}