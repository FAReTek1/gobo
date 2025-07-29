costumes "blank.svg";

costumes "../assets/f3d/*";
costumes "../assets/thinkingplanely stretch box (4000x4000).svg" as "stretch1";
costumes "../assets/thinkingplanely stretch box flipped (4000x4000).svg" as "stretch1f";

%define DISABLE_PROJECTENV_AUTO_LOOP
%define DISABLE_PROJECTENV_LOOP_ON_STOP

%define RUN_TEST_MODULE
%include ..\include
# %include test_mods\geo2d
hide;
onflag {
    reset_pes;
    pointengine_settings.add_key = "a";
    pointengine_settings.remove_key = "x";
    
    if length pe_pts == 0 {
        pe_add_pts 4;
    }

    forever {
        projectenv_fps_tick;

        erase_all;
        pointengine_control_tick;
        render;
        pointengine_render;
    }
}

%define GRAPH_EXPR(y)                        \
    x = -240;                               \
    repeat 481 {                            \
        fnc_goto x, y;                      \
        pen_down;                           \
        x++;                                \
    }                                       \
    pen_up;

%define LINE2_DRAW(l) goto l.x1, l.y1; pen_down; goto l.x2, l.y2; pen_up
%define BOX_DRAW(b)             \
        goto b.xmin, b.ymin;    \
        pen_down;               \
        goto b.xmin, b.ymax;    \
        goto b.xmax, b.ymax;    \
        goto b.xmax, b.ymin;     \
        goto b.xmin, b.ymin;    \
        pen_up

proc render {
    FNC_POS_HACK;

    set_pen_size 1;
    pos p = pe_pos(1, 2);

    Line2 l1 = pe_line(1, 2);
    Line2 l2 = pe_line(2, 3);

    h1 = 2 * abs(sdf_line_seg(pe_line(1, 2), pe_pts[4]));
    h2 = 2 * abs(sdf_line_seg(pe_line(2, 3), pe_pts[4]));
    h = MIN(h1, h2);
    set_pen_size h;

    set_pen_color "#0000FF";
    LINE2_DRAW(l1);
    LINE2_DRAW(l2);
    set_ps_color_HEX "00FF00";
    fill_miter_arc l1, l2, h;
}


proc draw_vertline x {
    if $x == "" + $x {
        goto $x, -180;
        pen_down;
        goto $x, 180;
        pen_up;
    }
}
