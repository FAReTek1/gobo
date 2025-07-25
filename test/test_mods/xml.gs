%include ../xml

list xmlfile = file ```xml.xml```;

onflag {
    xml = "";
    i = 1;
    repeat length xmlfile {
        xml &= xmlfile[i] & "\n";
        i++;
    }
    xml = "test<p param=12, param2 = \"string\">Sample text<em> bruh </em> idk</p> end";

    parse_xml xml;
}
