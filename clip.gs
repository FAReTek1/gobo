# --- --- --- --- --- --- --- --- --- --- #

# Circle-ngon clipper based on wolther-scripts's clipper
# Ngon passed in as list
list Vec2 cnc_ngon;
# Internal lists used by circle-ngon clip for output
list Vec2 _cnc_buffer1;
list Vec2 _cnc_buffer2;

proc _cnc_inr_circle_line Circle c, Line2 l {
    if $l.x1 == $l.x2 {
        local m = sqrt($c.r * $c.r - ($l.x1 - $c.x) * ($l.x1 - $c.x)) * (2 * ($l.y1 > $l.y2) - 1);
        if m != 0 {
            local y = $c.y + m;
            if (y - $l.y1) * (y - $l.y2) <= 0 {
                add Vec2{x: $l.x1, y: y} to _cnc_buffer1;
                add Vec2{x: $l.x1, y: y} to _cnc_buffer2;
            }
            y = $c.y - m;
            if (y - $l.y1) * (y - $l.y2) <= 0 {
                add Vec2{x: $l.x1, y: y} to _cnc_buffer1;
                add Vec2{x: $l.x1, y: y} to _cnc_buffer2;
            }

        }
    } else {
        # si = slope-intercept
        local m = ($l.y2 - $l.y1) / ($l.x2 - $l.x1);
        local i = ($l.y1 - $c.y) - m * ($l.x1 - $c.x);

        local a = m * m + 1;
        local b = 2 * i * m;
        local c = i * i - $c.r * $c.r;

        local t = b * b - 4 * a * c;
        if t >= 0 {
            local c = SGNBOOL($l.x1 < $l.x2);
            t = sqrt(t) * c;

            local x = (b + t) / (-2 * a);
            if (((x + $c.x) - $l.x2) * c <= 0) and ((x + $c.x) - $l.x1) * c >= 0 {
                add Vec2{
                    x: x + $c.x,
                    y: m * x + i + $c.y
                } to _cnc_buffer1;

                add Vec2{
                    x: x + $c.x,
                    y: m * x + i + $c.y
                } to _cnc_buffer2;
            }

            x = (t - b) / (2 * a);
            if (((x + $c.x) - $l.x2) * c <= 0) and ((x + $c.x) - $l.x1) * c >= 0 {
                add Vec2{
                    x: x + $c.x,
                    y: m * x + i + $c.y
                } to _cnc_buffer1;
                
                add Vec2{
                    x: x + $c.x,
                    y: m * x + i + $c.y
                } to _cnc_buffer2;
            }
        }
    }
}

func _cnc_inr(dx, dy, r) {
    return $dx * $dx + $dy * $dy < $r * $r;
}
# goes clockwise
proc circle_ngon_clip Circle c {
    Circle cnc_circle = Circle($c.x, $c.y, $c.r * 2);

    local i = 1;
    repeat length cnc_ngon {
        local d1 = (cnc_ngon[i].x - $c.x) * (cnc_ngon[i].x - $c.x) + (cnc_ngon[i].y - $c.y) * (cnc_ngon[i].y - $c.y);
        if d1 == $c.r * $c.r {
            circle_ngon_clip Circle{
                x: $c.x, y: $c.y + 0.5, r: $c.r 
            };
            stop_this_script;
        }
        i++;
    }

    delete _cnc_buffer1;
    delete _cnc_buffer2;

    local normal_x = cnc_ngon[2].y - cnc_ngon[1].y;
    local normal_y = cnc_ngon[1].x - cnc_ngon[2].x;
    local normal_v = normal_x * cnc_ngon[1].x + normal_y * cnc_ngon[1].y;
    local flip = SGNBOOL(normal_x * cnc_ngon[3].x + normal_y * cnc_ngon[3].y > normal_v);
    _cnc_flip = flip;

    i = 1;
    local j = length cnc_ngon;

    local current = _cnc_inr(cnc_ngon[j].x - $c.x, $c.y - cnc_ngon[j].y, $c.r);
    local prev = current;
    local first = prev;
    _cnc_first = first;

    repeat length cnc_ngon {
        current = _cnc_inr(cnc_ngon[i].x - $c.x, $c.y - cnc_ngon[i].y, $c.r);
        if prev {
            add cnc_ngon[j] to _cnc_buffer1;
        }
        if (current == 0) or (prev == 0) {
            _cnc_inr_circle_line $c, LINE2_V2(cnc_ngon[j], cnc_ngon[i]);
        }
        
        prev = current;
        j = i;
        i++;
    }

    if length _cnc_buffer1 == 0 {
        # Circle check
        i = 1;
        j = length cnc_ngon;

        repeat length cnc_ngon {
            local nx = (cnc_ngon[i].y - cnc_ngon[j].y) * flip;
            local ny = (cnc_ngon[j].x - cnc_ngon[i].x) * flip;
            local nv = nx * cnc_ngon[i].x + ny * cnc_ngon[i].y;
            if nx * $c.x + ny * $c.y < nv {
                add Vec2{x: "OUT POLY", y: "OUT POLY"} to _cnc_buffer1;
                stop_this_script;
            }

            j = i;
            i++;
        }
    }
}

