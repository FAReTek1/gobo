costumes "blank.svg";

costumes "../assets/f3d/*";
costumes "../assets/thinkingplanely stretch box (4000x4000).svg" as "stretch1";
costumes "../assets/thinkingplanely stretch box flipped (4000x4000).svg" as "stretch1f";
costumes "sttf1.svg", "sttf2.svg", "sttf3.svg";

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
        # pe_add_pts 4;
        pe_add_pt Vec2(68, -114);
        pe_add_pt Vec2(-167, 43);
        pe_add_pt Vec2(137, 14);
        pe_add_pt Vec2(109, -71);
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

    pe_colors[1] = "#FF0000";
    pe_colors[2] = "#FFAA00";
    pe_colors[3] = "#00FF00";
    pe_colors[4] = "#0000FF";

    set_pen_color "#0000FF";
    set_pen_size 1;
    quad_fill pe_pts[1], pe_pts[2], pe_pts[3], pe_pts[4];
}
