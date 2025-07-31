costumes "blank.svg";
costumes "Dango Cat.svg";

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

    delete nodes;
    add Node{} to nodes;

    NODE_ADD_POS(pos(mouse_x(), mouse_y(), 1, 0));
    
    set_pen_size 5;
    tree;
    
    NODE_ADD_POS(pos(50, 50, 1, 0));
    twig;

    delete nodes;
    add Node{} to nodes;

    node_add_posm pos(0, 0, 1, 90), Mat2(
        1, mouse_x() / 120,
        mouse_y() / 120, 1 
    );
    
    set_pen_size 5;
    tree;
    
    NODE_ADD_POS(pos(50, 50, 1, 45));

    twig;
    npos_goto pos(100, 0, 100, 90);
    switch_costume "Dango Cat";
    stamp;
}

proc tree {
    # stump
    set_pen_color "#844f00";
    nv2_goto Vec2(25, 25);
    pen_down;
    nv2_goto Vec2(25, 0);
    nv2_goto Vec2(-25, 0);
    nv2_goto Vec2(-25, 25);
    pen_up;

    # tree
    set_pen_color "#00ff00";
    nv2_goto Vec2(0, 100);
    pen_down;
    nv2_goto Vec2(50, 50);
    nv2_goto Vec2(25, 50);
    nv2_goto Vec2(50, 25);
    nv2_goto Vec2(-50, 25);
    nv2_goto Vec2(-25, 50);
    nv2_goto Vec2(-50, 50);
    nv2_goto Vec2(0, 100);
    pen_up;
}

proc twig {
    set_pen_color "#844f00";
    nv2_goto Vec2(0, 0);
    pen_down;
    nv2_goto Vec2(100, 0);
    nv2_goto Vec2(70, 0);
    nv2_goto Vec2(80, 20);
    pen_up;
}
