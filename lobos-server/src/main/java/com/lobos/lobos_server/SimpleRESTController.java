package com.lobos.lobos_server;

import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.File;

import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SimpleRESTController {
    @GetMapping("/state-info")
    public Map<String, Object> getInfo(
            @RequestParam(value = "state", required = true) String state) {

        ObjectMapper objectMapper = new ObjectMapper();

        String stateAbbr = "";

        switch(state){
            case "Utah": stateAbbr = "ut"; break;
            case "South Carolina": stateAbbr = "sc"; break;
        }

        String stateJSON = "src/main/resources/data/" + stateAbbr + "_info.json";

        try {
            // Read JSON file and map it to a generic Map
            Map<String, Object> data = objectMapper.readValue(new File(stateJSON), Map.class);
            System.out.println(data);

            return data;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @GetMapping("/state-data")
    public Map<String, Object> getData(
            @RequestParam(value = "state", required = false) String name) {

        // Title
        // x-min
        // x-max
        // x-label
        // y-min
        // y-max
        // y-label
        // color
        // state
        // district
        // precincet
        // data

        Map<String, Object> data = new HashMap<>();
        return data;
    }
}