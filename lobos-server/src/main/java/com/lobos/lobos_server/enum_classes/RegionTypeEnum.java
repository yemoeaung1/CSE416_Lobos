package com.lobos.lobos_server.enum_classes;

public enum RegionTypeEnum {
    URBAN("Urban"),
    SUBURBAN("Suburban"),
    RURAL("Rural");

    private String str;

    RegionTypeEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
}
