# The JSON library is only designed to parse 1 JSON string at a time. Hence the use of many globabl vars.
# The variables may also cause naming conflicts. 
# This would be solved by namespaces.
# There will NOT be rigorous JSON validation (but they may be some), and it may be added in the future

%include ..\string
%include ..\math
%include ..\char

# decoder

list keys;
list values;
list arr;


struct JSONValue {
    type = "string", # Using same type names as json.org for consistency
    value = ""
}

enum JSONType {
    string = "string",
    number = "number",
    array = "array",
    object = "object",
    bool_true = "true",
    bool_false = "false",
    null = "null"
}

func decode(json) JSONValue {
    return decode_value(1, $json);
}

func decode_value(i, json) JSONValue {
    local type = eval_type($json);

    json_decode_index = $i; # NOT local

    if type == JSONType.string {
        local value = decode_string($json);
    } elif type == JSONType.number {
        local value = decode_number($json);
    } elif type == JSONType.array {
        local value = "<See arr list>";
        decode_array $json;
    } elif type == JSONType.object {
        local value = "<See key list and values list>";
        decode_object $json;
    } elif type == JSONType.bool_true {
        local value = true;
        json_decode_index += 4;
    } elif type == JSONType.bool_false {
        local value = false;
        json_decode_index += 5;
    } elif type == JSONType.null {
        local value = "null";
        json_decode_index += 4;
    }

    return JSONValue{
        type: type,
        value: value
    };
}

func eval_type(json) {
    # For now, assume that JSON is valid
    if startswith($json, "true") {
        return JSONType.bool_true;
    } elif startswith($json, "false") {
        return JSONType.bool_false;
    } elif startswith($json, "null") {
        return JSONType.null;
    } elif $json[1] == "\"" {
        return JSONType.string;
    } elif $json[1] == "[" {
        return JSONType.array;
    } elif $json[1] == "{" {
        return JSONType.object;
    } else {
        return JSONType.number;
    }
}

func decode_string(json) {
    # https://www.json.org/json-en.html#:~:text=A%20string%20is%20a%20sequence%20of%20zero%20or%20more%20Unicode%20characters%2C%20wrapped%20in%20double%20quotes%2C%20using%20backslash%20escapes.%20A%20character%20is%20represented%20as%20a%20single%20character%20string.%20A%20string%20is%20very%20much%20like%20a%20C%20or%20Java%20string.
    
    json_decode_index++; # skip first char
    local ret = "";

    until $json[json_decode_index] == "\"" {
        if $json[json_decode_index] == "\\" {
            # escaped chars
            local next = $json[json_decode_index + 1];
            if next == "\""{
                ret &= "\"";
                json_decode_index += 2;

            } elif next == "\\" {
                ret &= "\\";
                json_decode_index += 2;
            
            } elif next == "/" {
                ret &= "/";
                json_decode_index += 2;

            } elif next == "b" {
                # not exactly sure how to implement
                ret = slice(ret, 1, length ret - 1);
                json_decode_index += 2;

            # These ones can't really be done in scratch :\
            # You would have to output the string as an array of tokens, which is kinda dumb
            } elif next == "f" {
                ret &= "";
                json_decode_index += 2;

            } elif next == "n" {
                ret &= "\n";
                json_decode_index += 2;
            
            } elif next == "r" {
                ret &= "\r";
                json_decode_index += 2;
            
            } elif next == "t" {
                ret &= "\t";
                json_decode_index += 2;
            
            } elif next == "u" {
                local hex = slice($json, json_decode_index + 2, json_decode_index + 5);
                # Convert hex to decimal
                hex = HEX(hex);

                ret &= unicode[hex];

                json_decode_index += 2 + 4;

            } else {
                # To avoid warp error, return sth
                error "Invalid escape char @idx" & json_decode_index;
                breakpoint;
                stop_this_script;
            }

        } else {
            ret &= $json[json_decode_index];
            json_decode_index++;
        }
    }

    return ret;
}

