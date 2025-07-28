# !> pref=bez
# !> author=faretek
# !> credits=https://scratch.mit.edu/projects/858037797
# !> desc=2D beziers.
# !> date=
# !> globals=

# Quadratic bezier
# A 3D quad bezier would be called Bez3D2. i.e. 2D is default, so you dont specify the dims
# TODO: if/when nested structs exist, consider just making 1d beziers and making these 2d ones just contain 2 1d ones
struct Bez2 {
    x0, y0,
    x1, y1,
    x2, y2
}

%define Bez2(_x0, _y0, _x1, _y1, _x2, _y2) (Bez2 {\
    x0: _x0,\
    y0: _y0,\
    x1: _x1,\
    y1: _y1,\
    x2: _x2,\
    y2: _y2\
})


%define BEZ2_V2(p0, p1, p2) Bez2(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y)

%define BEZ2_GET(b, t) Vec2(\
    (1 - t) * ((1 - t) * b.x0 + 2 * t * b.x1) + t * t * b.x2,\
    (1 - t) * ((1 - t) * b.y0 + 2 * t * b.y1) + t * t * b.y2)

func bezier2_get(Bez2 b, t) Vec2 {
    return BEZ2_GET($b, $t);
}

proc bez2_draw Bez2 b, res=30 {
    local t = 0;
    goto $b.x0, $b.y0;
    pen_down;

    repeat $res {
        t += 1 / $res;
        V2_GOTO(BEZ2_GET($b, t));
    }
    pen_up;
}
