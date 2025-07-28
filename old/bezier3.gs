# Cubic bezier things go here
################################################################
struct Node {x, y}
struct Bezier3 {
    x0, y0, x1, y1, x2, y2, x3, y3
}
################################################################
func bezier3_get(Bezier3 b, t) Node {
    return Node{
        x: (1 - $t) * ((1 - $t) * ((1 - $t) * $b.x0 + 3 * $t * $b.x1) + 3 * $t * $t * $b.x2) + $t * $t * $t * $b.x3,
        y: (1 - $t) * ((1 - $t) * ((1 - $t) * $b.y0 + 3 * $t * $b.y1) + 3 * $t * $t * $b.y2) + $t * $t * $t * $b.y3
    };
}
################################################################
proc bezier3_draw Bezier3 b, res {
    # https://scratch.mit.edu/projects/914063296/ with some changes
    local _1 = ($b.x3 - (3 * ($b.x2 - $b.x1))) - $b.x0;
    local _2 = 3 * ($b.x0 + ($b.x2 - $b.x1 * 2));
    local _3 = 3 * ($b.x1 - $b.x0);
    local _4 = ($b.y3 - (3 * ($b.y2 - $b.y1))) - $b.y0;
    local _5 = 3 * ($b.y0 + ($b.y2 - $b.y1 * 2));
    local _6 = 3 * ($b.y1 - $b.y0);

    local t = 0;
    goto $b.x0, $b.y0;

    repeat $res {
        t += 1 / $res;
        goto $b.x0 + t * (_3 + t * (_2 + t * _1)),
             $b.y0 + t * (_6 + t * (_5 + t * _4));
    }
    pen_up;
}
