# Run the project for encoding/decoding JSON
# ---
# There is not yet rigorous error checking. Also, the code is a bit weird, and I should improve it.
# ---
# This was written in goboscript ( https://github.com/aspizu/goboscript ), and the source code for this project can be found here: https://github.com/FAReTek1/json


%include ..\json

costumes "blank.svg";

onflag {
    hide;

    forever{
        hide keys; hide values; hide arr;
        ask "encode/decode (e/d)";
        ans = answer()[1];

        if ans == "e" {
            ask "Encoding type: arr/obj/num/str/(blank to use decoded JSON)";
            JSONValue to_encode = JSONValue{};
            if answer() == "" {
                to_encode = r;
            } elif answer() == "str" {
                to_encode.type = "string";
                ask "encoding string: ";
                to_encode.value = answer();
            } elif answer() == "num" {
                to_encode.type = "number";
                ask "encoding number: ";
                to_encode.value = answer();
            } elif answer() == "obj" {
                delete keys; delete values;
                show keys; show values;
                to_encode.type = "object";

                until answer()[1] == "n" {
                    ask "key: ";
                    add answer() to keys;
                    ask "value: ";
                    add answer() to values;
                    ask "continue? (y/n)";
                }
            } elif answer() == "arr" {
                delete arr;
                show arr;
                to_encode.type = "array";

                until answer()[1] == "n" {
                    ask "add value: ";
                    add answer() to arr;
                    ask "continue? (y/n)";
                }
            } else {
                ask "Well I'll just use the previous decoded data";
                to_encode = r;
            }

            encoded = encode(to_encode);
            
            ask "Encoded JSON: " & encoded;

        } elif ans == "d" {
            ask "decode what?";
            JSONValue r = decode(answer());

            if r.type == "array" {
                show arr;
            } elif r.type == "object" {
                show keys;
                show values;
            }

            ask r.type & ": \n" & r.value;
        }
    }
}
