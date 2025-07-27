# Azex 3D adapted for quad by @ggenije(2) on scratch
# https://scratch.mit.edu/projects/882039002
proc fill_quad Node p0, Node p1, Node p2, Node p3 {
    # Since you can't have local vars across functions, I'm just using these very long-named global ones
    _pengine_quad_fill_B = sqrt(($p2.x - $p0.x) * ($p2.x - $p0.x) + ($p2.y - $p0.y) * ($p2.y - $p0.y));
    _pengine_quad_fill_A = sqrt(($p1.x - $p2.x) * ($p1.x - $p2.x) + ($p1.y - $p2.y) * ($p1.y - $p2.y));
    _pengine_quad_fill_C = sqrt(($p1.x - $p0.x) * ($p1.x - $p0.x) + ($p1.y - $p0.y) * ($p1.y - $p0.y));
    _pengine_quad_fill_P1 = _pengine_quad_fill_A + (_pengine_quad_fill_B + _pengine_quad_fill_C);
    goto (_pengine_quad_fill_A * $p0.x + _pengine_quad_fill_B * $p1.x + _pengine_quad_fill_C * $p2.x) / _pengine_quad_fill_P1, (_pengine_quad_fill_A * $p0.y + _pengine_quad_fill_B * $p1.y + _pengine_quad_fill_C * $p2.y) / _pengine_quad_fill_P1;
    _pengine_quad_fill_intern x_position() - $p0.x, y_position() - $p0.y, x_position() - $p1.x, y_position() - $p1.y, x_position() - $p2.x, y_position() - $p2.y, sqrt((_pengine_quad_fill_P1 - _pengine_quad_fill_A * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_B * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_C * 2) / _pengine_quad_fill_P1), $p0.x, $p0.y, $p1.x, $p1.y, $p2.x, $p2.y;
    _pengine_quad_fill_A = sqrt(($p3.x - $p2.x) * ($p3.x - $p2.x) + ($p3.y - $p2.y) * ($p3.y - $p2.y));
    _pengine_quad_fill_C = sqrt(($p0.x - $p3.x) * ($p0.x - $p3.x) + ($p0.y - $p3.y) * ($p0.y - $p3.y));
    _pengine_quad_fill_P1 = _pengine_quad_fill_A + (_pengine_quad_fill_B + _pengine_quad_fill_C);
    goto (_pengine_quad_fill_A * $p0.x + _pengine_quad_fill_B * $p3.x + _pengine_quad_fill_C * $p2.x) / _pengine_quad_fill_P1, (_pengine_quad_fill_A * $p0.y + _pengine_quad_fill_B * $p3.y + _pengine_quad_fill_C * $p2.y) / _pengine_quad_fill_P1;
    _pengine_quad_fill_intern x_position() - $p0.x, y_position() - $p0.y, x_position() - $p3.x, y_position() - $p3.y, x_position() - $p2.x, y_position() - $p2.y, sqrt((_pengine_quad_fill_P1 - _pengine_quad_fill_A * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_B * 2) * (_pengine_quad_fill_P1 - _pengine_quad_fill_C * 2) / _pengine_quad_fill_P1), $p0.x, $p0.y, $p3.x, $p3.y, $p2.x, $p2.y;
    set_pen_size 2;
    goto $p0.x, $p0.y;
    goto $p1.x, $p1.y;
    goto $p2.x, $p2.y;
    goto $p3.x, $p3.y;
    goto $p0.x, $p0.y;
    goto $p2.x, $p2.y;
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

# todo: potentially implement https://scratch.mit.edu/projects/1128076882/ ?