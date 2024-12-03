package com.lobos.lobos_server.enum_classes;

public enum StateViewEnum {
    STATE("state"),
    DISTRICT("district"),
    PRECINCT("precinct");

    private String str;

    StateViewEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
}
