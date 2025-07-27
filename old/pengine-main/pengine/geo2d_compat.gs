# draw structs from geo2d, which don't have their own file (e.g. unlike circle.gs)

proc draw_ptx2 PtX2 pts {
    if $pts.x1 == ("" + $pts.x1) {
        goto $pts.x1, $pts.y1;
        pen_down; pen_up;
    }
    if $pts.x2 == ("" + $pts.x2){
        goto $pts.x2, $pts.y2;
        pen_down; pen_up;
    }
}


proc draw_box Box b {
    goto $b.xmin, $b.ymin; pen_down;

    goto $b.xmin, $b.ymax;
    goto $b.xmax, $b.ymax;
    goto $b.xmax, $b.ymin;

    goto $b.xmin, $b.ymin; pen_up;
}
