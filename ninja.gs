# pengine for node.gs

###################### GOTO ######################
%define NV2_GOTO(v) V2_GOTO(V2_APPLY(v))
proc nv2_goto Vec2 v {
    NV2_GOTO($v);
}
%define N_GOTO(X, Y) goto _node_cache.x + (X * _node_matrix.a + Y * _node_matrix.b),\
                          _node_cache.y + (X * _node_matrix.c + Y * _node_matrix.d)

%define NPOS_GOTO(p) fnc_goto_pos POS_APPLY(p)
proc npos_goto pos p {
    NPOS_GOTO($p);
}

###################### tri ######################
proc nfl_tri x1, y1, x2, y2, x3, y3 {
    local Vec2 v1 = Vec2($x1, $y1);
    local Vec2 v2 = Vec2($x2, $y2);
    local Vec2 v3 = Vec2($x3, $y3);
    local Vec2 p1 = V2_APPLY(v1);
    local Vec2 p2 = V2_APPLY(v2);
    local Vec2 p3 = V2_APPLY(v3);
    FILL_TRI_V2(p1, p2, p3);
}
######################  ######################
######################  ######################
######################  ######################
######################  ######################
######################  ######################
######################  ######################
