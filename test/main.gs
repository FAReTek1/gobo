costumes "blank.svg";

costumes "../assets/f3d/*";
costumes "../assets/thinkingplanely stretch box (4000x4000).svg" as "stretch1";
costumes "../assets/thinkingplanely stretch box flipped (4000x4000).svg" as "stretch1f";
%define RUN_TEST_MODULE
# %include test_mods\geo2d
%include ..\include

hide;

proc tick {
    erase_all;
    set_brightness_effect -100;
    f3d_prism pos(0, 0, 100, 90), "Cat", "", timer() * 90, 10, 10;

    clear_graphic_effects;
    fnc_goto_pos pos(0, 0, 100, 90);
    if f3d_prism_face("Cat", "", timer() * 90) {
        stamp;
    }
    ########################
    switch_costume "stretch1";
    goto_pos_stretch pos(100, 0, 100, 90), v2_scale(v2_sub(V2_MOUSE(), Vec2(100, 0)), 2);
    stamp;
}

onflag {
    cache_costume_dims;

    forever{
        tick;
    }
}

# proc tick{
    # local Vec2 v = V2_MOUSE();
    # local Line2 l = Line2(0, 0, 100, 100);
# }
# 
# onflag{
    # forever {
        # erase_all;
        # tick;
    # }
# }
