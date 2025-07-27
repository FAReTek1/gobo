%include ..\geo2d

nowarp proc test_geo2d {
    forever {
        erase_all;

        local Vec2 p = Vec2(3, 5);
        local Polar q = V2_TO_PLR(p);
        local Vec2 r = PLR_TO_V2(q);

        local Vec2 v = Vec2(0, 0);

        # local Line2 l1 = LINE2_V2(v, v2_mouse());
        # local Line2 l2 = Line2(-50, 0, 100, 50);

        # local Vec2 i = LINE2_INTERSECT(l1, l2);
        # set_pen_color "#0000FF";
        # set_pen_size 1;
        # line2_draw l1;
        # line2_draw l2;

        # set_pen_color "#FF0000";
        # set_pen_size 5;
        # v2_draw_dot i;

        set_pen_color "#0000FF";
        set_pen_size 1;

        local Circle c1 = Circle(0, 0, 100);
        local Line2 l = LINE2_V2(Vec2(50, 100), V2_MOUSE());

        circ_draw c1;
        line2_draw l;

        set_pen_color "#FF0000";

        local Line2 solns = line2_intersect_circ(l, c1);
        if solns.x1 == solns.x1 + "" {
            line2_draw solns;
        }
    }
}

%if RUN_TEST_MODULE
onflag {test_geo2d;}
%endif
