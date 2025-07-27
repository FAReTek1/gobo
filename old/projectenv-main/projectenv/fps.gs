onflag{
    stop_count = 0;
    pause_count = 0;

    tick_number = 0;
    _projectenv_pt = 0; # previous time
    _projectenv_pdays_since_2000 = days_since_2000();
}

proc projectenv_fps_tick {
    tick_number ++;

    # delta2000 = days_since_2000() - _projectenv_pdays_since_2000;
    _projectenv_pdays_since_2000 = days_since_2000();

    delta = timer() - _projectenv_pt;
    _projectenv_pt = timer();

    fps = 1 / delta;
    fpsmul = 30 * delta;
}