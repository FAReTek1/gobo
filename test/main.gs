costumes "blank.svg";

costumes "../assets/f3d/*";
%define RUN_TEST_MODULE
# %include test_mods\geo2d
%include ..\include

proc tick {
    erase_all;
    f3d_prism pos(0, 0, 100, 90), "Cat", "", timer() * 90, 10, 10;
}

onflag {
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
