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
        pe_add_pts 6;
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

    set_pen_size 1;
    set_pen_color "#0000FF";
    FILL_TRI_V2(pe_pts[1], pe_pts[2], pe_pts[3]);

    delete slhd_poly_points;
    add pe_pts[1] to slhd_poly_points;
    add pe_pts[2] to slhd_poly_points;
    add pe_pts[3] to slhd_poly_points;

    gen_slhd_clip_regply 5, 100;
    set_pen_color "#AAAAFF";
    DRAW_V2_LIST(slhd_clip_poly);
    set_pen_color "0x5500FF00";

    clip_slhd;
    FILL_V2_LIST(slhd_new_poly);    
}
