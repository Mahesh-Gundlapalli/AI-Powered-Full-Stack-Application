package com.example.ai_backend.service;

import com.example.ai_backend.payload.CricketResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.model.StreamingChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.image.ImageModel;
import org.springframework.ai.image.ImageOptionsBuilder;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.openai.OpenAiImageModel;
import org.springframework.ai.openai.OpenAiImageOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ChatService {

    @Autowired
    private ChatModel chatModel;

    @Autowired
    private OpenAiImageModel imageModel;

    @Autowired
    private StreamingChatModel streamingChatModel;

    public String generateResponse(String inputText) {
        String response = chatModel.call(inputText);
        return response;
    }

    public Flux<String> generateStreamResponse(String inputText){
        Flux<String> streamResponse = streamingChatModel.stream(inputText);
        return streamResponse;
    }

    public CricketResponse generateCricketResponse(String inputText) throws IOException {
        String template = this.loadPromptTemplate("prompts/cricket_bot_prompts.txt");
        String promptString = this.putValue(template, Map.of("InputText",inputText));
        ChatResponse cricketResponse =  chatModel.call(
            new Prompt(promptString)
        );

        String responseString = cricketResponse.getResult().getOutput().getText();
        ObjectMapper mapper = new ObjectMapper();
        CricketResponse cricketResponse1 = mapper.readValue(responseString, CricketResponse.class);
        return cricketResponse1;
    }

    public List<String> generateImages(String imageDesc,int numbers) throws IOException {
        String template = this.loadPromptTemplate("prompts/image_bot_prompts.txt");
        String promptString = this.putValue(template, Map.of( "description", imageDesc ));
              //  "numberOfImages", numbers + "",
              //   "description", imageDesc
              //  "size", size
       // ));
        ImageResponse imageResponse = imageModel.call(new ImagePrompt(promptString, OpenAiImageOptions.builder()
                .model("dall-e-2")
                .N(numbers)
                .height(512)
                .width(512)
                .build()
        ));
//        ImageResponse imageResponse = imageModel.call(new ImagePrompt(promptString));
        List<String> imageUrls = imageResponse.getResults().stream().map(generation ->generation.getOutput().getUrl()).collect(Collectors.toList());
        return imageUrls;
    }

    //load prompt from classpath
    public String loadPromptTemplate(String fileName) throws IOException {
        Path filePath = new ClassPathResource(fileName).getFile().toPath();
        return Files.readString(filePath);
    }

    //Put inputText in prompt
    public  String putValue(String template, Map<String,String> variables){
        for(Map.Entry<String,String> entry:variables.entrySet()){
            template = template.replace("{" + entry.getKey() + "}" ,entry.getValue());
        }
        return template;
    }
}