proc _cnc_segment_by_coords Vec2 p1, Vec2 p2 {
    local d1 = V2_DIR_TO($p1, V2_CIRC(cnc_circle)) % 360;
    local d2 = V2_DIR_TO($p2, V2_CIRC(cnc_circle)) % 360;

    if d1 != d2 {
        if _cnc_flip == 1 {
            if d1 < d2 {
                fill_segment POS_CIRCD(cnc_circle, d1), d2 - d1;
            } else {
                fill_segment POS_CIRCD(cnc_circle, d1 - 360), d2 - (d1 - 360);
            }
        } else {
            if d1 < d1 {
                fill_segment POS_CIRCD(cnc_circle, d2), d1 - d2;
            } else {
                fill_segment POS_CIRCD(cnc_circle, d2 - 360), d1 - (d2 - 360);
            }
        }
    }
}

proc render_cnc {
    if _cnc_buffer1[1].x != "OUT POLY" {
        if length _cnc_buffer1 == 0 {
            fill_circle Circle(cnc_circle.x, cnc_circle.y, cnc_circle.r / 2);
            
        } else {
            local i = 2;
            repeat length _cnc_buffer1 - 2 {
                fill_tri 
                _cnc_buffer1[1].x, _cnc_buffer1[1].y,
                _cnc_buffer1[i].x, _cnc_buffer1[i].y,
                _cnc_buffer1[i + 1].x, _cnc_buffer1[i + 1].y;
                i++;
            }
            i = 1 + (_cnc_first == 0);
            repeat (length _cnc_buffer2 / 2) - (1 - _cnc_first) {
                _cnc_segment_by_coords _cnc_buffer2[i], _cnc_buffer2[i + 1];
                i += 2;
            }
            if _cnc_first == 0 {
                _cnc_segment_by_coords _cnc_buffer2[i], _cnc_buffer2[1];
            }
        }

    }
}


# --- --- --- --- --- --- --- --- --- --- #
# Cohen-Sutherland line clipper
# Adapted from https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm

func _compute_out_code(x, y, Box b) {
    return 
    "" + ($y > $b.ymax) & 
    "" + ($y < $b.ymin) &
    "" + ($x > $b.xmax) &
    "" + ($x < $b.xmin);
}


func cohen_sutherland (Line2 l, Box b) Line2 {
    # Adapted from https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm

    local outcode1 = _compute_out_code($l.x1, $l.y1, $b);
    local outcode2 = _compute_out_code($l.x2, $l.y2, $b);

    local Line2 l = $l; # So that it's mutable

    forever {
        if (outcode1 == "0000") and (outcode2 == "0000") {
            return l;

        } elif "2" in (outcode1 + outcode2) {
            # Line is defintely outside of clip window
            return LINE2_FILL("NaN");

        } else {
            # Can't use the MAX function because it removes the starting 0s
            if outcode1 > outcode2 {
                local outcode_out = outcode1;
            } else {
                local outcode_out = outcode2;
            }

            # Clip the line
            # The following code actually contains a lot of lerps
            if outcode_out[1]{
                # Point is above clip window
                local x =  l.x1 + (l.x2 - l.x1) * ($b.ymax - l.y1) / (l.y2 - l.y1);
                local y = $b.ymax;
            } elif outcode_out[2]{
                # Point is below clip window
                local x =  l.x1 + (l.x2 - l.x1) * ($b.ymin - l.y1) / (l.y2 - l.y1);
                local y = $b.ymin;
            } elif outcode_out[3] {
                # Point is to the right of clip window
                local y = l.y1 + (l.y2 - l.y1) * ($b.xmax - l.x1) / (l.x2 - l.x1);
                local x = $b.xmax;
            } else {
                # Point is to the left of clip window

                # We can use an else instead of another elif,
                # since we know the outcode isn't 0000, otherwise
                # it would have been caught at the top
                
                local y = l.y1 + (l.y2 - l.y1) * ($b.xmin - l.x1) / (l.x2 - l.x1);
                local x = $b.xmin;
            }

            if outcode_out == outcode1 {
                l.x1 = x;
                l.y1 = y;
                outcode1 = _compute_out_code(x, y, $b);
            } else {
                l.x2 = x;
                l.y2 = y;
                outcode2 = _compute_out_code(x, y, $b);
            }
        }
    }
}

