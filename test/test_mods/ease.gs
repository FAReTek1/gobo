costumes "Dango Cat.svg";

# %define EASING_TIMER days_since_2000() * 86400 - start

%include ..\ease

onflag {
    switch_costume "Dango Cat";
    # start = days_since_2000() * 86400;
    bc = get_back_bounce_constant(100);
    forever {
        goto ease_inout_bounce(0, 100), 0;
    }
}
