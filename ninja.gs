# pengine for node.gs

# goto
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