func decode_number(json) {
    local ret = "";
    if $json[json_decode_index] == "-" {
        ret &= "-";
        json_decode_index++;
    }

    if $json[json_decode_index] == "0" {
        ret &= "0";
        json_decode_index++;

    } elif $json[json_decode_index] in "123456789" {
        until $json[json_decode_index] not in "0123456789" or json_decode_index > length $json {
            ret &= $json[json_decode_index];
            json_decode_index++;
        }
    } else {
        return "NaN";
    }

    # fraction
    if $json[json_decode_index] == "." {
        ret &= ".";
        json_decode_index++;

        until $json[json_decode_index] not in "0123456789" or json_decode_index > length $json {
            ret &= $json[json_decode_index];
            json_decode_index++;
        }
    }

    # exponent
    if $json[json_decode_index] == "e" {
        # ^^ Scratch is not case sensitive; this also detects "E"
        ret &= $json[json_decode_index];
        json_decode_index++;

        if $json[json_decode_index] == "-" {
            ret &= "-";
            json_decode_index++;

        } elif $json[json_decode_index] == "+" {
            ret &= "+";
            json_decode_index++;
        
        } elif $json[json_decode_index] not in "0123456789" {
            return "NaN"; # If there is no + or -, there must be a digit next.
        }
        # We can assume there will be a digit now, due to the check above ^^
        ret &= $json[json_decode_index];
        json_decode_index++;
        
        until $json[json_decode_index] not in "0123456789" or json_decode_index > length $json {
            ret &= $json[json_decode_index];
            json_decode_index++;
        }
    }

    return ret;
}

proc decode_array json {
    delete arr;
    json_decode_index++;

    local ret = "";
    local level = 1;
    local last_level1_arr = 0;
    local latest_bracket = "[";

    until json_decode_index > length $json or level == 0 {
        skip_whitespace $json;
        local prev_i = json_decode_index;
        
        if $json[json_decode_index] in "{[" {
            latest_bracket = $json[json_decode_index] & latest_bracket;
            if level == 1 {
                last_level1_arr = json_decode_index;
            }
            level++;
            json_decode_index++;

        } elif $json[json_decode_index] in "}]" {
            latest_bracket = slice(latest_bracket, 2, length latest_bracket);
            level--;
            if level == 1 {
                add slice($json, last_level1_arr, json_decode_index) to arr;
                last_level1_arr = 0;
            }
            json_decode_index++;
        
        } elif $json[json_decode_index] == "\"" {
            skip_string $json;
            if level == 1 {
                add slice($json, prev_i, json_decode_index - 1) to arr;
            }
        
        } elif $json[json_decode_index] in "-0123456789" {
            skip_number $json;
            if level == 1 {
                add slice($json, prev_i, json_decode_index - 1) to arr;
            }
        
        } elif startswith_from(json_decode_index, $json, "true") {
            json_decode_index += 4;
            if level == 1 {
                add "true" to arr;
            }
            
        } elif startswith_from(json_decode_index, $json, "false") {
            json_decode_index += 5;
            if level == 1 {
                add "false" to arr;
            }

        } elif startswith_from(json_decode_index, $json, "null") {
            json_decode_index += 4;
            if level == 1 {
                add "null" to arr;
            }
        }

        if latest_bracket[1] == "{" {
            if $json[json_decode_index] == ":" {
                ret &= ":";
                json_decode_index++;
            }
        }

        if $json[json_decode_index] == "," {
            ret &= ",";
            json_decode_index++;
        }
    }
}

proc add_to_kv kv, val {
    if $kv == "k" {
        add $val to keys;
    } else {
        add $val to values;
    }
}

proc decode_object json {
    delete keys;
    delete values;

    json_decode_index++;

    local ret = "";
    local level = 1;
    local last_level1_arr = 0;
    local latest_bracket = "{";
    local kv = "k";

    until json_decode_index > length $json or level == 0 {
        skip_whitespace $json;
        local prev_i = json_decode_index;
        
        if $json[json_decode_index] in "{[" {
            latest_bracket = $json[json_decode_index] & latest_bracket;
            if level == 1 {
                last_level1_arr = json_decode_index;
            }
            level++;
            json_decode_index++;

        } elif $json[json_decode_index] in "}]" {
            latest_bracket = slice(latest_bracket, 2, length latest_bracket);
            level--;
            if level == 1 {
                add_to_kv kv, slice($json, last_level1_arr, json_decode_index);
                last_level1_arr = 0;
            }
            json_decode_index++;
        
        
        } elif $json[json_decode_index] == "\"" {
            skip_string $json;
            if level == 1 {
                add_to_kv kv, slice($json, prev_i, json_decode_index - 1);
            }
        
        } elif $json[json_decode_index] in "-0123456789" {
            skip_number $json;
            if level == 1 {
                add_to_kv kv, slice($json, prev_i, json_decode_index - 1);
            }
        
        } elif startswith_from(json_decode_index, $json, "true") {
            json_decode_index += 4;
            if level == 1 {
                add_to_kv kv, "true";
            }
            
        } elif startswith_from(json_decode_index, $json, "false") {
            json_decode_index += 5;
            if level == 1 {
                add_to_kv kv, "true";
            }

        } elif startswith_from(json_decode_index, $json, "null") {
            json_decode_index += 4;
            if level == 1 {
                add_to_kv kv, "null";
            }
        }

        if latest_bracket[1] == "{" {
            if $json[json_decode_index] == ":" {
                if level == 1 {
                    kv = "v";
                }
                ret &= ":";
                json_decode_index++;
            }
        }

        if $json[json_decode_index] == "," {
            if level == 1{
                kv = "k";
            }
            ret &= ",";
            json_decode_index++;
        }
    }
}


