# detect events like stop button etc

# Macro to be used with timer > boolean to create a when <bool> hat
%define TBOOL(b) 0.0000000000001 / b # yeah, silly code ik, but it works (in scratch)

# This **SHOULD** work, but goboscript doesn't seem to have proper support for the other hat blocks.
ontimer > TBOOL(days_since_2000() - _projectenv_pdays_since_2000 > 0.0000015) {
    # This code is not very exact. It actually just detects for a certain amount of 'lag spike' via the days since 2000 reporter.
    # Perhaps this should be changed to be relative to (recent average) FPS
    pause_count++;
    broadcast "project_unpaused";
}

ontimer > _projectenv_pt + 1.0 / 30.0 {
    stop_count++;
    broadcast "project_stopped";
}
