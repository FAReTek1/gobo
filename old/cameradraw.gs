################################################################
# general pen things

%define CSET_PEN_SIZE(arg_size) set_pen_size(arg_size * _camera.s)
%define cset_pen_size CSET_PEN_SIZE

################################################################
# arc

proc cfill_arc pos pos, ext, hole {
    fill_arc cam_apply_pos($pos), $ext, $hole;
}

proc cdraw_arc_edge pos pos, ext, res {
    draw_arc_edge cam_apply_pos($pos), $ext, $res;
}

proc cfill_arc_starting_at pos p, ext, hole, center_rot, overall_size {
    fill_arc_starting_at cam_apply_pos($p), $ext, $hole, $center_rot, $overall_size;
}

################################################################
# aw
proc cfill_aw pos pos, hole {
     fill_aw cam_apply_pos($pos), $hole;
}
proc cdraw_aw pos pos, hole {
     draw_aw cam_apply_pos($pos), $hole;
}
################################################################
# basic
# TODO: maybe add an option to change the starting angle of the outline? (refer the inner pengine function)
proc cfill_outline res, th {
    fill_outline $res, $th * _camera.s;
}

# this one is good because it moves back to the original position
proc cstamp_shadow Node dn, ghost {
    # not even a binding to the lower level procedure

    Node dn = CAM_APPLY_VEC($dn);
    change_xy dn.x, dn.y;
    set_ghost_effect $ghost;
    stamp;
    change_xy -dn.x, -dn.y;
}

################################################################
# capped line

################################################################
################################################################
################################################################
################################################################
################################################################