# --- --- --- --- --- --- --- --- --- --- #
# Circle-line clipper -
func clip_circle_line (Circle c, Line2 l) Line2 {
    # (Probably optimisable) circle-line clipper algorithm by faretek1
    local d1 = DIST($l.x1, $l.y1, $c.x, $c.y);
    local d2 = DIST($l.x2, $l.y2, $c.x, $c.y);

    local Line2 ret = $l; # Just copy over contents. We'll probably override this but oh well

    if d1 <= $c.r  and d2 <= $c.r {
        return ret;
    }

    if $l.x1 == $l.x2 {
        local dx = $l.x1 - $c.x;
        local discrim = sqrt(4 * ($c.r * $c.r - dx * dx));

        if d1 > $c.r {
            if $l.y1 > $l.y2 {
                ret.y1 = (2 * $c.y + discrim) / 2;
            } else {
                ret.y1 = (2 * $c.y - discrim) / 2;
            }

        } 
        if d2 > $c.r {
           if $l.y1 > $l.y2 {
                ret.y2 = (2 * $c.y - discrim) / 2;
            } else {
                ret.y2 = (2 * $c.y + discrim) / 2;
            }
        }

        local t1 = INVLERP(ret.y1, $l.y1, $l.y2);
        local t2 = INVLERP(ret.y2, $l.y1, $l.y2);

        if DISTSQUARED($c.x, $c.y, ret.x1, ret.y1) > $c.r * $c.r {
            ret.x1 = "NaN";
        }

    } else {
        local m = LINE2_GRAD($l);
        local ic = LINE2_INTC($l, m);

        # The following are a, b & c for use with quadratic formula
        local a = 1 + m * m;
        local b = 2 * (m * (ic - $c.y) - $c.x);
        local c = $c.x * $c.x + (ic * ic - ($c.y * (2 * ic - $c.y))) - $c.r * $c.r; 
        # The brackets were required to prevent goboscript from bracketifying it wrongly

        local discrim = b * b - 4 * a * c;

        if discrim < 0 {
            return LINE2_FILL("NaN");
        }

        discrim = sqrt(discrim);
        if d1 > $c.r and d2 > $c.r {
        ret.x1 = (b + discrim) / (-2 * a);
        ret.y1 = m * ret.x1 + ic;
        
        ret.x2 = (discrim - b) / (2 * a);
        ret.y2 = m * ret.x2 + ic;
        } else {

        # 1 in, 1 out
        local x1 = (b + discrim) / (-2 * a);
        local x2 = (discrim - b ) / (2 * a);

        local t1 = INVLERP(x1, $l.x1, $l.x2);
        local t2 = INVLERP(x2, $l.x1, $l.x2);

        if d1 > $c.r {
            if t1 < t2 {
                ret.x1 = x1;
                ret.y1 = m * ret.x1 + ic;
            } else {
                ret.x1 = x2;
                ret.y1 = m * ret.x1 + ic;
            }
        } else {
            # This is when d2 > $c.r. we can assume this because not both can be more than $c.r,
            # otherwise we get the above case, and not both can be within, otherwise we get the top case
            if t1 < t2 {
                ret.x2 = x2;
                ret.y2 = m * ret.x2 + ic;
            } else {
                ret.x2 = x1;
                ret.y2 = m * ret.x2 + ic;
            }
        }
        }

        local t1 = INVLERP(ret.x1, $l.x1, $l.x2);
        local t2 = INVLERP(ret.x2, $l.x1, $l.x2);
    }
    
    if t1 < 0 or t2 < 0 or t1 > 1 or t2 > 1 {
        # The return must be in bounds of the line
        ret.x1 = "NaN";
    }

    return ret;
}

# --- --- --- --- --- --- --- --- --- --- #
# Cyrus-Beck algorithm
# Based on https://www.geeksforgeeks.org/line-clipping-set-2-cyrus-beck-algorithm/

