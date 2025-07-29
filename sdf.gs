# %include ..\vec2

%define SDF_V2(a, b) V2_DIST(a, b)
func sdf_v2(Vec2 a, Vec2 b) {return SDF_V2($a, $b);}

# # This one is adapted from llamalib: https://github.com/awesome-llama/llamalib/blob/e75c8503130a992403c92b7c741a4464b22e016c/geo2D/sdf.gs#L17C1-L22C2
%define SDF_LINE2(l, p) (((l.x2)-(l.x1))*((l.y1)-(p.y)) - ((l.x1)-(p.x))*((l.y2)-(l.y1))) / DIST(l.x1, l.y1, l.x2, l.y2)
func sdf_line2(Vec2 p, Line2 l) {
    return SDF_LINE2($l, $p);
}

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
