###################### Tri ######################
# Azex fixed res copied over by Triducal
# TODO: consider using a different trifill
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

%define FILL_TRI_V2(p1, p2, p3) fill_tri p1.x, p1.y, p2.x, p2.y, p3.x, p3.y

###################### Quad ######################

# Azex 3D adapted for quad by @ggenije(2) on scratch
# https://scratch.mit.edu/projects/882039002
proc fill_quad p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y {
    # Since you can't have local vars across functions, I'm just using these very long-named global ones
    _pengine_quad_fill_B = sqrt(($p2x - $p0x) * ($p2x - $p0x) + ($p2y - $p0y) * ($p2y - $p0y));
    _pengine_quad_fill_A = sqrt(($p1x - $p2x) * ($p1x - $p2x) + ($p1y - $p2y) * ($p1y - $p2y));
    _pengine_quad_fill_C = sqrt(($p1x - $p0x) * ($p1x - $p0x) + ($p1y - $p0y) * ($p1y - $p0y));
    _pengine_quad_fill_P1 = _pengine_quad_fill_A + (_pengine_quad_fill_B + _pengine_quad_fill_C);
    goto (_pengine_quad_fill_A * $p0x + _pengine_quad_fill_B * $p1x + _pengine_quad_fill_C * $p2x) / _pengine_quad_fill_P1, (_pengine_quad_fill_A * $p0y + _pengine_quad_fill_B * $p1y + _pengine_quad_fill_C * $p2y) / _pengine_quad_fill_P1;
    _pengine_quad_fill_intern x_position() - $p0x, y_position() - $p0y, x_position() - $p1x, y_position() - $p1y, x_position() - $p2x, y_position() - $p2y, sqrt((_pengine_quad_fill_P1 - _pengine_quad_fill_A * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_B * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_C * 2) / _pengine_quad_fill_P1), $p0x, $p0y, $p1x, $p1y, $p2x, $p2y;
    _pengine_quad_fill_A = sqrt(($p3x - $p2x) * ($p3x - $p2x) + ($p3y - $p2y) * ($p3y - $p2y));
    _pengine_quad_fill_C = sqrt(($p0x - $p3x) * ($p0x - $p3x) + ($p0y - $p3y) * ($p0y - $p3y));
    _pengine_quad_fill_P1 = _pengine_quad_fill_A + (_pengine_quad_fill_B + _pengine_quad_fill_C);
    goto (_pengine_quad_fill_A * $p0x + _pengine_quad_fill_B * $p3x + _pengine_quad_fill_C * $p2x) / _pengine_quad_fill_P1, (_pengine_quad_fill_A * $p0y + _pengine_quad_fill_B * $p3y + _pengine_quad_fill_C * $p2y) / _pengine_quad_fill_P1;
    _pengine_quad_fill_intern x_position() - $p0x, y_position() - $p0y, x_position() - $p3x, y_position() - $p3y, x_position() - $p2x, y_position() - $p2y, sqrt((_pengine_quad_fill_P1 - _pengine_quad_fill_A * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_B * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_C * 2) / _pengine_quad_fill_P1), $p0x, $p0y, $p3x, $p3y, $p2x, $p2y;
    set_pen_size 2;
    goto $p0x, $p0y;
    goto $p1x, $p1y;
    goto $p2x, $p2y;
    goto $p3x, $p3y;
    goto $p0x, $p0y;
    goto $p2x, $p2y;
    pen_up;
}

proc _pengine_quad_fill_intern ina1, inb1, inc, ind, ine1, inf1, inr1, a, b, c, d, e, f {
    if _pengine_quad_fill_A < _pengine_quad_fill_B and _pengine_quad_fill_A < _pengine_quad_fill_C {
        _pengine_quad_fill_A = 0.5 - $inr1 / (4 * sqrt($ina1 * $ina1 + $inb1 * $inb1));
    }
    elif _pengine_quad_fill_B < _pengine_quad_fill_C {
        _pengine_quad_fill_A = 0.5 - $inr1 / (4 * sqrt($inc * $inc + $ind * $ind));
    }
    else {
        _pengine_quad_fill_A = 0.5 - $inr1 / (4 * sqrt($ine1 * $ine1 + $inf1 * $inf1));
    }
    set_pen_size $inr1;
    pen_down;
    _pengine_quad_fill_C = _pengine_quad_fill_A;
    repeat -(ln($inr1) / ln(_pengine_quad_fill_A)) {
        set_pen_size _pengine_quad_fill_A * $inr1;
        goto $a + _pengine_quad_fill_A * $ina1, $b + _pengine_quad_fill_A * $inb1;
        goto $c + _pengine_quad_fill_A * $inc, $d + _pengine_quad_fill_A * $ind;
        goto $e + _pengine_quad_fill_A * $ine1, $f + _pengine_quad_fill_A * $inf1;
        goto $a + _pengine_quad_fill_A * $ina1, $b + _pengine_quad_fill_A * $inb1;
        _pengine_quad_fill_A *= _pengine_quad_fill_C;
    }
}

%define FILL_QUAD_V2(p0,p1,p2,p3) fill_quad p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y

# TODO: potentially implement https://scratch.mit.edu/projects/1128076882/ ?
# using linear algebra from Vec2.gs??
