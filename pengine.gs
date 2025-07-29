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

###################### misc ######################
proc fill_outline th, res {
    local angle = direction(); 
    # this way, when the sprite rotates, the outline's circle of stamps rotates as well, 
    # making it look more natural
    repeat $res {
        stamp_offset Vec2{x: $th * sin(angle), y: $th * cos(angle)};
        angle += 360 / $res;
    }
}
proc stamp_offset Vec2 dn, {
    fnc_change_xy $dn.x, $dn.y;
    cstamp;
    fnc_change_xy -$dn.x, -$dn.y;
}

###################### arc ######################
# TODO: put these into costume folders...
costumes "../assets/pengine/arc/*.svg";

proc fill_arc pos pos, ext, hole {
    # you may need to mod $ext by 360
    if $ext > 0.703125 and $hole < 0.9999999 {
        fnc_goto_pos $pos;

        local i = floor(ln($ext / 360) / 0.6931471805599453);
        switch_costume "shapefill arc " & $hole > 0.01 & i;

        if $hole > 0.01 {
            set_fisheye_effect -69.314718056 / ln($hole) - 100;
        }
        cstamp;
        i = 360 * antiln(0.6931471805599453 * i);
        if abs(i - $ext) > 0.0000000000001 {
            turn_right $ext - i;
            cstamp;
        }
        set_fisheye_effect 0;
    }
}


proc draw_arc pos p, ext, hole, res=30 {
    if abs($ext) < 360 {
        local angle = $p.d;

        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
        pen_down;

        repeat $res {
            angle += $ext / $res;
            goto $p.x + $p.s * sin(angle),
                 $p.y + $p.s * cos(angle);
        }

        goto $p.x + $p.s * sin(angle) * $hole,
             $p.y + $p.s * cos(angle) * $hole;

        repeat $res {
            angle -= $ext / $res;
            goto $p.x + $p.s * sin(angle) * $hole,
                 $p.y + $p.s * cos(angle) * $hole;
        }

        goto $p.x + $p.s * sin($p.d),
             $p.y + $p.s * cos($p.d);
            
        pen_up;

    } else {
        # draw 2 circles
        local angle = $p.d;
        
        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
        pen_down;

        repeat $res {
            angle += 360 / $res;
            goto $p.x + $p.s * sin(angle),
                 $p.y + $p.s * cos(angle);
        }

        pen_up;

        goto $p.x + $p.s * sin(angle) * $hole,
             $p.y + $p.s * cos(angle) * $hole;
        pen_down;

        repeat $res {
            angle -= 360 / $res;
            goto $p.x + $p.s * sin(angle) * $hole,
                 $p.y + $p.s * cos(angle) * $hole;
        }
        pen_up;
    }
}


proc draw_arc_edge pos p, ext, res=30 {
    goto $p.x + $p.s * sin($p.d), 
         $p.y + $p.s * cos($p.d);
    pen_down;

    local angle = $p.d;

    repeat $res {
        angle += $ext / $res;
        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
    }

    pen_up;
}

proc fill_arc_starting_at pos p, ext, hole, center_rot, overall_size {
    fill_arc pos{
        x: $p.x - $p.s * sin($p.d),
        y: $p.y - $p.s * cos($p.d),
        s: $p.s * $overall_size * 2,
        d: $p.d + $center_rot - $ext
    }, $ext, $hole;
}

proc fill_arc_ending_at pos p, ext, hole, center_rot, overall_size {
    fill_arc pos{
        x: $p.x - $p.s * sin($p.d),
        y: $p.y - $p.s * cos($p.d),
        s: $p.s * $overall_size * 2,
        d: $p.d + $center_rot
    }, $ext, $hole;
}

###################### AW ######################
costumes "../assets/pengine/aw/*.svg";

