costumes "backpack/pengine/pengine/arc/*.svg";

proc fill_arc pos pos, ext, hole {
    # you may need to mod $ext by 360
    if $ext > 0.703125 and $hole < 0.9999999 {
        goto_pos $pos;

        local i = floor(ln($ext / 360) / 0.6931471805599453);
        switch_costume "shapefill arc " & $hole > 0.01 & i;

        if $hole > 0.01 {
            set_fisheye_effect -69.314718056 / ln($hole) - 100;
        }
        cstamp;
        i = 360 * antiln(0.6931471805599453 * i);
        if abs(i - $ext) > 0.0000000000001 {
            turn_right $ext - i;
            cstamp;
        }
        set_fisheye_effect 0;
    }
}

proc draw_arc pos p, ext, hole, res {
    if abs($ext) < 360 {
        local angle = $p.d;

        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
        pen_down;

        repeat $res {
            angle += $ext / $res;
            goto $p.x + $p.s * sin(angle),
                 $p.y + $p.s * cos(angle);
        }

        goto $p.x + $p.s * sin(angle) * $hole,
             $p.y + $p.s * cos(angle) * $hole;

        repeat $res {
            angle -= $ext / $res;
            goto $p.x + $p.s * sin(angle) * $hole,
                 $p.y + $p.s * cos(angle) * $hole;
        }

        goto $p.x + $p.s * sin($p.d),
             $p.y + $p.s * cos($p.d);
            
        pen_up;

    } else {
        # draw 2 circles
        local angle = $p.d;
        
        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
        pen_down;

        repeat $res {
            angle += 360 / $res;
            goto $p.x + $p.s * sin(angle),
                 $p.y + $p.s * cos(angle);
        }

        pen_up;

        goto $p.x + $p.s * sin(angle) * $hole,
             $p.y + $p.s * cos(angle) * $hole;
        pen_down;

        repeat $res {
            angle -= 360 / $res;
            goto $p.x + $p.s * sin(angle) * $hole,
                 $p.y + $p.s * cos(angle) * $hole;
        }
        pen_up;
    }
}

proc draw_arc_edge pos p, ext, res {
    goto $p.x + $p.s * sin($p.d), 
         $p.y + $p.s * cos($p.d);
    pen_down;

    local angle = $p.d;

    repeat $res {
        angle += $ext / $res;
        goto $p.x + $p.s * sin(angle),
             $p.y + $p.s * cos(angle);
    }

    pen_up;
}

proc fill_arc_starting_at pos p, ext, hole, center_rot, overall_size {
    fill_arc pos{
        x: $p.x - $p.s * sin($p.d),
        y: $p.y - $p.s * cos($p.d),
        s: $p.s * $overall_size * 2,
        d: $p.d + $center_rot - $ext
    }, $ext, $hole;
}
proc fill_arc_ending_at pos p, ext, hole, center_rot, overall_size {
    fill_arc pos{
        x: $p.x - $p.s * sin($p.d),
        y: $p.y - $p.s * cos($p.d),
        s: $p.s * $overall_size * 2,
        d: $p.d + $center_rot
    }, $ext, $hole;
}

# Add cle to seperate package