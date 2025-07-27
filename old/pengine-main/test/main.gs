%include backpack/pengine/pengine.gs

costumes "blank.svg", "sttf*.svg";

onflag {
    setup;
    forever{tick;}
}

func circle_from_pos(pos p) Circle {
    return Circle{x: $p.x, y: $p.y, r: $p.s};
}

func node_from_pos(pos p) Node {
    return Node{x: $p.x, y: $p.y};
}

proc setup{
    hide;
}

proc tick{
    erase_all;
    RESET_POS;

    set_ps_color_HSVA cHSVA{h: 50, s: 100, v: 100, a: 100};
    fill_capped_line Line{x1: mouse_x(), y1: mouse_y(), x2: -50, y2: 100}, 50, 0;

    set_pen_size 1;
    set_ps_color_HSVA cHSVA{h: 0, s: 100, v: 100, a: 50};
    draw_capped_line Line{x1: mouse_x(), y1: mouse_y(), x2: -50, y2: 100}, 50;
}
