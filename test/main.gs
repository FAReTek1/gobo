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

proc render {
    set_pen_size 1;
    set_pen_color "#0000FF";
    Bez3 b = BEZ3_V2(pe_pts[1], pe_pts[2], pe_pts[3], pe_pts[4]);

    bez3_draw b;
}

proc draw_vertline x {
    if $x == "" + $x {
        goto $x, -180;
        pen_down;
        goto $x, 180;
        pen_up;
    }
}
