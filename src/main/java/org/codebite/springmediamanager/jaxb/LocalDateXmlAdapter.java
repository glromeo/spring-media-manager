package org.codebite.springmediamanager.jaxb;

import javax.xml.bind.annotation.adapters.XmlAdapter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LocalDateXmlAdapter extends XmlAdapter<String, LocalDate> {

    private static DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDate unmarshal(String text) throws Exception {
        return LocalDate.parse(text, formatter);
    }

    @Override
    public String marshal(LocalDate localDate) throws Exception {
        return localDate.format(formatter);
    }
}
