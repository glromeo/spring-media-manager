package org.codebite.springmediamanager;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CommonsRequestLoggingFilter;

import static java.util.Arrays.asList;

@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    static final String PROXY_USERNAME = "proxy_username";
    static final String PROXY_PASSWORD = "proxy_password";


    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.authorizeRequests()
                .antMatchers("/api/**").authenticated()
                .and()
                .httpBasic();

        http.csrf().disable();
        http.cors();
    }

    @Bean
    public UserDetailsService userDetailsService() {

        String username = PROXY_USERNAME;
        String password = PROXY_PASSWORD;

        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        String encodedPassword = passwordEncoder().encode(password);
        manager.createUser(User.withUsername(username).password(encodedPassword).roles("USER").build());
        return manager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CommonsRequestLoggingFilter logFilter() {
        CommonsRequestLoggingFilter filter = new CommonsRequestLoggingFilter();
        filter.setIncludeQueryString(true);
        filter.setIncludePayload(false);
        filter.setMaxPayloadLength(10000);
        filter.setIncludeHeaders(true);
        return filter;
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.applyPermitDefaultValues();
        configuration.setAllowedOrigins(asList("*"));
        configuration.setAllowedMethods(asList("GET", "POST", "OPTIONS", "PUT"));
        configuration.setAllowedHeaders(asList(
                "Content-Type",
                "X-Requested-With",
                "accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
