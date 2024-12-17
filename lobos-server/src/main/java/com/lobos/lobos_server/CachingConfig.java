package com.lobos.lobos_server;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CachingConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            "state-info-cache", "state-map-cache", "state-map-legend-cache", "state-map-config-cache", 
            "district-info-cache", "district-plan-cache", 
            "precinct-data-cache", "precinct-info-cache", "precinct-info-map-name-cache", "precinct-info-map-geoid-cache");
    }
}