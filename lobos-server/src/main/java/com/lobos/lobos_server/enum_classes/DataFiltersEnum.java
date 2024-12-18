package com.lobos.lobos_server.enum_classes;

public enum DataFiltersEnum {
    PARTY("Party"),
    RACE("Race"),
    MINORITY("Minority Group"),
    INCOME("Income"),
    REGION_TYPE("Region Type");

    private String str;

    DataFiltersEnum(String str) {
        this.str = str;
    }

    public String toString() {
        return this.str;
    }
    
    public static DataFiltersEnum fromValue(String value) {
        for (DataFiltersEnum filter : DataFiltersEnum.values()) {
            if (filter.str.equals(value)) {
                return filter;
            }
        }
        throw new IllegalArgumentException("No enum constant with value: " + value);
    }
}
