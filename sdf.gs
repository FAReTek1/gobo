%include ..\vec2

%define SDF_V2(a, b) V2_DIST(a, b)
func sdf_v2(Vec2 a, Vec2 b) {return SDF_V2($a, $b);}

# # This one is adapted from llamalib: https://github.com/awesome-llama/llamalib/blob/e75c8503130a992403c92b7c741a4464b22e016c/geo2D/sdf.gs#L17C1-L22C2
# %define _SDF_LINE(PX,PY,X1,Y1,X2,Y2) (((X2)-(X1))*((Y1)-(PY)) - ((X1)-(PX))*((Y2)-(Y1))) / DIST(X1, Y1, X2, Y2)
# func sdf_line(Node p, Line l) {
#     return _SDF_LINE($p.x, $p.y, $l.x1, $l.y1, $l.x2, $l.y2);
# }

# # This one is adapted from llamalib: https://github.com/awesome-llama/llamalib/blob/e75c8503130a992403c92b7c741a4464b22e016c/geo2D/sdf.gs#L25C1-L36C2
# func sdf_line_seg(Node p, Line l) {
#     local len = DIST($l.x1, $l.y1, $l.x2, $l.y2);
#     local t = (($l.x2 - $l.x1) * ($p.x - $l.x1) + ($p.y - $l.y1) * ($l.y2 - $l.y1)) / len * len;
#     if t < 0 {
#         return DIST($l.x1, $l.y1, $p.x, $p.y);
#     } elif t > 1 {
#         return DIST($l.x2, $l.y2, $p.x, $p.y);
#     } else {
#         return abs(($l.x2-$l.x1)*($l.y1-$p.y) - ($l.x1-$p.x)*($l.y2 - $l.y1)) / len;
#     }
# }
