# !> pref=
# !> author=faretek
# !> credits=Timmccool for costumes
# !> desc=
# !> date=
# !> globals=

%include ..\assert

costumes "../assets/buttonassets/add to studio.svg"         as "button_detector.gs//add to studio";
costumes "../assets/buttonassets/cancel comment.svg"        as "button_detector.gs//cancel comment";
costumes "../assets/buttonassets/copy link.svg"             as "button_detector.gs//copy link";
costumes "../assets/buttonassets/fave.svg"                  as "button_detector.gs//fave";
costumes "../assets/buttonassets/fullscreen.svg"            as "button_detector.gs//fullscreen";
costumes "../assets/buttonassets/green flag.svg"            as "button_detector.gs//green flag";
costumes "../assets/buttonassets/love.svg"                  as "button_detector.gs//love";
costumes "../assets/buttonassets/pfp.svg"                   as "button_detector.gs//pfp";
costumes "../assets/buttonassets/post comment.svg"          as "button_detector.gs//post comment";
costumes "../assets/buttonassets/remix.svg"                 as "button_detector.gs//remix";
costumes "../assets/buttonassets/see data.svg"              as "button_detector.gs//see data"; 
costumes "../assets/buttonassets/see inside.svg"            as "button_detector.gs//see inside";
costumes "../assets/buttonassets/stop button.svg"           as "button_detector.gs//stop button";

enum ScratchButtons {
    add_to_studio=  "add to studio",
    cancel_comment= "cancel comment",
    copy_link=      "copy link",
    fave=           "fave",
    fullscreen=     "fullscreen",
    green_flag=     "green flag",
    love=           "love",
    pfp=            "pfp",
    post_comment=   "post comment",
    remix=          "remix",
    see_data=       "see data",
    see_inside=     "see inside",
    stop_button=    "stop button",
    none
}

%define DETECT_BUTTON(name)                                                     \
    switch_costume "button_detector.gs//" & ScratchButtons.name;                \
    if touching("_mouse_") {                                                    \
        switch_costume og_cos;                                                  \
        return ScratchButtons.name;                                             \
    }

func button_detector() {
    assert_eq x_position(), 0, "x_position(): ";
    assert_eq y_position(), 0, "y_position(): ";
    assert_eq size(), 100, "size(): ";
    assert_eq direction(), 90, "direction(): ";

    local og_cos = costume_number();
    DETECT_BUTTON(add_to_studio);
    DETECT_BUTTON(cancel_comment);
    DETECT_BUTTON(copy_link);
    DETECT_BUTTON(fave);
    DETECT_BUTTON(fullscreen);
    DETECT_BUTTON(green_flag);
    DETECT_BUTTON(love);
    DETECT_BUTTON(pfp);
    DETECT_BUTTON(post_comment);
    DETECT_BUTTON(remix);
    DETECT_BUTTON(see_data);
    DETECT_BUTTON(see_inside);
    DETECT_BUTTON(stop_button);

    switch_costume og_cos;
    return ScratchButtons.none;
}
