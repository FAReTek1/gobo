proc draw_line Line l {
    # We only check x1
    if $l.x1 != "NaN"{
        goto $l.x1, $l.y1;
        pen_down;
        goto $l.x2, $l.y2;
        pen_up;
    }
}
