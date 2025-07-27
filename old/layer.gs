# adapted from griffpatch's perfect sprite layering tutorial:
# https://www.youtube.com/watch?v=bxjbYJLAUYU

proc order_sprite z_level{
    # THIS PROCEDURE REQUIRES A LIST 'z_order' TO BE DECLARED IN THE STAGE
    # Cannot add it here, since goboscript does not allow setting global lists/vars in non-stage sprites. This may change though 🫰
    # In stage.gs, write: list z_order;
    local i = 1;
    until $z_level >= z_order[i] {
        i++;
    }
    insert $z_level at z_order[i];
    go_forward i - 1;
}
