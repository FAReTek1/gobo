# pos struct and methods

%include ..\geo2d

struct pos {
    x = 0, # x pos
    y = 0, # y pos
    s = 100, # size
    d = 90 # direction
}
%define pos(_x,_y,_s,_d) (pos{x:_x, y:_y, s:_s, d:_d})

%define POS_CIRC(c) pos(c.x, c.y, c.r, 90)
%define POS_V2(v) pos(v.x, v.y, 100, 90)
%define CIRC_POS(p) Circle(p.x, p.y, p.s)
%define POS_POS() pos(x_position(), y_position(), size(), direction())
%define POS_MOUSE() pos(mouse_x(), mouse_y(), 100, 90)
