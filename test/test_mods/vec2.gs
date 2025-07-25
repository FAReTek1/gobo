%include ..\vec2
costumes "blank.svg";

onflag {
    switch_costume "blank";
    
    Mat2 A = Mat2(
        0, 1,
        2, 0
    );

    log str_v2(get_eigenvector_gradients_mat2(A));

    forever{
        tick;
    }
}

proc tick {
    erase_all;
    set_pen_size 1000;
    set_pen_color "#000000";
    goto 0, 0;
    pen_down; 
    pen_up;

    set_pen_size 2;

    Mat2 rot = ROTATION_MATRIX(90);
    Mat2 shear = SHEAR_MATRIX(mouse_x() / 60);

    Vec2 mv = MOUSE_V2();

    Mat2 c1 = MUL_MAT2(rot, shear);
    Mat2 c2 = MUL_MAT2(shear, rot);

    res = 20;
    mode = 0;
    repeat 3 {
        y = -180;
        repeat 360 / res {
            x = -240;
            repeat 480 / res {
                demo x, y, mode;
                x += res;
            }
            y += res;
        }
        mode++;
    }

    set_pen_color "#1f1f1f";
    draw_v2 mv;

    set_pen_color "#4098ab";
    draw_v2 MUL_MAT2_V2(c1, mv);
    
    set_pen_color "#ab4040ff";
    draw_v2 MUL_MAT2_V2(c2, mv);
}

proc demo x, y, mode{
    if $mode == 0 {
        set_pen_color "#1f1f1f";
        goto $x, $y;
        pen_down;
        pen_up;

    } elif $mode == 1 {
        Vec2 u = Vec2($x, $y);
        
        Vec2 v = MUL_MAT2_V2(c1, u);

        set_pen_color "#4097abff";
        draw_v2_dot v;

    } elif $mode == 2 {
        Vec2 u = Vec2($x, $y);
        
        Vec2 v = MUL_MAT2_V2(c2, u);

        set_pen_color "#ab4040ff";
        draw_v2_dot v;
    }
}