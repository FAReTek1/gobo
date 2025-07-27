# the camera struct is identical to the pos struct ;-;
# cam't do inheritance or structs owning structs in goboscript, so it will use the exact same struct
# it's not very good to pollute the global name space like this :\
# i put an underscore but its still not very good


%define RESET_CAM_BASIS() \
    Node _cam_i_hat = Node{x: 1, y: 0}; \
    Node _cam_j_hat = Node{x: 0, y: 1};

# 'infer' basis - just set basis using existing cam d/s vars
%define INFER_CAM_BASIS() set_cam_basis _camera.s, sin(_camera.d), cos(_camera.d)

proc set_cam_basis zoom, _sin, _cos {
    _cam_i_hat = Node{
        x: $_cos * $zoom,
        y: -$_sin * $zoom
    };
    _cam_j_hat = Node{
        x: $_sin * $zoom,
        y: $_cos * $zoom
    };
}

proc add_cam_basis zoom, _sin, _cos, Node i, Node j {
    # set camera basis vectors, by applying to exisiting basis vectors, allowing for skew
    _cam_i_hat = Node{
        x: ($_cos * $i.x + $_sin * $i.y) * $zoom,
        y: ($_cos * $i.y - $_sin * $i.x) * $zoom
    };
    _cam_j_hat = Node{
        x: ($_cos * $j.x + $_sin * $j.y) * $zoom,
        y: ($_cos * $j.y - $_sin * $j.x) * $zoom
    };
}



%define CAM_APPLY_NODE(p) Node { \
        x: ((p.y - _camera.y) * _cam_j_hat.x + (p.x - _camera.x) * _cam_i_hat.x), \
        y: ((p.y - _camera.y) * _cam_j_hat.y + (p.x - _camera.x) * _cam_i_hat.y) \
    }

%define CAM_APPLY_VEC(p)  Node { \
        x: (p.y * _cam_j_hat.x + p.x * _cam_i_hat.x), \
        y: (p.y * _cam_j_hat.y + p.x * _cam_i_hat.y) \
    }

func cam_apply_vec(Node p) {
    return CAM_APPLY_VEC($p);
}

func cam_apply_node(Node p) Node {
    return CAM_APPLY_NODE($p);
}

func cam_apply_pos(pos p) pos {
    Node p = cam_apply_node(Node{x: $p.x, y: $p.y});
    return pos{
        x: p.x, y: p.y,
        s: $p.s * _camera.s,
        d: $p.d + _camera.d
    };
}

func cam_inverse(Node p) Node {
    local y = _camera.y + ($p.x * _cam_i_hat.y - $p.y * _cam_i_hat.x) / (_cam_j_hat.x * _cam_i_hat.y - _cam_i_hat.x * _cam_j_hat.y);
    return Node{
        x: _camera.x + ($p.x - _cam_j_hat.x * (y - _camera.y)) / _cam_i_hat.x, y: y
    };
}

func cam_inverse_pos(pos p) pos {
    Node inv = cam_inverse(Node{x: $p.x, y: $p.y});
    return pos {
        x: inv.x,
        y: inv.y,
        s: $p.s / _camera.s,
        d: $p.d - _camera.d
    };
}

%define CAM_INV_MOUSE() cam_inverse(node_mouse())

proc move_camera dx, dy, ds, dd, Node d_mouse, prev_mouse_down, dynamic_zoom {
    # dynamic zoom is whether to increase the zoom more/less depending on the current zoom
    local dx = $dx - $d_mouse.x / (_camera.s * _camera.s) * $prev_mouse_down;
    local dy = $dy - $d_mouse.y / (_camera.s * _camera.s) * $prev_mouse_down;

    _camera.x += dx * _cam_i_hat.x + dy * _cam_i_hat.y;
    _camera.y += dx * _cam_j_hat.x + dy * _cam_j_hat.y;

    _camera.d += $dd;

    # zoom out from mouse pointer
    local Node mnode = CAM_INV_MOUSE();
    
    
    if $dynamic_zoom {
        local ds = $ds * _camera.s;
    } else {
        local ds = $ds;
    }

    if ds > 1 {
        # Don't overshoot
        _camera.x = mnode.x;
        _camera.y = mnode.y;

    } else {
        local Node diff = Node{x: mnode.x - _camera.x, y: mnode.y - _camera.y};

        _camera.x += diff.x * ds;
        _camera.y += diff.y * ds;
    }

    _camera.s += ds;
}

proc cam_goto_node Node p {
    node_goto CAM_APPLY_NODE($p);
}

proc cam_goto_pos Node p {
    goto_pos cam_apply_pos($p);
}

proc cam_change_xy Node dn {
    Node dn = CAM_APPLY_VEC($dn);
    change_xy dn.x, dn.y;
}

################################################################

onflag{
    pos _camera = pos{
        x: 0,
        y: 0,
        s: 1,
        d: 0
    };
    RESET_CAM_BASIS();
}