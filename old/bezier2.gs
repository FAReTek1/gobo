# Quadratic bezier things go here
################################################################
struct Node {x, y}
struct Bezier2 {
    x0, y0, x1, y1, x2, y2
}

################################################################

func bezier2_get(Bezier2 b, t) Node {
    return Node{
        x: (1 - $t) * ((1 - $t) * $b.x0 + 2 * $t * $b.x1) + $t * $t * $b.x2,
        y: (1 - $t) * ((1 - $t) * $b.y0 + 2 * $t * $b.y1) + $t * $t * $b.y2
    };
}

proc bezier2_draw Bezier2 b, res {
    local i = 0;
    repeat $res + 1{
        node_goto bezier2_get($b, i);
        pen_down;
        i += 1 / $res;
    }
    pen_up;
}

################################################################

# Bezier polygon based on https://scratch.mit.edu/projects/858037797
list Node quad_bezier_polygon;
proc draw_bezier_poly t, res {
    local i = 1;
    local j = length quad_bezier_polygon;

    repeat length quad_bezier_polygon {
        local p0 = nodes_lerp(quad_bezier_polygon[j], quad_bezier_polygon[i], $t);
        local p1 = quad_bezier_polygon[i];
        local p2 = odes_lerp(quad_bezier_polygon[i], quad_bezier_polygon[(i) % length quad_bezier_polygon + 1], $t);
        
        draw_bezier2 Bezier2{
            x0: p0.x, y0: p0.y,
            x1: p1.x, y1: p1.y,
            x2: p2.x, y2: p2.y
        }, $res;

        j = i;
        i++;
    }    
}
