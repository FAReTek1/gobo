%include backpack/projectenv/projectenv


costumes "blank.svg";

onflag {
    say "Hello, World!";

    forever{
        projectenv_fps_tick;
    }
}