list Vec2 cyrus_beck_shape;
# List containing vertices of the clipping window (must be convex and anti-clockwise)
# This is meant to be anti-clockwise, not clockwise

proc gen_cybck_regply side, r, dir{
    delete cyrus_beck_shape;
    local angle = $dir;

    repeat $side {
        add_cybck_point Vec2{
            x: $r * sin(angle),
            y: $r * cos(angle)
        };

        angle -= 360 / $side;
    }
}

proc draw_cybck_shape {
    local i = 1;
    repeat length cyrus_beck_shape {
        V2_GOTO(cyrus_beck_shape[i]);
        pen_down;
        i++;
    }

    V2_GOTO(cyrus_beck_shape[1]);
    pen_up;
}

func clip_cybeck (Line2 l) Line2 {
    local n = length cyrus_beck_shape;
    local i = 1;

    local dx = $l.x2 - $l.x1;
    local dy = $l.y2 - $l.y1;
    
    local tmin = 0;
    local tmax = "Infinity";
    
    repeat n {
        local Vec2 p = cyrus_beck_shape[i];

        # Calculate normals
        local nx = cyrus_beck_shape[i].y - cyrus_beck_shape[i % n + 1].y;
        local ny = cyrus_beck_shape[i % n + 1].x - cyrus_beck_shape[i].x;

        # P0 - PEi is only needed once so we calculate it here in Vector 2
        # This is used to calculate the numerator and denominator with a dot product
        local P0_PEi = nx * dx + ny * dy;

        # You don't need to store these values so just compare them to temps immediately
        # Bugfix for vertical and horizontal lines by Chris Crowe https://discuss.geeksforgeeks.org/comment/4808826060
        local num = nx * (p.x - $l.x1) + ny * (p.y - $l.y1);
        local den = (P0_PEi == 0) + P0_PEi * (P0_PEi != 0);

        local t = num / den;

        if P0_PEi < 0 {
            if t < tmax {
                tmax = t;
            }

        } else {
            if t > tmin {
                tmin = t;
            }
        }

        i ++;
    }

    # Line not touching shape
    # Second part of the or for making sure that it does not continue the line on 1 side
    if tmin > tmax or (tmin > 1 and tmax > 1) {
        return LINE2_FILL("NaN");
    }

    # Clip line if the point is further than the edge, otherwise set to clipped point
    local Line2 ret = Line2{
        x1: $l.x2, # All default to p2
        y1: $l.y2, # All default to p2
        x2: $l.x2, # All default to p2
        y2: $l.y2  # All default to p2
    };
    
    if tmin < 1 {
        ret.x1 = $l.x1 + dx * tmin;
        ret.y1 = $l.y1 + dy * tmin;
    }
    if tmax < 1 {
        ret.x2 = $l.x1 + dx * tmax;
        ret.y2 = $l.y1 + dy * tmax;
    }

    return ret;
}

# --- --- --- --- --- --- --- --- --- --- #
# Sutherland-Hodgman algorithm
# Based on https://www.geeksforgeeks.org/polygon-clipping-sutherland-hodgman-algorithm/

list Vec2 slhd_clip_poly;
list Vec2 slhd_poly_points;
# These are meant to be clockwise, not anti-clockwise
list Vec2 slhd_new_poly;

proc gen_slhd_clip_regply side, r, dir=0 {
    delete slhd_clip_poly;
    local angle = $dir;

    repeat $side {
        add Vec2{
            x: $r * sin(angle),
            y: $r * cos(angle)
        } to slhd_clip_poly;

        angle += 360 / $side;
    }
}

