%include ..\vec2

onflag {
    switch_costume "blank";
    
    Mat2 A = Mat2(
        0, 1,
        2, 0
    );

    log v2_str(mat2_get_eigenvector_gradients(A));

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

    Mat2 rot = MAT2_ROTATION(90);
    Mat2 shear = MAT2_SHEAR(mouse_x() / 60);

    Vec2 mv = V2_MOUSE();

    Mat2 c1 = MAT2_MUL(rot, shear);
    Mat2 c2 = MAT2_MUL(shear, rot);

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
    v2_draw mv;

    set_pen_color "#4098ab";
    v2_draw MAT2_MUL_V2(c1, mv);
    
    set_pen_color "#ab4040ff";
    v2_draw MAT2_MUL_V2(c2, mv);
}

proc demo x, y, mode{
    if $mode == 0 {
        set_pen_color "#1f1f1f";
        goto $x, $y;
        pen_down;
        pen_up;

    } elif $mode == 1 {
        Vec2 u = Vec2($x, $y);
        
        Vec2 v = MAT2_MUL_V2(c1, u);

        set_pen_color "#4097abff";
        v2_draw_dot v;

    } elif $mode == 2 {
        Vec2 u = Vec2($x, $y);
        
        Vec2 v = MAT2_MUL_V2(c2, u);

        set_pen_color "#ab4040ff";
        v2_draw_dot v;
    }
}