proc fill_aw pos pos, hole {
    # Note: this filler is a bit stuttery and doesn't work sometimes
    if $hole < 0 {
        fill_aw $pos, 0;

    } elif $hole < 1 {
        fnc_goto_pos $pos;
        if $hole * $pos.s == 0 {
            switch_costume "shapefill AW0";
            cstamp;
        } else {
            if $hole < 0.5 {
                local i = floor(7 + ln($hole) / 0.69314718056);
                switch_costume "shapefill AW" & i;
                cstamp;
                if $hole == 0.25 { # Removes the small gap created at 0.25 hole
                    fnc_set_size $hole * $pos.s * 2.04;
                } else {
                    fnc_set_size $hole * $pos.s * antiln(0.6931471805599453 * (6 - i));
                }
                cstamp;
            } else {
                local i = ceil(5 + ln(2 - 2 * $hole) / -0.53479999674);
                switch_costume "shapefill AW" & i;
                cstamp;
                if $hole != 0.5{
                    fnc_set_size $pos.s + (
                        antiln(0.6931471805599453 * (4 - i)) * 
                        (2 * antiln(-0.5347999967394081 * (4.89 - i)) * ($pos.s * ($hole - 1)) + $pos.s)
                    ) / 0.707106781187;
                    cstamp;
                }
            }
        }
    }
}

proc draw_aw pos pos, hole {
    if $hole < 0 {
        _inner_pengine_draw_aw $pos, 0, cos($pos.d), sin($pos.d), 
                       0.16 * $pos.s, 0.9 * $pos.s, 0;

    } elif $hole < 1 {
        _inner_pengine_draw_aw $pos, $pos.s * $hole, cos($pos.d), sin($pos.d), 
                       0.16 * $pos.s, 0.9 * $pos.s, 0.9 * $pos.s * $hole;
    }
}

proc _inner_pengine_draw_aw pos pos, s2, cosd, sind, rx, ry1, ry2 {
    goto $pos.x + $ry1 * $sind + $rx * $cosd,
         $pos.y + $ry1 * $cosd - $rx * $sind;

    pen_down;
    goto $pos.x + $pos.s * $sind, 
         $pos.y + $pos.s * $cosd;

    goto $pos.x + $ry1 * $sind - $rx * $cosd,
         $pos.y + $ry1 * $cosd + $rx * $sind;

    if $s2 == 0 {
        goto $pos.x, $pos.y;

    } else {
        goto $pos.x + $ry2 * $sind - 0.16 * $s2 * $cosd,
             $pos.y + $ry2 * $cosd + 0.16 * $s2 * $sind;

        goto $pos.x + $s2 * $sind,
             $pos.y + $s2 * $cosd;

        goto $pos.x + $ry2 * $sind + 0.16 * $s2 * $cosd,
             $pos.y + $ry2 * $cosd - 0.16 * $s2 * $sind;
    }
    goto $pos.x + $pos.s * (0.9 * $sind + 0.16 * $cosd),
         $pos.y + $pos.s * (0.9 * $cosd - 0.16 * $sind);
    pen_up;
}

###################### Circle ######################
proc fill_circle Circle c {
    # literally paint a dot
    goto $c.x, $c.y;
    set_pen_size 2 * $c.r;
    pen_du;
}

proc draw_circle Circle c, res=30 {
    local angle = 0;
    goto $c.x, $c.y + $c.r;
    pen_down;

    repeat $res {
        angle += 360 / $res;
        goto $c.x + $c.r * sin(angle), $c.y + $c.r * cos(angle);
    }

    pen_up;
}

# TODO: clip circle
###################### Line ######################
# capped line too
costumes "../assets/pengine/capped_line/*.svg";

