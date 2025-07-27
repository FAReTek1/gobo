# Based on https://scratch.mit.edu/projects/578538613 by @griefercube on scratch
proc fill_ellipse pos p, WxH s, res {
    pen_up;
    if abs($s.w) == abs($s.h) {
        goto $p.x, $p.y;
        set_pen_size abs(2 * $p.s * $s.w);
        PEN_DU;
    } else {
        local w = abs($s.w * $p.s);
        local h = abs($s.h * $p.s);

        if h > w {
            local l = w;
        } else {
            local l = h;
        }

        local s = 2;
        repeat $res {
            s *= 2;
            if s > 360 {
                s = 360;
            }
            set_pen_size l;
            l /= 2;

            local d = 0;
            local rw = sqrt(1 - (l / w) * (l / w));
            local rh = sqrt(1 - (l / h) * (l / h));

            goto $p.x + cos($p.d) * (h * rw - l),
                 $p.y - sin($p.d) * (h * rw - l);
            pen_down;

            repeat s {
                d += 360 / s;
                goto $p.x + cos($p.d) * cos(d) * (h * rw - l)
                     + sin($p.d) * sin(d) * (w * rh - l),

                     $p.y + cos($p.d) * sin(d) * (w * rh - l)
                    - sin($p.d) * cos(d) * (h * rw - l);
            }
            pen_up;
            if 1 > l or s == 360 {
                stop_this_script;
            }
        }
    }
}
