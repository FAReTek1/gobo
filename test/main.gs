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

struct Vec3 {
    # also using this to represent a parabola
    x,
    y,
    z
}

%define Vec3(a,b,c) Vec3{x:a, y:b, z:c}

%define V3P_GET(p, x) p.x * x * x + p.y * x + p.z

func v3p_solve(Vec3 p) Vec2 {
    local discrim = $p.y * $p.y - 4 * $p.x * $p.z;
    if discrim < 0 {
        return Vec2("NaN", "NaN");
    }

    return Vec2(
        ($p.y - sqrt(discrim)) / (-2 * $p.x),
        ($p.y + sqrt(discrim)) / (-2 * $p.x)
    );
}

func get_abc_components_of_equation_equating_df_paras(d, Vec2 f, Vec2 g) Vec3 {
    return Vec3(
        0.5 / ($f.y - $d) - 0.5 / ($g.y - $d),
        $g.x / ($g.y - $d) - $f.x / ($f.y - $d),
        0.5 * ($f.x * $f.x / ($f.y - $d) - $g.x * $g.x / ($g.y - $d) - $g.y + $f.y)
    );
}

func get_directrix_focus_parabola_at(x, d, Vec2 f) Vec2 {
    return Vec2($x, 1 / (2 * ($f.y - $d)) * ($x - $f.x) * ($x - $f.x) + ($f.y + $d) / 2);
}

proc render {
    pe_colors[1] = "#0000FF";
    d = pe_pts[1].y;

    set_pen_size 1;
    set_pen_color "#0000FF";
    goto -240, d;
    pen_down;
    goto 240, d;
    pen_up;

    set_pen_color "#FF0000";

    i = 2;
    repeat length pe_pts - 2 {
        df pe_pts[i], pe_pts[i + 1];
        i++;
    }
    df pe_pts[i], pe_pts[2];
    
    pointengine_render;
}

proc draw_vertline x {
    if $x == "" + $x {
        goto $x, -180;
        pen_down;
        goto $x, 180;
        pen_up;
    }
}

proc df Vec2 f, Vec2 g {
    local Vec2 f = $f;
    local Vec2 g = $g;

    local Vec3 soln_p = get_abc_components_of_equation_equating_df_paras(d, f, g);
    local Vec2 solns = v3p_solve(soln_p);

    draw_vertline solns.x;
    draw_vertline solns.y;

    fnc_goto -241, 180;
    repeat 480 {
        fnc_v2_goto get_directrix_focus_parabola_at(x_position() + 1, d, f);
        pen_down;
    }
    pen_up;
}
