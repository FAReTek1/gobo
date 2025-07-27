# 2D intersection scripts and stucts for geometrical objects
# does not directly implement a Vector/Point/Node struct - it uses vec2.gs
# Intersections belong to the simpler object (i.e. less params)
%include ..\vec2
%include ..\math

###################### structs ######################
struct Polar{r, t} # t = theta
%define Polar(a,b) (Polar{r:a, t:b})

# Ideally this would be p1, p2, but no nested structs yet
# If x1 is NaN (ignore the rest), then don't draw the line
# also works as a package for 2 vec2s
struct Line2 {x1, y1, x2, y2}
%define Line2(a,b,c,d) (Line2{x1:a, y1:b, x2:c, y2:d})

struct Circle {x, y, r}
%define Circle(a,b,c) (Circle{x:a, y:b, r:c})

# Struct representing a rectangle bounded by x/y min & max values
struct Box {xmin, ymin, xmax, ymax}
%define Box(x1,y1,x2,y2) (Box{xmin:x1,ymin:y1,xmax:x2,ymax:y2})

###################### Polar ######################
%define PLR_TO_V2(s) Vec2(s.r * cos(s.t), s.r * sin(s.t))
func plr_to_v2(Polar s) {return PLR_TO_V2($s);}

###################### Vec2 ######################
%define V2_TO_PLR(s) Polar(V2_MAG(s), V2_DIRCC(s))
func v2_to_plr(Vec2 s) {return V2_TO_PLR($s);}

###################### Line ######################
%define _LINE2FILL(a) Line2(a, a, a, a)
%define LINE2_V2(p1,p2) Line2(p1.x, p1.y, p2.x, p2.y)
func line2_v2(Vec2 p1, Vec2 p2) Line2 {return LINE2_V2($p1, $p2);}

%define LINE2_P1(l) Vec2(l.x1, l.y1)
%define LINE2_P2(l) Vec2(l.x2, l.y2)

# returns vector from p1 to p2
%define LINE2_DV(l) Vec2(l.x2 - l.x1, l.y2 - l.y1)
%define LINE2_DX(l) (l.x2 - l.x1)
%define LINE2_DY(l) (l.y2 - l.y1)

# Check against the sign of this value. If it's equal to 0, it is on the line
# if it is - or + it is on one side of the line. - and + are opposite sides
# this uses a determinant to get a signed area
func line2_side_v2(Line2 l, Vec2 p) {
    return V2_AREA(LINE2_DV($l), Vec2($p.x - $l.x1, $p.y - $l.y1));
}

%define LINE2_GET_INTS_DENOM(a, b) ((a.x1 - a.x2) * (b.y1 - b.y2) - (a.y1 - a.y2) * (b.x1 - b.x2))
%define LINE2_INTERSECT_DENOM(a, b, denom) Vec2(\
    ((a.x1 * a.y2 - a.y1 * a.x2) * (b.x1 - b.x2) - (a.x1 - a.x2) * (b.x1 * b.y2 - b.y1 * b.x2)) / denom,\
    ((a.x1 * a.y2 - a.y1 * a.x2) * (b.y1 - b.y2) - (a.y1 - a.y2) * (b.x1 * b.y2 - b.y1 * b.x2)) / denom)
%define LINE2_INTERSECT(a, b) LINE2_INTERSECT_DENOM(a, b, LINE2_GET_INTS_DENOM(a, b))

func line2_intersect(Line2 self, Line2 other) Vec2 {
    local den = LINE2_GET_INTS_DENOM($self, $other);
    return LINE2_INTERSECT_DENOM($self, $other, den);
}

proc line2_draw Line2 l {
    goto $l.x1, $l.y1;
    pen_down;
    goto $l.x2, $l.y2;
    pen_up;
}

%define LINE2_IS_VERTICAL(l) (l.x1 == l.x2)
%define LINE2_IS_HORIZONTAL(l) (l.y1 == l.y2)

