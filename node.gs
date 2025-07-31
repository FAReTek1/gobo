# 2d node system like godot/unity

struct Node {
    x=0,
    y=0,
    s=1,
    d=0,
    ix=1, jx=0,
    iy=0, jy=1
}

%define Node(_x, _y, _s, _d, _ix, _jx, _iy, _jy) (Node {\
    x: _x,\
    y: _y,\
    s: _s,\
    d: _d,\
    ix: _ix,\
    jx: _jx,\
    iy: _iy,\
    jy: _jy})

list Node nodes;
%define MAT2_POS(p) Mat2(\
 cos(p.d) * (p.s), sin(p.d) * (p.s),\
-sin(p.d) * (p.s), cos(p.d) * (p.s))

%define NODE_ADD_POS(p) add Node(p.x, p.y, p.s, p.d,\
 cos(p.d) * (p.s), sin(p.d) * (p.s),\
-sin(p.d) * (p.s), cos(p.d) * (p.s)) to nodes; node_cache

%define MAT2_NODE(n) Mat2(n.ix, n.jx, n.iy, n.jy)

proc node_add_pos pos p {
    NODE_ADD_POS($p);
}

proc node_add_posm pos p, Mat2 m {
    local Mat2 m1 = MAT2_POS($p);
    local Mat2 m2 = MAT2_MUL(m1, $m);

    add Node($p.x, $p.y, $p.s, $p.d, 
        m2.a, m2.b, 
        m2.c, m2.d) to nodes;

    node_cache;
}

%define V2_APPLY(v) Vec2(\
    _node_cache.x + (v.x * _node_matrix.a + v.y * _node_matrix.b),\
    _node_cache.y + (v.x * _node_matrix.c + v.y * _node_matrix.d))

%define NODE_RM1 delete nodes["last"]
%define NODE_RM(t) repeat t {delete nodes["last"];}

%define NODE_RESET delete nodes; add Node{} to nodes

%define NV2_GOTO(v) V2_GOTO(V2_APPLY(v))
proc nv2_goto Vec2 v {
    NV2_GOTO($v);
}
%define N_GOTO(X, Y) goto _node_cache.x + (X * _node_matrix.a + Y * _node_matrix.b),\
                          _node_cache.y + (X * _node_matrix.c + Y * _node_matrix.d)

%define POS_APPLY(p) pos(\
    _node_cache.x + (p.x * _node_matrix.a + p.y * _node_matrix.b),\
    _node_cache.y + (p.x * _node_matrix.c + p.y * _node_matrix.d),\
    _node_cache.s * p.s, _node_cache.d + p.d)

%define NPOS_GOTO(p) fnc_goto_pos POS_APPLY(p)
proc npos_goto pos p {
    NPOS_GOTO($p);
}

func nv2_inverse(Vec2 v) Vec2 {
    if _inverse_node_matrix.a == "uncached" {
        Mat2 _inverse_node_matrix = MAT2_INVERSE(_node_matrix, _node_cache.s);
    }
    # we can do this even though node cache is not a vec2, because macros dont do typing - basically duck typed
    local Vec2 v = V2_SUB($v, _node_cache);
    return MAT2_MUL_V2(_inverse_node_matrix, v);
}


onflag {
    pos _node_cache = pos(0, 0, 1, 0);
    Mat2 _node_matrix = Mat2(
        1, 0,
        0, 1);
    Mat2 _inverse_node_matrix = mat2_inverse(_node_matrix);
}

proc node_cache {
    _node_cache = pos(nodes["last"].x, nodes["last"].y, nodes["last"].s, nodes["last"].d);
    _node_matrix = MAT2_NODE(nodes["last"]);

    local i = length nodes - 1;
    repeat i {
        local Mat2 currm = MAT2_NODE(nodes[i]);
        local Vec2 ncv = MAT2_MUL_V2(currm, _node_cache);

        _node_cache.x = ncv.x + nodes[i].x;
        _node_cache.y = ncv.y + nodes[i].y;
        # _node_cache.s *= nodes[i].s;
        _node_cache.d += nodes[i].d;

        _node_matrix = mat2_mul(currm, _node_matrix);
        i--;
    }
    # does normal multiplication look better? it has less domain, so idk
    # this does mean that the scale attr of the Node can be removed
    _node_cache.s = MAT2_DET(_node_matrix);
    _inverse_node_matrix.a = "uncached";
}