proc fill_capped_line Line2 l, th, trans=0 {
    local dst = DIST($l.x1, $l.y1, $l.x2, $l.y2);
    if dst < $th {
        local mul = ($th / 2) / dst; 

        # tail recursion is ok
        local mdx = ($l.x1 + $l.x2) / 2;
        local mdy = ($l.y1 + $l.y2) / 2;

        local dx = $l.x1 - $l.x2;
        local dy = $l.y1 - $l.y2;

        fill_capped_line Line2{
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
        fnc_goto_set_size $l.x2 + (dst - $th / 2) * sin(direction()),
                          $l.y2 + (dst - $th / 2) * cos(direction()),
                          $th;

        set_ghost_effect $trans;
        cstamp;
        set_pen_transparency 100;
        set_pen_size $th;
        pen_down;
        set_pen_transparency $trans;
        
        turn_right 180;
        fnc_goto_set_size $l.x1 + (dst - $th / 2) * sin(direction()),
                          $l.y1 + (dst - $th / 2) * cos(direction()),
                          $th;
        pen_up;
        cstamp;
    }
}

proc draw_capped_line Line2 l, th {
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

###################### Segment ######################
costumes "../assets/pengine/segment/*.svg";

proc fill_segment pos pos, ext {
    if $ext > 0.703125 {
        if $ext < 360{
            local i = floor(ln($ext / 360) / 0.6931471805599453);
            switch_costume "shapefill segment " & i;

            fnc_goto $pos.x, $pos.y;
            fnc_set_size $pos.s;
            point_in_direction $pos.d;

            cstamp;

            i = 360 * antiln(i * 0.6931471805599453);
            if abs(i - $ext) > 0.0000000000001 {
                turn_right $ext - i;
                cstamp;
                local fin = $pos.d + $ext;
                local md = $pos.d + $ext / 2;

                FNC_POS_HACK;
                fill_tri sin($pos.d) * $pos.s / 2 + $pos.x,
                         cos($pos.d) * $pos.s / 2 + $pos.y,
                         sin(fin) * $pos.s / 2 + $pos.x,
                         cos(fin) * $pos.s / 2 + $pos.y,
                         sin(md) * $pos.s / 2 + $pos.x,
                         cos(md) * $pos.s / 2 + $pos.y;
                }
        } else {
            goto $pos.x, $pos.y;
            set_pen_size $pos.s;
            pen_du;
        }
    } elif $ext < -0.703125 {
        fill_segment pos{x: $pos.x, y: $pos.y, s: $pos.s, d: $pos.d + $ext}, -$ext;
    } 
}

proc draw_segment pos p, ext, res=30 {
    goto $p.x + $p.s * sin($p.d) / 2, 
         $p.y + $p.s * cos($p.d) / 2;
    pen_down;

    local angle = $p.d;
    repeat $res {
        angle += $ext / $res;
        goto $p.x + $p.s * sin(angle) / 2,
             $p.y + $p.s * cos(angle) / 2;
    }

    goto $p.x + $p.s * sin($p.d) / 2, 
         $p.y + $p.s * cos($p.d) / 2;

    pen_up;
}

###################### cone ######################
costumes "../assets/pengine/cone/*.svg";
# 'Cone'/pen-cap filler by @faretek1 and @wolther on scratch --

proc fill_cone pos p, ext {
    if 0 < $ext and $ext < 180 {
        local r1 = $p.s / (cos($ext / 2) * 2);
        local r2 = $p.s / (cos($ext / 4) * 2);
        fill_tri $p.x + r1 * sin($p.d + $ext / 2),
                 $p.y + r1 * cos($p.d + $ext / 2),
                 $p.x + r2 * sin($p.d + $ext / 4),
                 $p.y + r2 * cos($p.d + $ext / 4),
                 $p.x + r2 * sin($p.d + $ext * 0.75),
                 $p.y + r2 * cos($p.d + $ext * 0.75);

        fnc_goto_pos $p;

        local i = ceil(log(360 / $ext) / 0.301);
        if i < 6{
            switch_costume "shapefill cone" & i;
            cstamp;

            turn_right $ext - 360 / antilog(0.301 * i);
            cstamp;
        }
    }
}

###################### regply ######################
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
# based on the one by sockeye-d
proc fill_regply pos p, sides, res=4 {
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
###################### crescent ######################
# crescent fill/draw by @faretek1 on scratch 

# There is potentially a more optimal algo for this
# A crescent is defined by a main circle and a second circle cut out of it.
proc draw_crescent Circle c1, Circle c2, res=30 {
    local Line2 isct = circ_intersect($c1, $c2);
    if isct.x1 == CircIntersectCases.notouch {
        draw_circle $c1, $res;
    } elif isct.x1 == CircIntersectCases.circinside {
        if $c1.r > $c2.r {
            draw_circle $c1, $res;
            draw_circle $c2, $res;
        }

    } else {
        local d1 = DIR($c2.x, $c2.y, isct.x2, isct.y2);
        local d2 = DIR($c2.x, $c2.y, isct.x1, isct.y1);

        if d1 < d2 {
            draw_arc_edge POS_CIRCA($c2, 180 + d1), -360 + (d2 - d1), $res;
        } else {
            draw_arc_edge POS_CIRCA($c2, 180 + d1), d2 - d1, $res;
        }

        d1 = DIR($c1.x, $c1.y, isct.x2, isct.y2);
        d2 = DIR($c1.x, $c1.y, isct.x1, isct.y1);

        if d1 < d2 {
            draw_arc_edge POS_CIRCA($c1, 180 + d1), -360 + (d2 - d1), $res;
        } else {
            draw_arc_edge POS_CIRCA($c1, 180 + d1), d2 - d1, $res;
        }
    }
}

# There may be a more efficient way to do a crescent using stamps, however it eludes me right now
proc _shapefill_inner_crescent Circle c1, Circle c2, Circle a, dst, dx, dy, flip, res {
    if $dst > $c1.r + $c2.r {
        goto $c1.x, $c1.y;
        set_pen_size 2 * $c1.r;
        pen_du;
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

proc fill_crescent Circle c1, Circle c2, res=30 {
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
###################### dwline ######################
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
        # TODO: change this to a macro when it works
        local Line2 ps = circ_outer_tangent_points_to_v2(
                Circle(0, 0, ir),
                Vec2($c2.x - $c1.x, $c2.y - $c1.y)
            );
        
        if ps.x1 == CircIntersectCases.circinside {
            goto $c1.x, $c1.y;
            set_pen_size $c1.r * 2;
            pen_down;
            pen_up;

        } elif ps.x1 != CircIntersectCases.notouch {
            ps.x1 /= ir;
            ps.y1 /= ir;
            ps.x2 /= ir;
            ps.y2 /= ir;

            goto $c1.x, $c1.y;
            set_pen_size $c1.r * 2;
            pen_du;

            goto $c2.x, $c2.y;
            set_pen_size $c2.r * 2;
            pen_du;

            FILL_QUAD_V2( 
                Vec2(
                    $c1.x + ($c1.r - 0.5) * ps.x1,
                    $c1.y + ($c1.r - 0.5) * ps.y1
                ),
                Vec2(
                    $c2.x + ($c2.r - 0.5) * ps.x1,
                    $c2.y + ($c2.r - 0.5) * ps.y1
                ),
                Vec2(
                    $c2.x + ($c2.r - 0.5) * ps.x2,
                    $c2.y + ($c2.r - 0.5) * ps.y2
                ),
                Vec2(
                    $c1.x + ($c1.r - 0.5) * ps.x2,
                    $c1.y + ($c1.r - 0.5) * ps.y2
                )
            );
        }
    }
}

###################### ellipse ######################
proc fill_ellipse pos p, Vec2 s, res=4 {
    pen_up;
    if abs($s.x) == abs($s.y) {
        goto $p.x, $p.y;
        set_pen_size abs(2 * $p.s * $s.x);
        pen_du;
    } else {
        local w = abs($s.x * $p.s);
        local h = abs($s.y * $p.s);

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
