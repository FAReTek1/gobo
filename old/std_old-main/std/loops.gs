# Macros that define loops for you, which make it easier to code stuff
# The substack (code block) on the inside of the loop will always be the final argument.

################################################################

# For loop for goboscript.
# Has to be used inside a proc or func, as it uses a local variable.
%define FOR(substack_start,cond,substack_rep,substack_inr)  \
    substack_start;                                         \
    local _std_loops_for_macro_loop_cond = cond;            \ # These ridiculous names are to avoid name conflicts. (Macro local vars would be so nice. there are a lot of other things that would be nice. For now we have to make do. Goboscript is already really good)
    until not(_std_loops_for_macro_loop_cond) {             \
        substack_inr;                                       \ # Strange bug gets rid of seconds parameter in say block (not really sure how that happens) - but wrapping in a repeat seems to do the trick. That's your job though. Hopefully this gets fixed. Idk what causes it though...
        substack_rep;                                       \ # You should note that when using this :\\
        _std_loops_for_macro_loop_cond = cond;              \ # Goboscript doesn't handle until + functions returing properly (highly doubt this is intended)
    }

# Example usage:
# FOR(local i = 0, i <= 10, i++,
#     say i;
#     wait 0.4; # As said above, say for secs block doesn't work here unless it is in a repeat or something.
# )

################################################################

# Loop through a list or string
# The warnings for the FOR macro probably apply here as well
%define FOREACH(var,lst,substack)                       \
    local _std_loops_foreach_macro_loop_i = 1;          \
    repeat length lst {                                 \
        var = lst[_std_loops_foreach_macro_loop_i];     \
        substack;                                       \
        _std_loops_foreach_macro_loop_i++;              \
    }

# Example usage:
# # list rand = python```
# import random
# for _ in range(10):
#     print(random.randint(1, 10))
# ```;
#
# FOREACH(local rnd, rand, 
#     add rnd to rand;
# )

################################################################
