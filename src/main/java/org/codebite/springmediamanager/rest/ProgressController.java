package org.codebite.springmediamanager.rest;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ProgressController {

    @Autowired
    private SimpMessagingTemplate template;

    @MessageMapping("/progress")
    @SendTo("/topic/progress")
    public ProgressStatus greeting(CheckProgress message) {
        new Thread(()->{
            for (int i = 1; i < 101; i++) {
                try {
                    Thread.sleep(60);
                } catch (InterruptedException e) {
                    return;
                }
                template.convertAndSend("/topic/progress", ProgressStatus.builder()
                        .operation(message.operation)
                        .value(i)
                        .build());
            }
        }).start();
        return ProgressStatus.builder()
                .operation(message.operation)
                .value(0)
                .build();
    }

    @Getter
    @Setter
    public static class CheckProgress {

        private String operation;
    }

    @Builder
    @Getter
    @Setter
    public static class ProgressStatus {

        private String operation;
        private int value;
    }
}
