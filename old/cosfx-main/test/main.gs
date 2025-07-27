%include backpack/cosfx/cosfx

costumes "blank.svg";
costumes "backpack/cosfx/assets/f3d/*.svg";

onflag {
    hide;
    cache_costume_dims;
    forever{tick;}
}

proc tick {
    erase_all;

    RESET_POS;
    set_brightness_effect -100;
    f3d_prism my_pos(), "Cat", -3 * mouse_x(), "", 15, 10;
    
    clear_graphic_effects;
    RESET_POS;
    if f3d_prism_face("Cat", -3 * mouse_x(), "") {
        stamp;
    }
}   
