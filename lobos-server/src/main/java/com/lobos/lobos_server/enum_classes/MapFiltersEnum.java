package com.lobos.lobos_server.enum_classes;

public enum MapFiltersEnum {
    DEMOGRAPHIC("Demographic"),
    ECONOMIC("Economic"),
    REGION_TYPE("Region Type"),
    POVERTY_LEVEL("Poverty Level"),
    ECO_DEMOGRAPHIC("Economic/Demographic"),
    ECO_POLITICAL("Political/Income");

    private String str;

    MapFiltersEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
    
    public static MapFiltersEnum fromValue(String value) {
        for (MapFiltersEnum filter : MapFiltersEnum.values()) {
            if (filter.str.equals(value)) {
                return filter;
            }
        }
        throw new IllegalArgumentException("No enum constant with value: " + value);
    }
}
