package com.lobos.lobos_server.enum_classes;

public enum StatesEnum {
    NONE("None"),
    UTAH("Utah"),
    SOUTH_CAROLINA("South Carolina");

    private String str;

    StatesEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
}