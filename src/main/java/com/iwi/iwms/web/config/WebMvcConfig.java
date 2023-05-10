package com.iwi.iwms.web.config;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

	private static final String TIMEZONE = "Asia/Seoul";
	
	@PostConstruct
	public void timezone() {
		TimeZone.setDefault(TimeZone.getTimeZone(TIMEZONE));
	}
	
    public void addViewControllers(ViewControllerRegistry registry) {
    	registry.addViewController("/").setViewName("notice/notice");
    	
    	registry.addViewController("/notice").setViewName("notice/notice");
    	registry.addViewController("/notice/detail").setViewName("notice/detail");
    	registry.addViewController("/system").setViewName("system/user");
    	registry.addViewController("/system/user").setViewName("system/user");
    }
}

