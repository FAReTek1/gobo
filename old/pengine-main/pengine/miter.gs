
# Miter fillers by @faretek1 on scratch
proc fill_miter Line l1, Line l2, th {
    # Assume l2.x1, l2.y2 to be equal to l1.x2, l1.y2
    local dst1 = line_length($l1);
    local v1x = (line_dx($l1) / dst1) * (($th - 1) / 2);
    local v1y = (line_dy($l1) / dst1) * (($th - 1) / 2);

    local dst2 = line_length($l2);
    local v2x = (line_dx2($l2) / dst2) * (($th - 1) / 2);
    local v2y = (line_dy2($l2) / dst2) * (($th - 1) / 2);

    local cmp1 = (v1x * v2y) + abs(v1y * v2x);
    local cmp2 = (v1y * v2x) - abs(v1x * v2y);

    if cmp1 <= 0 or cmp2 >= 0 {
        local cmp3 = v1x * v2y - v1y * v2x;
        if cmp3 == 0 {
            fill_miter Line{
                x1: $l1.x1, 
                y1: $l1.y1,
                x2: $l1.x2,
                y2: $l1.y2 + 0.5
            }, Line{
                x1: $l2.x1, 
                y1: $l2.y1 + 0.5,
                x2: $l2.x2,
                y2: $l2.y2 + 0.5
            }, $th; 
        }

        local Pt2D ints = intersect_l2d(
            Line{
                x1: ($l1.x1 + v1y),
                y1: ($l1.y1 - v1x),
                x2: ($l1.x1 + v1y) + v1x,
                y2: ($l1.y1 - v1x) + v1y
            },
            Line{
                x1: ($l2.x2 - v2y),
                y1: ($l2.y2 + v2x),
                x2: ($l2.x2 - v2y) + v2x,
                y2: ($l2.y2 + v2x) + v2y
            }
        );
            
        fill_tri
            ints.x, ints.y,
            $l1.x2 + v1y, $l1.y2 - v1x,
            $l1.x2 - v2y, $l1.y2 + v2x;

    } else {
        fill_miter Line{
                x1: $l2.x2, 
                y1: $l2.y2,
                x2: $l2.x1,
                y2: $l2.y1
            }, Line{
                x1: $l1.x2, 
                y1: $l1.y2,
                x2: $l1.x1,
                y2: $l1.y1
            }, $th; 
    }
}
# Fill miter using arc instead of tri
# Probably not very efficient math
proc fill_miter_arc Line l1, Line l2, th {
    # Assume l2.x1, l2.y2 to be equal to l1.x2, l1.y2
    local dst1 = line_length($l1);
    local v1x = (line_dx($l1) / dst1) * ($th / 2);
    local v1y = (line_dy($l1) / dst1) * ($th / 2);

    local dst2 = line_length($l2);
    local v2x = (line_dx2($l2) / dst2) * ($th / 2);
    local v2y = (line_dy2($l2) / dst2) * ($th / 2);

    local cmp1 = (v1x * v2y) + abs(v1y * v2x);
    local cmp2 = (v1y * v2x) - abs(v1x * v2y);

    if cmp1 <= 0 or cmp2 >= 0 {
        local cmp3 = v1x * v2y - v1y * v2x;
        if cmp3 == 0 {
            fill_miter_arc Line{
                x1: $l1.x1, 
                y1: $l1.y1,
                x2: $l1.x2,
                y2: $l1.y2 + 0.5
            }, Line{
                x1: $l2.x1, 
                y1: $l2.y1 + 0.5,
                x2: $l2.x2,
                y2: $l2.y2 + 0.5
            }, $th; 
        } else {
            local Pt2D ints = intersect_l2d(
                Line{
                    x1: ($l1.x1 + v1y),
                    y1: ($l1.y1 - v1x),
                    x2: ($l1.x1 + v1y) + v1x,
                    y2: ($l1.y1 - v1x) + v1y
                },
                Line{
                    x1: ($l2.x2 - v2y),
                    y1: ($l2.y2 + v2x),
                    x2: ($l2.x2 - v2y) + v2x,
                    y2: ($l2.y2 + v2x) + v2y
                }
            );

            local dr1 = DIR($l1.x2 + v1y, $l1.y2 - v1x, ints.x, ints.y);
            local dr2 = DIR($l1.x2 - v2y, $l1.y2 + v2x, ints.x, ints.y);

            local cmp4 = ((dr2 % 360) - (dr1 % 360)) % 360;
            if cmp4 % 180 < 2 {
                fill_tri
                    ints.x, ints.y,
                    $l1.x2 + v1y, $l1.y2 - v1x,
                    $l1.x2 - v2y, $l1.y2 + v2x;

            } else {
                if cmp4 >= 1 {
                    fill_arc pos_from_pt2d(
                        ints, 
                        2 * DIST(ints.x, ints.y, $l1.x2 + v1y, $l1.y2 - v1x),
                        dr1 % 360), 
                        cmp4, 0;
                }
            }
        }
    } else {
        fill_miter_arc Line{
                x1: $l2.x2, 
                y1: $l2.y2,
                x2: $l2.x1,
                y2: $l2.y1
            }, Line{
                x1: $l1.x2, 
                y1: $l1.y2,
                x2: $l1.x1,
                y2: $l1.y1
            }, $th; 
    }
}
