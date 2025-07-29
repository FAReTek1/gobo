# Pen engine for an easy to use point-demo

# nested structs would be nice here
list Vec2 pe_pts;
list pe_colors;


struct _PES {
    pt_size, add_key, remove_key, add_col
}

proc reset_pes {
    # Edit attributes of pointengine_settings to modify pointengine behaviour
     _PES pointengine_settings = _PES{
        pt_size: 5,
        add_key: "",
        remove_key: "",
        add_col: "#FF0000"
     };
}


proc pointengine_control_tick {
    local i = 1;
    local any_held = false;

    if not(key_pressed(pointengine_settings.add_key)) and lf_add_btn_pressed {
        add V2_MOUSE() to pe_pts;
        add pointengine_settings.add_col to pe_colors;
    }
    # lf = last frame
    local lf_add_btn_pressed = key_pressed(pointengine_settings.add_key);

    repeat length pe_pts {
        local Vec2 p = pe_pts[i];

        if V2_DIST(p, _pointengine_old_mv) < pointengine_settings.pt_size / 2 {
            # Touching mouse
            if mouse_down() and not any_held {
                any_held = true;
                pe_pts[i] = V2_MOUSE();
            }

            if key_pressed(pointengine_settings.remove_key) {
                # pts[i].x = "NaN";
                # pts[i].y = "NaN";
                delete pe_pts[i];
                delete pe_colors[i];
            }
        }

        i++;
    }
    Vec2 _pointengine_old_mv = V2_MOUSE();
}

proc pointengine_render {
    local i = 1;

    repeat length pe_pts {
        local Vec2 p = pe_pts[i];
        set_pen_color pe_colors[i];
        set_pen_size pointengine_settings.pt_size;

        if V2_DIST(p, V2_MOUSE()) < pointengine_settings.pt_size / 2 {
            change_pen_brightness 25;
            change_pen_saturation -25;
            if mouse_down() {
                change_pen_brightness 25;
                change_pen_saturation -25;
            }
        }

        fnc_v2_goto p;
        pen_du;

        i++;
    }
}

proc pointengine_tick {
    pointengine_control_tick;
    pointengine_render;
}

# Utilities for generating shapes from point indecies

func circle_by_idx(i1, i2) Circle {
    return Circle(
        (pe_pts[$i1].x + pe_pts[$i2].x) / 2,
        (pe_pts[$i1].y + pe_pts[$i2].y) / 2,
        V2_DIST(pe_pts[$i1], pe_pts[$i2]) / 2
    );
}

func line_by_idx(i1, i2) Line2 {
    return LINE2_V2(pe_pts[$i1], pe_pts[$i2]);
}

func pos_by_idx(i1, i2) pos {
    return pos(
        pe_pts[$i1].x,
        pe_pts[$i1].y,
        V2_DIST(pe_pts[$i1], pe_pts[$i2]),
        V2_DIR_TO(pe_pts[$i2], pe_pts[$i1])
    );
}

proc pe_add_pt Vec2 p, color="" {
    if $color == "" {
        add pointengine_settings.add_col to pe_colors;
    } else {
        add $color to pe_colors;
    }
    add $p to pe_pts;
}
proc pe_clear_pts {
    delete pe_pts;
    delete pe_colors;
}

proc pe_add_pts ct, color="" {
    repeat $ct {
        pe_add_pt V2_RANDSCR(), $color;
    }
}
