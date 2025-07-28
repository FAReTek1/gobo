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

    forever {
        projectenv_fps_tick;

        erase_all;
        pointengine_control_tick;
        render;
    }
}

proc render {
    pe_colors[1] = "#0000FF";
    Vec2 d = pe_pts[1];

    set_pen_size 1;
    set_pen_color "#0000FF";
    goto -240, d.y;
    pen_down;
    goto 240, d.y;
    pen_up;

    set_pen_color "#FF0000";

    i = 2;
    repeat length pe_pts - 1{
        Vec2 f = pe_pts[i];
        
        fnc_goto -240, 180;
        repeat 480 {
            x = x_position();
            y = 1 / (2 * (f.y - d.y)) * (x - f.x) * (x - f.x) + (f.y + d.y) / 2;
            fnc_goto x + 1, y;
            pen_down;
        }
        pen_up;
        i++;
    }
    
    pointengine_render;
}
