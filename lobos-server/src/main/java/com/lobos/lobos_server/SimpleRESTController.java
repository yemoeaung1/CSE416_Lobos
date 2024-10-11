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
            @RequestParam(value = "state", required = false) String state) {

        Map<String, Object> data = new HashMap<>();
        data.put("Population", Integer.parseInt("100000"));
        data.put("Income", Integer.parseInt("100000"));
        data.put("Race", "White");
        data.put("Party", "Democrat");

        return data;
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