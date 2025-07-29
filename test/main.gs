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
        pe_add_pts 5;
    }

    forever {
        projectenv_fps_tick;

        erase_all;
        pointengine_control_tick;
        render;
        pointengine_render;
    }
}

%define GRAPH_EXPR(y)                       \
    x = -240;                               \
    repeat 481 {                            \
        fnc_goto x, y;                      \
        pen_down;                           \
        x++;                                \
    }                                       \
    pen_up;


proc render {
    FNC_POS_HACK;

    delete cnc_ngon;
    i = 3;
    repeat length pe_pts - 2 {
        add pe_pts[i] to cnc_ngon;
        i++;
    }

    set_pen_color "#000000";
    set_pen_size 1;

    Circle c = pe_circle(1, 2);
    draw_circle c;

    set_pen_color "#0000FF";
    DRAW_V2_LIST(cnc_ngon);

    set_ps_color_HEX "5500FF00";
    circle_ngon_clip c;
    render_cnc;
}
