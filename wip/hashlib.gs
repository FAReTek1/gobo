# Based on https://www.metamorphosite.com/one-way-hash-encryption-sha1-data-software

# list console;
# proc pt txt {
#     add $txt to console;
# }

%include ../string
%include ../math
%include ../char
%include ../bitwise_str

list chunks;
list words;

func sha1(text) {
    # delete console;

    local h0 = "01100111010001010010001100000001";
    local h1 = "11101111110011011010101110001001";
    local h2 = "10011000101110101101110011111110";
    local h3 = "00010000001100100101010001110110";
    local h4 = "11000011110100101110000111110000";

    # Generate binary message (Steps 1 - 6)    
    local i = 1;
    local og_msg = "";


    repeat length $text {
        local val = ord($text[i]);

        val = convert_base(val, B10_DIGITS, B2_DIGITS);
        val = zfill(val, 8);

        og_msg &= val;
        i++;
    }


    local message = og_msg & 1;

    until length message % 512 == 448 {
        message &= 0;
    }

    message &= zfill(convert_base(length og_msg, B10_DIGITS, B2_DIGITS), 64);

    # Step 7 - Chunk the message into 512 bit chunks
    delete chunks;
    i = 1;
    repeat length message / 512 {
        add slice(message, i, i + 511) to chunks;
        i += 512;
    }

    # Step 8 - Break the chunk into 16 32-bit 'words'
    local chunk_i = 1;
    repeat length chunks {
        # enumerate(...)
        chunk = chunks[chunk_i]; chunk_i++;
        # ... #

        delete words;
        local j = 1;
        repeat length chunk / 32 {
            add slice(chunk, j, j + 31) to words;
            j += 32;
        }

        # Step 10 - init some vars
        local a = h0;
        local b = h1;
        local c = h2;
        local d = h3;
        local e = h4;

        # step 9: extend into 80 words
        local i = 17;
        repeat 80 - 16 {
            local w1 = words[i - 3];
            local w2 = words[i - 8];
            local w3 = words[i - 14];
            local w4 = words[i - 16];

            local new = w1;
            new = bwXOR_str(new, w2);
            new = bwXOR_str(new, w3);
            new = bwXOR_str(new, w4);

            # left rotate of 1 - this could become a string 'method'
            new = slice(new, 2, length new) & new[1];

            add new to words;

            i++;
        }


        # Step 11 - main loop, which we are kind of already in
        # Step 11.1 - 4 choices
        # words 0-19 -> func1
        # 20-39 -> f2
        # 40-59 -> f3
        # 60-79 -> f4

        i = 1;
        repeat length words {
            # pt "--------------------";
            # pt "word: " & i - 1 & "real: " & i;

            if i < 21 {
                # func1
                local f = bwOR_str(bwAND_str(b, c), bwAND_str(bwNOT_str(b), d));
                local k = "01011010100000100111100110011001";

            } elif i < 41 {
                # func2
                local f = bwXOR_str(bwXOR_str(b, c), d);
                local k = "01101110110110011110101110100001";

            } elif i < 61 {
                # func3
                local f = bwOR_str(bwOR_str(bwAND_str(b, c), bwAND_str(b, d)), bwAND_str(c, d));
                local k = "10001111000110111011110011011100";

            } else {
                # func4
                local f = bwXOR_str(bwXOR_str(b, c), d);
                local k = "11001010011000101100000111010110";
            }
            # pt "f: " & f;
            
            # Step 11.2 - put them together
            local temp = slice(a, 6, length a) & slice(a, 1, 5);

            temp = BIN(temp);
            temp += BIN(f) + BIN(e) + BIN(k) + BIN(words[i]);
            temp = convert_base(temp, B10_DIGITS, B2_DIGITS);



            temp = slice(temp, 1 + (length temp - 32), length temp);

            e = d;
            d = c;
            c = slice(b, 31, length b) & slice(b, 1, 30);
            b = a;
            a = temp;

            # pt "trunc temp: " & temp;
            # pt "e = d: " & e;
            # pt "d = c: " & d;
            # pt "c = b lr 30: " & c;
            # pt "b = a: " & b;
            # pt "a = temp: " & a;

            i++;
        }
    }

    
    # pt "pre h0: " & h0;
    # pt "add a: " & a;
    
    h0 = BIN(h0);
    h0 += BIN(a);
    h0 = convert_base(h0, B10_DIGITS, B2_DIGITS);
    h0 = slice(h0, 1 + length h0 - 32, length h0);
    # pt "post h0: " & h0;

    # pt "pre h1: " & h1;
    # pt "add b: " & b;
    
    h1 = BIN(h1);
    h1 += BIN(b);
    h1 = convert_base(h1, B10_DIGITS, B2_DIGITS);
    h1 = slice(h1, 1 + length h1 - 32, length h1);
    # pt "post h1: " & h1;

    # pt "pre h2: " & h2;
    # pt "add c: " & c;
    
    h2 = BIN(h2);
    h2 += BIN(c);
    h2 = convert_base(h2, B10_DIGITS, B2_DIGITS);
    h2 = slice(h2, 1 + length h2 - 32, length h2);
    # pt "post h2: " & h2;

    # pt "pre h3: " & h3;
    # pt "add d: " & d;
    
    h3 = BIN(h3);
    h3 += BIN(d);
    h3 = convert_base(h3, B10_DIGITS, B2_DIGITS);
    h3 = slice(h3, 1 + length h3 - 32, length h3);
    # pt "post h3: " & h3;

    # pt "pre h4: " & h4;
    # pt "add e: " & e;
    
    h4 = BIN(h4);
    h4 += BIN(e);
    h4 = convert_base(h4, B10_DIGITS, B2_DIGITS);

    h4 = slice(h4, 1 + length h4 - 32, length h4);
    # pt "post h4: " & h4;

    h0 = convert_base(h0, B2_DIGITS, B16_DIGITS); 
    h1 = convert_base(h1, B2_DIGITS, B16_DIGITS); 
    h2 = convert_base(h2, B2_DIGITS, B16_DIGITS); 
    h3 = convert_base(h3, B2_DIGITS, B16_DIGITS); 
    h4 = convert_base(h4, B2_DIGITS, B16_DIGITS); 

    return h0 & h1 & h2 & h3 & h4;
}
