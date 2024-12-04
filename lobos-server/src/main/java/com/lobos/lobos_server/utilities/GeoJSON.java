package com.lobos.lobos_server.utilities;

<<<<<<< HEAD
import java.util.List;
import java.util.Map;

public class GeoJSON {
    private String type;
=======
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ClassPathResource;

import com.fasterxml.jackson.databind.ObjectMapper;

public class GeoJSON {
    private String type;
    private String name;
    private Object crs;
>>>>>>> 6464916494d359df2d75fe099a682e666b410758
    private List<Feature> features;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

<<<<<<< HEAD
=======
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getCrs() {
        return crs;
    }

    public void setCrs(Object crs) {
        this.crs = crs;
    }

>>>>>>> 6464916494d359df2d75fe099a682e666b410758
    public List<Feature> getFeatures() {
        return features;
    }

    public void setFeatures(List<Feature> features) {
        this.features = features;
    }

<<<<<<< HEAD
=======
    public static GeoJSON parseGeoJsonAsMap(String filename) throws IOException {
        ClassPathResource resource = new ClassPathResource("data/" + filename);

        ObjectMapper objectMapper = new ObjectMapper();
        
        Path path = resource.getFile().toPath();

        if (!Files.exists(path)) {
            throw new IOException("GeoJSON file not found: " + filename);
        }

        String geoJsonString = Files.readString(path);
        return objectMapper.readValue(geoJsonString, GeoJSON.class);
    }

>>>>>>> 6464916494d359df2d75fe099a682e666b410758
    public static class Feature {
        private String type;
        private Map<String, Object> properties;
        private Object geometry;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Map<String, Object> getProperties() {
            return properties;
        }

        public void setProperties(Map<String, Object> properties) {
            this.properties = properties;
        }

        public Object getGeometry() {
            return geometry;
        }

        public void setGeometry(Object geometry) {
            this.geometry = geometry;
        }
    }
}

