%define DRAW_NODE_LIST(lst)             \
    local i = 1;                        \
    repeat length lst{                  \
        goto lst[i].x, lst[i].y;        \
        pen_down;                       \
        i++;                            \
    }                                   \
    goto lst[1].x, lst[1].y;            \
    pen_up;                             \

%define FILL_NODE_LIST(lst)             \
    local i = 1;                        \
    local j = length lst;               \
    repeat length lst{                  \
        fill_tri lst[i].x, lst[i].y,    \
                 lst[j].x, lst[j].y,    \
                 lst[0].x, lst[0].y;    \
                                        \
        j = i;                          \
        i++;                            \
    }                                   \
