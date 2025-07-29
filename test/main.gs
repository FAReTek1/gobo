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
    delete nbezier;

    i = 1;
    repeat length pe_pts {
        add pe_pts[i] to nbezier;
        i++;
    }

    t = 0;
    repeat 31 {
        Vec2 p = nbez_casteljau(t);
        V2_GOTO(p);
        pen_down;
        t += 1.0 / 30.0;
    }
    pen_up;
}

proc draw_vertline x {
    if $x == "" + $x {
        goto $x, -180;
        pen_down;
        goto $x, 180;
        pen_up;
    }
}