proc _slhd_clip Line2 l{
    delete slhd_new_poly;

    local new_poly_size = 0;
    local poly_size = length slhd_poly_points;

    # (ix,iy),(kx,ky) are the co-ordinate values of the points
    local i = 1;
    repeat poly_size {
        # i and k form a line in polygon
        local k = i % poly_size + 1;

        local Vec2 ip = slhd_poly_points[i]; # really is pt #i
        local Vec2 kp = slhd_poly_points[k];

        # Calculating position of first point with regards to the clipper line
        local i_pos = ($l.x2 - $l.x1) * (ip.y - $l.y1) - ($l.y2 - $l.y1) * (ip.x - $l.x1);
        # Calculating position of second point w.r.t. clipper line
        local k_pos = ($l.x2 - $l.x1) * (kp.y - $l.y1) - ($l.y2 - $l.y1) * (kp.x - $l.x1);

        # Case 1 : When both points are inside
        if i_pos < 0 and k_pos < 0 {
            # Only second point is added
            add kp to slhd_new_poly;
            new_poly_size ++;
        } 

        # Case 2: When only first point is outside
        elif i_pos >= 0 and k_pos < 0 {
            # Point of intersection with edge and the second point is added
            add line2_intersect($l, LINE2_V2(ip, kp)) to slhd_new_poly;
            add kp to slhd_new_poly;
            new_poly_size += 2;
        }

        # Case 3: When only second point is outside
        elif i_pos < 0 and k_pos >= 0 {
            # Only point of intersection with edge is added
            add line2_intersect($l, LINE2_V2(ip, kp)) to slhd_new_poly;
            new_poly_size ++;
        } else {
            # Case 4: When both points are outside
            # No points are added
        }
        i ++;
    }

    # Copying new points into original array and changing the # of vertices
    poly_size = new_poly_size;
    delete slhd_poly_points;
    local i = 1;  # i is used earlier so we don't **need** to say local

    repeat poly_size {
        add slhd_new_poly[i] to slhd_poly_points;
        i ++;
    }
}

proc clip_slhd {
    # Input and output are actually lists, so this is a procedure with no args!
    local poly_size = length slhd_poly_points;
    local clip_size = length slhd_clip_poly;

    # i and k are two consecutive indexes
    local i = 1;
    repeat clip_size {
        local k = i % clip_size + 1;

        # We pass the current array of vertices, it's size and the end points of the selected clipper line
        _slhd_clip LINE2_V2(slhd_clip_poly[i], slhd_clip_poly[k]);

        i ++;
    }
}

# --- --- --- --- --- --- --- --- --- --- #
# circle-circle clip into 2 segments
struct CClipRet {
    x1, y1, r1, s1, e1,
    x2, y2, r2, s2, e2
}
%define CClipRet(_x1, _y1, _r1, _s1, _e1, _x2, _y2, _r2, _s2, _e2) (CClipRet{   \
    x1: _x1,                                                                    \
    y1: _y1,                                                                    \
    r1: _r1,                                                                    \
    s1: _s1,                                                                    \
    e1: _e1,                                                                    \
    x2: _x2,                                                                    \
    y2: _y2,                                                                    \
    r2: _r2,                                                                    \
    s2: _s2,                                                                    \
    e2: _e2})

func circ_clip (Circle c1, Circle c2) CClipRet {
    # return the intersection between 2 circles. 
    local Line2 isct = circ_intersect($c1, $c2);
    if isct.x1 == CircIntersectCases.circinside {
        if $c1.r > $c2.r {
            return CClipRet($c2.x, $c2.y, $c2.r, "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN");
        } else {
            return CClipRet($c1.x, $c1.y, $c1.r, "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN");
        }
        
    } elif isct.x1 != CircIntersectCases.notouch {
        local d1 = DIR($c2.x, $c2.y, isct.x2, isct.y2);
        local d2 = DIR($c2.x, $c2.y, isct.x1, isct.y1);

        if d1 < d2 {
            local pos p1 = pos($c2.x, $c2.y, $c2.r * 2, 180 + d1);
            local ret_d1 = -360 + (d2 - d1);
        } else {
            local pos p1 = pos($c2.x, $c2.y, $c2.r * 2, 180 + d1);
            local ret_d1 = d2 - d1;
        }

        d1 = DIR($c1.x, $c1.y, isct.x2, isct.y2);
        d2 = DIR($c1.x, $c1.y, isct.x1, isct.y1);

        if d1 < d2 {
            return CClipRet(p1.x, p1.y, p1.s, p1.d, ret_d1, $c1.x, $c1.y, $c1.r * 2, 180 + d2, d1 - d2);
        } else {
            return CClipRet(p1.x, p1.y, p1.s, p1.d, ret_d1, $c1.x, $c1.y, $c1.r * 2, 180 + d2, -360 + (d1 - d2));
        }
    } else {
        return CClipRet("NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN", "NaN");
    }
}
proc render_cclip CClipRet c {
    if $c.s1 == "NaN" {
        if $c.x1 != "NaN" {
            fill_circle Circle($c.x1, $c.y1, $c.r1);
        }
    } else {
        fill_segment pos($c.x1, $c.y1, $c.r1, $c.s1), $c.e1;
        fill_segment pos($c.x2, $c.y2, $c.r2, $c.s2), $c.e2;
    }
}
