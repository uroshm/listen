package com.listen.services;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import java.io.FileInputStream;
import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.listen.repositories.PatientRepository;
import com.listen.repositories.PatientTestRepository;

@ExtendWith(MockitoExtension.class)
class ListenServiceTest {

  @Mock private PatientRepository patientRepository;
  @Mock private PatientTestRepository patientTestRepository;
  @Mock private TranscriptionService transcriptionService;

  @InjectMocks private ListenService listenService;

  @Test
  void uploadAudio() throws IOException {
    FileInputStream fileInputStream = new FileInputStream("src/test/resources/cowOverMoon.wav");
    MultipartFile file =
        new MockMultipartFile("file", "cowOverMoon.wav", "audio/wav", fileInputStream);
    when(transcriptionService.transcribeAudio(any(MultipartFile.class), anyString()))
        .thenReturn("helloWorld");
    when(transcriptionService.getPhonemesFromText(anyString()))
        .thenReturn(
            new TranscriptionService.PhonemeResult(
                "helloWorld", "h e l o w o r l d", "h e l o w o r l d"));
    var result = listenService.uploadAudio(file, "hello world");

    assertNotNull(result);
  }
}
