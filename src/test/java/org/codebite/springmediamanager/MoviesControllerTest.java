package org.codebite.springmediamanager;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureDataMongo
public class MoviesControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void discover() throws Exception {
        mvc.perform(post("/discover/media")
                .with(httpBasic(SecurityConfig.PROXY_USERNAME, SecurityConfig.PROXY_PASSWORD))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("path", "V:\\")
        ).andExpect(status().isOk());
    }
}