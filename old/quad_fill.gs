# quad fill based on https://scratch.mit.edu/projects/1128076882/editor/
# original by nakakoutv
%include ..\Vec2

proc quad_fill_ccw Vec2 p1, Vec2 p2, Vec2 p3, Vec2 p4 {
    # v1 = p1 <- p2
    # v2 = p2 <- p3
    # v3 = p3 <- p4
    # v4 = p4 <- p1
    local Vec2 v1 = SUB_V2($p1, $p2);
    local Vec2 v2 = SUB_V2($p2, $p3);
    local Vec2 v3 = SUB_V2($p3, $p4);
    local Vec2 v4 = SUB_V2($p4, $p1);

    # d1 = dist(p1, p2)
    # d2 = dist(p2, p3)
    # d3 = dist(p3, p4)
    # d4 = dist(p4, p1)
    local d1 = MAG_V2(v1);
    local d2 = MAG_V2(v2);
    local d3 = MAG_V2(v3);
    local d4 = MAG_V2(v4);
}
