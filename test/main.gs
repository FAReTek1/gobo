costumes "blank.svg";

costumes "../assets/f3d/*";
costumes "../assets/thinkingplanely stretch box (4000x4000).svg" as "stretch1";
costumes "../assets/thinkingplanely stretch box flipped (4000x4000).svg" as "stretch1f";

%define RUN_TEST_MODULE
%include ..\include
# %include test_mods\geo2d
hide;
onflag {
    forever {
        erase_all;
        Bez2 a = Bez2(
            0, 0,
            100, 0,
            mouse_x(), mouse_y()
        );

        bez2_draw a;
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
