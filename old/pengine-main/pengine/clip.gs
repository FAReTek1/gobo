# geo2d clip rendering
# Some of these require shapes e.g. segments, so the code is here

################################################################

proc _cnc_segment_by_coords Node p1, Node p2 {
    local d1 = node_dir($p1, circle_pt(cnc_circle)) % 360;
    local d2 = node_dir($p2, circle_pt(cnc_circle)) % 360;

    if d1 != d2 {
        if _cnc_flip == 1 {
            if d1 < d2 {
                fill_segment pos_from_circle(cnc_circle, d1), d2 - d1;
            } else {
                fill_segment pos_from_circle(cnc_circle, d1 - 360), d2 - (d1 - 360);
            }
        } else {
            if d1 < d1 {
                fill_segment pos_from_circle(cnc_circle, d2), d1 - d2;
            } else {
                fill_segment pos_from_circle(cnc_circle, d2 - 360), d1 - (d2 - 360);
            }
        }
    }
}

proc render_cnc {
    if _cnc_buffer1[1].x != "OUT POLY" {
        if length _cnc_buffer1 == 0 {
            fill_circle cnc_circle;
            
        } else {
            local Circle c = cnc_circle;
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
