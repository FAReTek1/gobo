
# Bezier polygon based on https://scratch.mit.edu/projects/858037797
list Vec2 quad_bezier_polygon;
proc draw_bezier_poly t=0.5, res=30 {
    local i = 1;
    local j = length quad_bezier_polygon;

    repeat length quad_bezier_polygon {
        local Vec2 p0 = V2_LERP(quad_bezier_polygon[j], quad_bezier_polygon[i], $t);
        local Vec2 p1 = quad_bezier_polygon[i];
        local Vec2 p2 = V2_LERP(quad_bezier_polygon[i], quad_bezier_polygon[(i) % length quad_bezier_polygon + 1], $t);
        
        bez2_draw Bez2(
            p0.x, p0.y,
            p1.x, p1.y,
            p2.x, p2.y
        ), $res;

        j = i;
        i++;
    }    
}
