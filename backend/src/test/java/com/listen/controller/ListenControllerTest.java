package com.listen.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@Disabled
class ListenControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void uploadAudio() throws Exception {
        // Create a mock audio file
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test-audio.wav",
                "audio/wav",
                "test audio content".getBytes());

        // Perform the file upload request and verify the response
        mockMvc.perform(multipart("/listen/uploadAudio").file(mockFile))
                .andExpect(status().isOk())
                .andExpect(content().string("Expected transcription result"));
    }
}
