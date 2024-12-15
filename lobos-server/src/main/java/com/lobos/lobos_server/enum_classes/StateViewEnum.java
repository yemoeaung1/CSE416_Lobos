package com.lobos.lobos_server.enum_classes;

public enum StateViewEnum {
    NONE("None"),
    STATE("State"),
    DISTRICT("District"),
    PRECINCT("Precinct");

    private String str;

    StateViewEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
}
