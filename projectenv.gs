# !> globals=stop_count, pause_count, tick_number, run_number
# !> macro_opts=DISABLE_PROJECTENV_AUTO_LOOP, DISABLE_PROJECTENV_LOOP_ON_STOP
# detect events like stop button etc

# for copy pasting:
# %define DISABLE_PROJECTENV_AUTO_LOOP
# %define DISABLE_PROJECTENV_LOOP_ON_STOP

# %include ..\sugar

%define PROJECTENV_LOOP forever{projectenv_fps_tick;}

var run_number = 0;

onbool(days_since_2000() - _projectenv_pdays_since_2000 > 0.0000015) {
    # This code is not very exact. It actually just detects for a certain amount of 'lag spike' via the days since 2000 reporter.
    # Perhaps this should be changed to be relative to (recent average) FPS
    pause_count++;
    broadcast "project_unpaused";
}

ontimer > _projectenv_pt + 1.0 / 30.0 {
    stop_count++;
    broadcast "project_stopped";
%if not DISABLE_PROJECTENV_LOOP_ON_STOP
    PROJECTENV_LOOP;
%endif
}

onflag {
    run_number++;

    stop_count = 0;
    pause_count = 0;

    tick_number = 0;
    _projectenv_ticked_yet = false;
    _projectenv_pt = 0; # previous time
    _projectenv_pdays_since_2000 = days_since_2000();

%if not DISABLE_PROJECTENV_AUTO_LOOP
    PROJECTENV_LOOP;
%endif
%if DISABLE_PROJECTENV_AUTO_LOOP
    until _projectenv_ticked_yet {
        if timer () > 5 {
            warn "Projectenv has not been ticked yet. Please add a loop like `PROJECTENV_LOOP`.";
            warn "To disable this message, do not include projectenv. It will only work when it is being ticked.";
            # you can actually disable it by constantly resetting the timer, but it does not remove the problem.
        }
    }
%endif
}

proc projectenv_fps_tick {
    _projectenv_ticked_yet = true;
    tick_number++;

    # delta2000 = days_since_2000() - _projectenv_pdays_since_2000;
    _projectenv_pdays_since_2000 = days_since_2000();

    delta = timer() - _projectenv_pt;
    _projectenv_pt = timer();

    fps = 1 / delta;
    fpsmul = 30 * delta;
}
