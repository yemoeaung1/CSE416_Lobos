package com.lobos.lobos_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.lobos.lobos_server")
public class LobosServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(LobosServerApplication.class, args);
	}

}
