# Azex fixed res copied over by Triducal
proc fill_tri x1, y1, x2, y2, x3, y3 {
    local la = sqrt(($x2 - $x3) * ($x2 - $x3) + ($y2 - $y3) * ($y2 - $y3));
    local lb = sqrt(($x3 - $x1) * ($x3 - $x1) + ($y3 - $y1) * ($y3 - $y1));
    local lc = sqrt(($x2 - $x1) * ($x2 - $x1) + ($y2 - $y1) * ($y2 - $y1));
    local p = la + lb + lc;

    goto ((la * $x1) + (lb * $x2) + (lc * $x3)) / p,
        ((la * $y1) + (lb * $y2) + (lc * $y3)) / p;

    local a = (x_position() - $x1);
    local b = (y_position() - $y1);
    local c = (x_position() - $x2);
    local d = (y_position() - $y2);
    local e = (x_position() - $x3);
    local f = (y_position() - $y3);
    local r = sqrt((p - la * 2) * (p - lb * 2) * (p - lc * 2) / p);

    if la < lb and la < lc {
        la = 0.5 - (r / (4 * sqrt(a * a + b * b)));
    } else {
        if lb < lc {
            la = 0.5 - (r / (4 * sqrt(c * c + d * d)));
        } else {
            la = 0.5 - (r / (4 * sqrt(e * e + f * f)));
        }
    }

    set_pen_size r;
    pen_down;
    lb = la;

    repeat ceil(-1.6 - (ln(r) / ln(lb))) {
        set_pen_size la * r + 2;
        goto $x1 + (la * a), $y1 + (la * b);
        goto $x2 + (la * c), $y2 + (la * d);
        goto $x3 + (la * e), $y3 + (la * f);
        goto $x1 + (la * a), $y1 + (la * b);
        la = la * lb;
    }

    set_pen_size 2;
    goto $x1, $y1;
    goto $x2, $y2;
    goto $x3, $y3;
    goto $x1, $y1;
    pen_up;
}

# Azex fixed res copied over by Triducal using Nodes instead
proc fill_tri_node Node p1, Node p2, Node p3 {
    local la = sqrt(($p2.x - $p3.x) * ($p2.x - $p3.x) + ($p2.y - $p3.y) * ($p2.y - $p3.y));
    local lb = sqrt(($p3.x - $p1.x) * ($p3.x - $p1.x) + ($p3.y - $p1.y) * ($p3.y - $p1.y));
    local lc = sqrt(($p2.x - $p1.x) * ($p2.x - $p1.x) + ($p2.y - $p1.y) * ($p2.y - $p1.y));
    local p = la + lb + lc;

    goto ((la * $p1.x) + (lb * $p2.x) + (lc * $p3.x)) / p,
        ((la * $p1.y) + (lb * $p2.y) + (lc * $p3.y)) / p;

    local a = (x_position() - $p1.x);
    local b = (y_position() - $p1.y);
    local c = (x_position() - $p2.x);
    local d = (y_position() - $p2.y);
    local e = (x_position() - $p3.x);
    local f = (y_position() - $p3.y);
    local r = sqrt((p - la * 2) * (p - lb * 2) * (p - lc * 2) / p);

    if la < lb and la < lc {
        la = 0.5 - (r / (4 * sqrt(a * a + b * b)));
    } else {
        if lb < lc {
            la = 0.5 - (r / (4 * sqrt(c * c + d * d)));
        } else {
            la = 0.5 - (r / (4 * sqrt(e * e + f * f)));
        }
    }

    set_pen_size r;
    pen_down;
    lb = la;

    repeat ceil(-1.6 - (ln(r) / ln(lb))) {
        set_pen_size la * r + 2;
        goto $p1.x + (la * a), $p1.y + (la * b);
        goto $p2.x + (la * c), $p2.y + (la * d);
        goto $p3.x + (la * e), $p3.y + (la * f);
        goto $p1.x + (la * a), $p1.y + (la * b);
        la = la * lb;
    }

    set_pen_size 2;
    goto $p1.x, $p1.y;
    goto $p2.x, $p2.y;
    goto $p3.x, $p3.y;
    goto $p1.x, $p1.y;
    pen_up;
}
