# !> pref=
# !> author=faretek
# !> credits=
# !> desc=small xml/html parser/lexer
# !> date=2025-07-23 - 2025-07-24

# doesn't really do error checking
# this module heavily pollutes the global namespace
# i wish namespaces existed

%include ..\assert

# enum ElementType {
#     normal,
#     comment,
#     special
# }

struct Element {
    name = "",
    attrs = "",
    content = "",
    level = 0
}

list Element elements;

nowarp proc parse_tag_name {
    i++;
    char = xml[i];
    until char in " >" {
        i++;
        token &= char;
        char = xml[i];
    }
}
nowarp proc parse_string {
    local escaped = true;
    until char == "\"" and not escaped {
        if char == "\\" and not escaped {
            escaped = true;
        } else {
            escaped = false;
        }
        token &= char;
        i++;
        char = xml[i];
    }
}

nowarp proc parse_elem_args {
    until char == ">" {
        if char == "\"" {
            parse_string;
        }
        i++;
        token &= char;
        char = xml[i];
    }
}

nowarp proc parse_elem_content level {
    char = xml[i];
    if char == "<" {
        if token > "" {
            if length elements == 0 {
                add Element{level: $level, content: token} to elements;
            } else {
                elements["last"].content = token;
            }
        }
        token = "";
        
        parse_tag_name;
        tag_name = token;
        is_closing_tag = tag_name[1] == "/";

        token = "";
        if char == " " {
            parse_elem_args;
            elem_args = token;
            token = "";
        } else {
            elem_args = "";
        }
        assert_eq char, ">", "char != >, but instead " & char;
        i++;

        is_self_closing = elem_args[length elem_args] == "/" or tag_name == "!--";
        add Element{
            name: tag_name,
            attrs: elem_args,
            level: $level
        } to elements;

        if not is_closing_tag and not is_self_closing {
            # if it isn't self-closing, we need to find the close tag. the stuff between the start tag and the close tag is the tag content
            parse_elem_content $level + 1;
        }
        if is_closing_tag {
            parse_elem_content $level - 1;
        } else {
            parse_elem_content $level;
        }
        token = char;
    } else {
        until char in "<"{
            token &= char;
            i++;
            char = xml[i];
        }
        if char == "<" {
            parse_elem_content $level;
        } elif token > "" {
            elements["last"].content = token;
        }
    }
}

proc parse_xml xml {
    delete elements;
    xml = $xml;
    i = 1;
    level = 0;
    token = "";
    until i > length xml{
        parse_elem_content 1;
    }
}
