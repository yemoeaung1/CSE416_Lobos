package com.lobos.lobos_server.enum_classes;

public enum MapViewsEnum {
    NONE("None"),
    STATE("State"),
    DISTRICT("District"),
    PRECINCT("Precinct");

    private String str;

    MapViewsEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
}