%define LINE2_GRAD(l) (LINE2_DY(l) / LINE2_DX(l))
%define LINE2_INTC(l, m) ((l.y1) - (l.x1) * (m)) # m = LINE2_GRAD(l)

func line2_intersect_circ(Line2 l, Circle c) Line2 {
    if LINE2_IS_VERTICAL($l) {
        # Vertical lines actually make the calculation extremely simple
        # https://www.desmos.com/calculator/qkkk3idnkq
        local discrim = $c.r * $c.r - ($l.x1 - $c.x) * ($l.x1 - $c.x);

        if discrim < 0 {
            return _LINE2FILL("NaN");
        } else {
            return Line2(
                $l.x1,
                $c.y + sqrt(discrim),
                $l.x1,
                $c.y - sqrt(discrim)
            );
        }
    } else {
        # https://www.desmos.com/calculator/hhyihldhhp
        local m = LINE2_GRAD($l);
        local c = ($l.y1 - $c.y) - ($l.x1 - $c.x) * m;

        local discrim = $c.r * $c.r * (m * m + 1) - c * c;
        if discrim < 0 {
            return _LINE2FILL("NaN");

        } else {
            local x1 = (sqrt(discrim) - m * c) / (1 + m * m);
            local x2 = (sqrt(discrim) + m * c) / (-1 - m * m);

            return Line2(
                x1 + $c.x, 
                m * x1 + c + $c.y,
                x2 + $c.x,
                m * x2 + c + $c.y
            );
        }
    }
}

###################### Circle ######################

%define CIRC_V2R(p,r) Circle(p.x, p.y, r)
%define V2_CIRC(c) Vec2(c.x, c.y)

enum CircIntersectCases {
    notouch = "notouch",
    circinside = "circinside",
}

proc circ_draw Circle c, res=30 {
    goto $c.x + $c.r, $c.y;
    pen_down;
    local a = 0;
    repeat $res {
        a += 360 / $res;
        goto $c.x + $c.r * cos(a), $c.y + $c.r * sin(a);
    }
    pen_up;
}

# returns the intersect of two circles - i.e. 2 points
# returns a line which is a packages for the 2 points
func circ_intersect(Circle c1, Circle c2) Line2 {
    # i1 & i2
    local dx = $c2.x - $c1.x;
    local dy = $c2.y - $c1.y;

    # i3
    local disquared = dx * dx + dy * dy;

    if disquared > ($c1.r + $c2.r) * ($c1.r + $c2.r) {
        return _LINE2FILL(CircIntersectCases.notouch);
    }

    if disquared < ($c1.r - $c2.r) * ($c1.r - $c2.r) {
        return _LINE2FILL(CircIntersectCases.circinside);
    }

    local dist = sqrt(disquared);

    # i1 & i2
    local vx = dx / dist;
    local vy = dy / dist;

    # This is old code, idk what to call this :\ I think it's some kind of magnitude to multiply by unit vector
    # i6
    local m1 = ((($c1.r * $c1.r) - ($c2.r * $c2.r)) + disquared) / (2 * dist);

    # i7 & i8
    local mdx = $c1.x + m1 * vx;
    local mdy = $c1.y + m1 * vy;

    # i9
    local m2 = sqrt(($c1.r * $c1.r) - (m1 * m1)); # Putting a lot of brackets because goboscript seems to have BIDMAS errors

    # i10 & i11
    local ox = m2 * vx;
    local oy = m2 * vy;

    return Line2(
        mdx + oy,
        mdy - ox,
        mdx - oy,
        mdy + ox
    );
}

%define CIRC_OUTER_TANGENT_POINTS_TO_V2(c,p) circ_intersect(c, Circle( \
        (c.x + p.x) / 2,\
        (c.y + p.y) / 2,\
        DIST(c.x, c.y, p.x, p.y) / 2))
func circ_outer_tangent_points_to_v2(Circle c, Vec2 p) Line2 {
    return CIRC_OUTER_TANGENT_POINTS_TO_V2($c, $p);
}
