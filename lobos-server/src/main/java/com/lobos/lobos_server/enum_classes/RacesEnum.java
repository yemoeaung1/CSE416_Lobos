package com.lobos.lobos_server.enum_classes;

public enum RacesEnum {
    DEMOGRAPHIC("Demographic"),
    ECONOMIC("Economic"),
    REGION_TYPE("Region Type"),
    POVERTY_LEVEL("Poverty Level"),
    ECO_DEMOGRAPHIC("Economic/Demographic"),
    ECO_POLITICAL("Economic/Political");

    private String str;

    RacesEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
}