proc skip_whitespace json {
    until $json[json_decode_index] not in " \t\n\r" or json_decode_index > length $json {
        json_decode_index++;
    }
}

proc skip_string json {
    json_decode_index++;

    until $json[json_decode_index] == "\"" {
        if $json[json_decode_index] == "\\" {
            json_decode_index++;
            local next = $json[json_decode_index];
            if next in "\"\\/bfnrt" {
                json_decode_index++;
            } elif next == "u" {
                json_decode_index += 5;
            } # else {
                # error
            # }
        } else {
            json_decode_index++;
        }
    }
    json_decode_index++;
}

proc skip_number json {
    if $json[json_decode_index] == "-" {
        json_decode_index++;
    }

    if $json[json_decode_index] == "0" {
        json_decode_index++;

    } elif $json[json_decode_index] in "123456789" {
        until $json[json_decode_index] not in "0123456789" or json_decode_index > length $json {
            json_decode_index++;
        }
    } else {
        return "NaN";
    }

    # fraction
    if $json[json_decode_index] == "." {
        json_decode_index++;

        until $json[json_decode_index] not in "0123456789" or json_decode_index > length $json {
            json_decode_index++;
        }
    }

    # exponent
    if $json[json_decode_index] == "e" {
        # ^^ Scratch is not case sensitive; this also detects "E"
        json_decode_index++;

        if $json[json_decode_index] == "-" {
            json_decode_index++;

        } elif $json[json_decode_index] == "+" {
            json_decode_index++;
        
        } # elif $json[json_decode_index] not in "0123456789" {
            # This causes error
        # }
        # We can assume there will be a digit now, due to the check above ^^
        json_decode_index++;
        
        until $json[json_decode_index] not in "0123456789" or json_decode_index > length $json {
            json_decode_index++;
        }
    }
}

## encoder

# use the JSONValue struct for compatability with the decoder
# It means you input a type and a value
func encode(JSONValue r) {
    if $r.type == "object" {
        # All contents of the input object should already be JSON escaped
        local ret = "{";
        local i = 1;
        repeat length keys {
            ret &= keys[i] & ": " & values[i];
            if i < length keys {
                ret &= ", ";
            }
            i++;
        }

        ret &= "}";
        return ret;
        
    } elif $r.type == "array" {
        # All contents of the input array should already be JSON escaped
        local ret = "[";
        local i = 1;
        # Using the same list 'arr' as the decoder
        repeat length arr {
            ret &= arr[i];
            if i < length arr {
                ret &= ", ";
            }
            i++;
        }
        ret &= "]";
        return ret;

    } else {
        return encode_value($r);
    }
        
}

func encode_string(s) {
    local i = 1;
    local ret = "\"";
    
    repeat length $s {
        if $s[i] == "\"" {
            ret &= "\\\"";
        } elif $s[i] == "\\" {
            ret &= "\\\\";
        # } elif $s[i] == "/" {
        #     # Solidus doesn't actually NEED to be escaped
        #     ret &= "\\/";
        # \f causes bugs, so I will skip it
        # Not sure if scratch can even detect \n
        } elif $s[i] == "\n" {
            ret &= "\\n";
        } elif $s[i] == "\r" {
            ret &= "\\r";
        # Strangely, scratch equates \t with 0, but you can bypass this using the contains block
        } elif $s[i] == "\t" and $s[i] in "\t"{
            ret &= "\\t";
        } else {
            ret &= $s[i];
        }
        # You do not need to encode unicode 

        i++;
    }

    return ret & "\"";
}

func encode_value(JSONValue r) {
    if $r.type == "string" {
        return encode_string($r.value);

    } elif $r.type == "number" {
        return $r.value; # scratch internally uses the JS object notation anyways

    } elif $r.type == "true" {
        return "true";

    } elif $r.type == "false" {
        return "false";
        
    } elif $r.type == "null" {
        return "null";
    }
}
