
# Bezier polygon based on https://scratch.mit.edu/projects/858037797
list Vec2 quad_bezier_polygon;
proc draw_bezier_poly t=0.5, res=30 {
    local i = 1;
    local j = length quad_bezier_polygon;

    repeat length quad_bezier_polygon {
        bez2_draw BEZ2_V2(
            V2_LERP(quad_bezier_polygon[j], 
                    quad_bezier_polygon[i], $t),

            quad_bezier_polygon[i],
            
            V2_LERP(quad_bezier_polygon[i], 
                    quad_bezier_polygon[(i) % length quad_bezier_polygon + 1], $t)
        ), $res;

        j = i;
        i++;
    }    
}
