# Control of sound stuff. Should probably be extended

################################################################
# Pitch effect utils

func speed_to_pitch(speed) {
    # This could be changed to a macro
    return ln($speed) / 0.0057762265046662105; # ln(2) / 120
}

func pitch_to_speed(pitch) {
    return antiln($pitch * 0.0057762265046662105); # ln(2) / 120
}

proc set_pitch_effect_to_speed speed {
    set_pitch_effect speed_to_pitch($speed);
}

nowarp proc get_sound_length sound, inaccuracy {
    # Return by setting the "sound_length" variable
    # Uses the timer() value - pls don't reset the timer!
    set_pitch_effect_to_speed $inaccuracy;
    local start = timer();
    play_sound_until_done $sound;
    sound_length = (timer() - start) * $speed;
}
