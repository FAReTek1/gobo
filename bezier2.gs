# !> pref=bez
# !> author=faretek
# !> credits=https://scratch.mit.edu/projects/914063296/
# !> desc=2D beziers.
# !> date=
# !> globals=

# Quadratic bezier
# A 3D quad bezier would be called Bez3D2. i.e. 2D is default, so you dont specify the dims
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

func bez2_get(Bez2 b, t) Vec2 {
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

## cubic bezier

struct Bez3 {
    x0, y0,
    x1, y1,
    x2, y2,
    x3, y3
}
%define Bez3(_x0, _y0, _x1, _y1, _x2, _y2, _x3, _y3) (Bez3 {\
    x0: _x0,\
    y0: _y0,\
    x1: _x1,\
    y1: _y1,\
    x2: _x2,\
    y2: _y2,\
    x3: _x3,\
    y3: _y3\
})

%define BEZ3_V2(p0, p1, p2, p3) Bez3(p0.x, p0.y, p1.x, p1.y, p2.x, p2.y, p3.x, p3.y)

%define BEZ3_GET(b, t) Vec2(\
    (1 - t) * ((1 - t) * ((1 - t) * b.x0 + 3 * t * b.x1) + 3 * t * t * b.x2) + t * t * t * b.x3,\
    (1 - t) * ((1 - t) * ((1 - t) * b.y0 + 3 * t * b.y1) + 3 * t * t * b.y2) + t * t * t * b.y3)

func bez3_get(Bez3 b, t) Vec2 {
    return BEZ3_GET($b, $t);
}

proc bez3_draw Bez3 b, res=30 {
    # https://scratch.mit.edu/projects/914063296/ with some changes
    local _1 = ($b.x3 - (3 * ($b.x2 - $b.x1))) - $b.x0;
    local _2 = 3 * ($b.x0 + ($b.x2 - $b.x1 * 2));
    local _3 = 3 * ($b.x1 - $b.x0);
    local _4 = ($b.y3 - (3 * ($b.y2 - $b.y1))) - $b.y0;
    local _5 = 3 * ($b.y0 + ($b.y2 - $b.y1 * 2));
    local _6 = 3 * ($b.y1 - $b.y0);

    local t = 0;
    goto $b.x0, $b.y0;
    pen_down;
    repeat $res {
        t += 1 / $res;
        goto $b.x0 + t * (_3 + t * (_2 + t * _1)),
             $b.y0 + t * (_6 + t * (_5 + t * _4));
    }
    pen_up;
}

# nd bezier

list Vec2 nbezier;

# get a point on the bezier using de casteljaus algorithm
list Vec2 _nbez_casteljau;
func nbez_casteljau(t) Vec2 {
    delete _nbez_casteljau;
    local i = 1;
    repeat length nbezier {
        add nbezier[i] to _nbez_casteljau;
        i++;
    }

    local l = "";
    until l == 2 {
        l = length _nbez_casteljau;

        repeat length _nbez_casteljau - 1 {
            add V2_LERP(_nbez_casteljau[1], _nbez_casteljau[2], $t) to _nbez_casteljau;
            delete _nbez_casteljau[1];
        }
        delete _nbez_casteljau[1];
    }
    return _nbez_casteljau[1];
}

# get nbezier using binomial coefs. only works for 0 <= t <= 1
func nbez_get(t) Vec2 {
    binomial_cache_row length nbezier - 1;
    local Vec2 ret = Vec2(0, 0);
    local i = 1;
    repeat length nbezier {
        local coef = binomial_cache[i] * POW($t, i - 1) * POW(1 - $t, length nbezier - i);
        # this can be adjusted for a weighted nbezier
        ret.x += coef * nbezier[i].x;
        ret.y += coef * nbezier[i].y;
        i++;
    }
    return ret;
}

proc nbez_draw res=30 {
    V2_GOTO(nbezier[1]);
    pen_down;

    local t = 0;
    repeat $res {
        t += 1 / $res;
        local Vec2 p = nbez_get(t);
        V2_GOTO(p);
    }
    pen_up;
}

# use casteljau's algorithm
proc nbez_drawc start=0, end=1, res=30 {
    local Vec2 sp = nbez_casteljau($start);
    V2_GOTO(sp);
    pen_down;

    local t = $start;
    repeat $res {
        t += ($end - $start) / $res;
        local Vec2 p = nbez_casteljau(t);
        V2_GOTO(p);
    }
    pen_up;
}
