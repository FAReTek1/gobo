%define PEN_DU pen_down; pen_up


# -- small utilities --
proc fill_outline th, res {
    local angle = direction(); 
    # this way, when the sprite rotates, the outline's circle of stamps rotates as well, 
    # making it look more natural
    repeat $res {
        stamp_offset Node{x: $th * sin(angle), y: $th * cos(angle)};
        angle += 360 / $res;
    }
}

proc stamp_offset Node dn, {
    change_xy $dn.x, $dn.y;
    cstamp;
    change_xy -$dn.x, -$dn.y;
}
